import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import "dotenv/config.js";
cloudinary.config({
  cloud_name: "drdbweosy",
  api_key: "353115643948757",
  api_secret: "YOU5sLNcnf4q1O_LPxz9AiieMNo"
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'StorageImages'
  }
});

const uploadCloud = multer({ storage });

export default uploadCloud;
