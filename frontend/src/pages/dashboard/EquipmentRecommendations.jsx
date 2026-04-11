import React from "react";
import { MapPin, Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/product.store.js";

const getLocationFromBrowser = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => reject(new Error("Unable to fetch current location"))
    );
  });

const formatDistance = (distanceInKm) => {
  if (distanceInKm === null || distanceInKm === undefined) {
    return "Distance unavailable";
  }

  return `${distanceInKm} km away`;
};

function EquipmentCard({ item }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/equipment/${item._id}`)}
      className="w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="mb-3 h-40 overflow-hidden rounded-lg bg-gray-100">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.equipmentName}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">{item.equipmentName}</h3>
            <p className="text-sm text-gray-500">{item.location?.city || "Unknown city"}</p>
          </div>
          <span className="rounded bg-green-50 px-2 py-1 text-sm font-medium text-green-700">
            Rs {item.pricing?.dailyRate || 0}/day
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-500 text-yellow-500" />
            {item.averageRating || 0}
          </span>
          <span>Supplier {item.supplierRating || 0}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} />
          <span>{formatDistance(item.distanceInKm)}</span>
        </div>
      </div>
    </button>
  );
}

export default function EquipmentRecommendations() {
  const {
    recommendedEquipment,
    searchResults,
    recommendationLoading,
    searchLoading,
    searchPerformed,
    recommendationPage,
    searchPage,
    hasMoreRecommendations,
    hasMoreSearchResults,
    getRecommendedEquipment,
    searchEquipment,
    clearSearchResults,
  } = useProductStore();

  const [query, setQuery] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [coords, setCoords] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    getRecommendedEquipment();
  }, [getRecommendedEquipment]);

  const handleUseMyLocation = async () => {
    try {
      setError("");
      const currentCoords = await getLocationFromBrowser();
      setCoords(currentCoords);
      await getRecommendedEquipment(currentCoords);
    } catch (locationError) {
      setError(locationError.message);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");

    if (!query.trim() && !location.trim() && !coords) {
      clearSearchResults();
      await getRecommendedEquipment();
      return;
    }

    await searchEquipment({
      query,
      location,
      lat: coords?.lat,
      lng: coords?.lng,
    });
  };

  const displayList = searchPerformed ? searchResults : recommendedEquipment;
  const isLoading = recommendationLoading || searchLoading;
  const isInitialLoading = isLoading && displayList.length === 0;
  const hasMore = searchPerformed ? hasMoreSearchResults : hasMoreRecommendations;

  const handleLoadMore = async () => {
    if (searchPerformed) {
      await searchEquipment(
        {
          query,
          location,
          lat: coords?.lat,
          lng: coords?.lng,
        },
        { page: searchPage + 1, append: true }
      );
      return;
    }

    await getRecommendedEquipment(coords || {}, {
      page: recommendationPage + 1,
      append: true,
    });
  };

  return (
    <div className="w-full max-w-6xl px-4 py-6 text-black">
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-green-700">Recommended Equipment</h1>
        <p className="mt-1 text-sm text-gray-600">
          Sorted by equipment rating, supplier rating, and nearest location.
        </p>

        <form onSubmit={handleSearch} className="mt-5 grid gap-3 md:grid-cols-[2fr_2fr_auto_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search equipment name"
            className="rounded-lg border px-4 py-3 outline-none"
          />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter city or address"
            className="rounded-lg border px-4 py-3 outline-none"
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="rounded-lg border border-green-700 px-4 py-3 text-green-700"
          >
            Use my location
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-white"
          >
            <Search size={16} />
            Search
          </button>
        </form>

        {coords ? (
          <p className="mt-3 text-sm text-gray-600">
            Current coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </p>
        ) : null}

        {searchPerformed ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setLocation("");
              clearSearchResults();
            }}
            className="mt-3 text-sm text-green-700 underline"
          >
            Clear search
          </button>
        ) : null}

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      {isInitialLoading ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
          Loading equipment...
        </div>
      ) : displayList.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {displayList.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="rounded-lg bg-green-700 px-5 py-3 text-white disabled:opacity-60"
              >
                Load more
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
          No equipment found.
        </div>
      )}
    </div>
  );
}
