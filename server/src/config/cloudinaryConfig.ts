import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => ({
    folder: "user_uploads",
    format: file.mimetype.split("/")[1] || "jpg", 
    transformation: [{ width: 500, height: 500, crop: "limit" }], 
    resource_type: "image",
  }),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

export { cloudinary, upload };

