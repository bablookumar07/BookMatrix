import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return {
      success: true,
      skipped: true,
    };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      console.warn(
        `Cloudinary image deletion returned: ${result.result}`
      );
    }

    return {
      success: true,
      result: result.result,
    };
  } catch (error) {
    console.error(
      "Cloudinary delete error:",
      error.message
    );

    return {
      success: false,
      result: "error",
    };
  }
};

export default deleteFromCloudinary;