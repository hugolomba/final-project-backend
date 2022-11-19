const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"], // tipos de arquivos que vamos permitir
    folder: "final-project", // nome da pasta que será criada no cloudinary
    overwrite: true,
    // public_id: "profile-image",
  },
});

module.exports = multer({ storage });
