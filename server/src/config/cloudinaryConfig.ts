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

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => ({
    folder: "user_uploads/videos",
    resource_type: "video", 
    format: file.mimetype.split("/")[1] || "mp4",
  }),
});

const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async () => ({
    folder: "certificates",
    resource_type: "raw", 
    format: "pdf",
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

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      cb(new Error("Only video files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const uploadPdf = multer({ storage: pdfStorage });

export { cloudinary, upload, uploadVideo, uploadPdf };

