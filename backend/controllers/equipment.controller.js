import { Product } from "../models/product.model.js";
import { calculateDistanceInKm } from "../utils/distance.js";

const buildEquipmentResponse = (product, userLat, userLng) => {
  const plainProduct = product.toObject ? product.toObject() : product;
  const distance = calculateDistanceInKm(
    userLat,
    userLng,
    plainProduct.location?.lat,
    plainProduct.location?.lng
  );

  return {
    ...plainProduct,
    distanceInKm: distance,
    supplierRating: plainProduct.supplier?.averageRating || 0,
    productRating: plainProduct.averageRating || 0,
  };
};

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 12, 1), 48);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const EQUIPMENT_SELECT =
  "equipmentName category brand model condition images pricing location averageRating status supplier createdAt availability";

export const getRecommendedEquipment = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const products = await Product.find({ status: "Approved" })
      .select(EQUIPMENT_SELECT)
      .populate("supplier", "name companyName averageRating Address")
      .sort({ averageRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const equipmentList = products
      .map((product) => buildEquipmentResponse(product, lat, lng))
      .sort((firstItem, secondItem) => {
        if (secondItem.productRating !== firstItem.productRating) {
          return secondItem.productRating - firstItem.productRating;
        }

        if (secondItem.supplierRating !== firstItem.supplierRating) {
          return secondItem.supplierRating - firstItem.supplierRating;
        }

        const firstDistance =
          firstItem.distanceInKm === null ? Number.MAX_SAFE_INTEGER : firstItem.distanceInKm;
        const secondDistance =
          secondItem.distanceInKm === null ? Number.MAX_SAFE_INTEGER : secondItem.distanceInKm;

        return firstDistance - secondDistance;
      });

    const total = await Product.countDocuments({ status: "Approved" });

    res.set("Cache-Control", "private, max-age=30");
    return res.status(200).json({
      equipment: equipmentList,
      page,
      limit,
      total,
      hasMore: skip + products.length < total,
    });
  } catch (error) {
    console.error("Recommended equipment error:", error);
    return res.status(500).json({ message: "Failed to load recommended equipment" });
  }
};

export const searchEquipment = async (req, res) => {
  try {
    const { query = "", location = "", lat, lng } = req.query;
    const { page, limit, skip } = getPagination(req.query);
    const searchFilter = { status: "Approved" };

    if (query.trim()) {
      searchFilter.equipmentName = { $regex: query.trim(), $options: "i" };
    }

    if (location.trim()) {
      searchFilter.$or = [
        { "location.city": { $regex: location.trim(), $options: "i" } },
        { "location.address": { $regex: location.trim(), $options: "i" } },
        { "location.state": { $regex: location.trim(), $options: "i" } },
      ];
    }

    const products = await Product.find(searchFilter)
      .select(EQUIPMENT_SELECT)
      .populate("supplier", "name companyName averageRating Address")
      .skip(skip)
      .limit(limit)
      .lean();

    const equipmentList = products.map((product) => buildEquipmentResponse(product, lat, lng));
    const shouldSortByDistance = lat !== undefined && lng !== undefined;

    equipmentList.sort((firstItem, secondItem) => {
      if (shouldSortByDistance) {
        const firstDistance =
          firstItem.distanceInKm === null ? Number.MAX_SAFE_INTEGER : firstItem.distanceInKm;
        const secondDistance =
          secondItem.distanceInKm === null ? Number.MAX_SAFE_INTEGER : secondItem.distanceInKm;

        if (firstDistance !== secondDistance) {
          return firstDistance - secondDistance;
        }
      }

      return secondItem.productRating - firstItem.productRating;
    });

    const total = await Product.countDocuments(searchFilter);

    res.set("Cache-Control", "private, max-age=30");
    return res.status(200).json({
      equipment: equipmentList,
      page,
      limit,
      total,
      hasMore: skip + products.length < total,
    });
  } catch (error) {
    console.error("Search equipment error:", error);
    return res.status(500).json({ message: "Failed to search equipment" });
  }
};
