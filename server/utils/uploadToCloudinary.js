import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("Image buffer is missing"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "libryo/books",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }

        if (!result) {
          return reject(
            new Error("Cloudinary returned an empty upload result")
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

export { uploadToCloudinary };
export default uploadToCloudinary;