import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { apiError } from "./apiError.js";
import { cloudinary_folder_name } from "../constants.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

const uploadOnCloudinary = async (localFilePath, folder = "", public_id = "") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: `${cloudinary_folder_name}/${folder}`,
      public_id: public_id,
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

const destroyFromCloudinary = async (cloudinaryFileUrl) => {
  try {
    if (!cloudinaryFileUrl) return null;
    const publicId = extractPublicId(cloudinaryFileUrl);

    if (!publicId) {
      throw new apiError(
        400,
        "Invalid Cloudinary file URL or publicId extraction failed"
      );
    }

    //destroy file on cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", // Use "image" or "video" as appropriate
    });
    return response;
  } catch (error) {
    throw new apiError(500, "Something went wrong while deleting file");
  }
};

function extractPublicId(cloudinaryUrl) {
  try {
    const url = new URL(cloudinaryUrl);
    const parts = url.pathname.split("/");

    const uploadIndex = parts.findIndex((part) => part === "upload");

    const publicIdParts = parts.slice(uploadIndex + 2);

    if (publicIdParts.length === 0) return null;

    const filename = publicIdParts.join("/");
    const publicId = filename.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    return null;
  }
}

export { uploadOnCloudinary, destroyFromCloudinary };
