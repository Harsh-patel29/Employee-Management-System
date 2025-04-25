import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const firstfilename = path.basename(
      localFilePath,
      path.extname(localFilePath)
    );

    const extname = path.extname(localFilePath);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-CA').split('/').join('-');
    const formattedTime = now.toLocaleTimeString('en-IN').split('-').join('/');

    const filename = `${firstfilename}${formattedDate}${formattedTime}${extname}`;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'image',
      folder: 'attendance',
      public_id: filename,
    });
    console.log('File uploaded on Cloudinary. File src:' + response.secure_url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log('Error on Cloudinary', error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const projectlogo = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const firstfilename = path.basename(
      localFilePath,
      path.extname(localFilePath)
    );

    const extname = path.extname(localFilePath);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-CA').split('/').join('-');
    const formattedTime = now.toLocaleTimeString('en-IN').split('-').join('/');

    const filename = `${firstfilename}${formattedDate}${formattedTime}${extname}`;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'image',
      folder: 'projectlogo',
      public_id: filename,
    });
    console.log('File uploaded on Cloudinary. File src:' + response.secure_url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log('Error on Cloudinary', error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const taskattachments = async (filepaths) => {
  if (!filepaths || filepaths.length === 0) return [];

  const uploadedAttachments = [];

  for (const localFilePath of filepaths) {
    const firstfilename = path.basename(
      localFilePath,
      path.extname(localFilePath)
    );

    const extname = path.extname(localFilePath);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-CA').split('/').join('-');
    const formattedTime = now.toLocaleTimeString('en-IN').split('-').join('/');

    const filename = `${firstfilename}${formattedDate}${formattedTime}${extname}`;
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto',
        folder: 'taskattachments',
        public_id: filename,
      });
      console.log(
        'File uploaded on Cloudinary. File src:' + response.secure_url
      );
      fs.unlinkSync(localFilePath);
      uploadedAttachments.push(response);
    } catch (error) {
      console.log('Error on Cloudinary', error);
      fs.unlinkSync(localFilePath);
    }
  }
  return uploadedAttachments;
};

const attachment = async (filepaths) => {
  if (!filepaths || filepaths.length === 0) return [];

  const uploadedAttachments = [];
  for (const localFilePath of filepaths) {
    const firstfilename = path.basename(
      localFilePath,
      path.extname(localFilePath)
    );

    const extname = path.extname(localFilePath);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-CA').split('/').join('-');
    const formattedTime = now.toLocaleTimeString('en-IN').split('-').join('/');

    const filename = `${firstfilename}${formattedDate}${formattedTime}${extname}`;
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto',
        folder: 'attachment',
        public_id: filename,
      });
      console.log(
        'File uploaded on Cloudinary. File src:' + response.secure_url
      );
      fs.unlinkSync(localFilePath);
      uploadedAttachments.push(response);
    } catch (error) {
      console.log('Error on Cloudinary', error);
      fs.unlinkSync(localFilePath);
    }
  }
  return uploadedAttachments;
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted from cloudinary. PUBLIC id', publicId);
    return result;
  } catch (error) {
    console.log('Error deleting from cloudinary', error);
    return null;
  }
};

export {
  uploadOnCloudinary,
  projectlogo,
  taskattachments,
  deleteFromCloudinary,
  attachment,
};
