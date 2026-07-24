import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  console.log("Controller Hit");
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ScentAura",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    console.log("CLOUDINARY RESULT:", result);

    res.json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};