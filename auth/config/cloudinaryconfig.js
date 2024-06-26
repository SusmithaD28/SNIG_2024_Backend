require('dotenv').config({ path: "./.env" });

const config = require('cloudinary').v2.config;
const uploader = require('cloudinary').v2.uploader;
const cloudinaryConfig = () => config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinaryConfig, uploader };