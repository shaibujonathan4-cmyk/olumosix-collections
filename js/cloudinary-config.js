// js/cloudinary-config.js
// Shared helper for uploading images directly from the browser to Cloudinary
// using an unsigned upload preset — no backend/server needed.

const CLOUD_NAME = "rh1jqizy";
const UPLOAD_PRESET = "olumosix_unsigned";

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Uploads a File object to Cloudinary and returns its public URL.
 * @param {File} file
 * @returns {Promise<string>} the secure_url of the uploaded image
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "olumosix");

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}