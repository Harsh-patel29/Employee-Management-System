import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiError } from '../Utils/ApiError.js';
import { projectlogo } from '../Utils/cloudinary.js';
import { taskattachments } from '../Utils/cloudinary.js';
import { attachment } from '../Utils/cloudinary.js';
const uploadlogo = AsyncHandler(async (req, res, next) => {
  const logoLocalPath = req.files?.logo?.[0]?.path;

  if (!logoLocalPath) {
    throw new ApiError(404, 'Logo is required');
  }

  let logophoto;

  try {
    logophoto = await projectlogo(logoLocalPath);
    console.log('logo uploaded');
  } catch (error) {
    console.log('Error in uploading logo', error);
    throw new ApiError(500, 'Failed to upload logo');
  }
  req.logodetail = logophoto;

  next();
});

const uploadtaskAttachment = AsyncHandler(async (req, res, next) => {
  const attachments = req.files?.attachments;
  if (!attachments || attachments.length === 0) {
    throw new ApiError(400, 'Attachments are required');
  }
  const attachmentsLocalPaths = attachments.map((file) => file.path);

  let attachmentphoto;
  try {
    attachmentphoto = await taskattachments(attachmentsLocalPaths);
    console.log('Attachment uploaded');
  } catch (error) {
    console.log('Error in uploading attachment', error);
    throw new ApiError(500, 'Failed to upload attachment');
  }
  req.attachmentdetail = attachmentphoto;

  next();
});

const uploadAttachment = AsyncHandler(async (req, res, next) => {
  const attachments = req.files?.attachment;
  if (!attachment || attachment.length === 0) {
    throw new ApiError(404, 'Attachment is required');
  }
  const attachmentsLocalPaths = attachments.map((file) => file.path);
  let attachmentphoto;
  try {
    attachmentphoto = await attachment(attachmentsLocalPaths);
    console.log('attachment uploaded');
  } catch (error) {
    console.log('Error in uploading attachment', error);
    throw new ApiError(
      500,
      'Failed to upload attachment.Check File Size',
      error
    );
  }
  req.attachment = attachmentphoto;

  next();
});

export { uploadlogo, uploadtaskAttachment, uploadAttachment };
