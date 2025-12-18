import cloudinary from "../lib/cloudinary.js";

export const uploadSingleImages = async (image, folder) => {
  try {
    if (!image || !image.startsWith("data:image")) return null;

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: folder || "farmers",
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    return uploaded.secure_url;
  } catch (error) {
    console.error("Upload error:", error.message);
    return null;
  }
};
