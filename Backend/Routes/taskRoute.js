import { Router } from 'express';
import {
  createTask,
  getAlltasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTaskById,
  uploadAttachmentImage,
  Attachment,
  deleteAttachment,
  deleteUploadedImage,
  removeTodo,
} from '../Controllers/task.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
import { upload } from '../Middlewares/multer.Middleware.js';
import {
  uploadtaskAttachment,
  uploadAttachment,
} from '../Middlewares/uploadlogoMiddleware.js';
import {
  assignedProject,
  assigneName,
} from '../Middlewares/UpdatetaskMiddleware.js';
const router = Router();

router.route('/createtask').post(
  upload.fields([
    {
      name: 'logo',
      maxCount: 1,
    },
  ]),
  authenticate,
  createTask
);
router.route('/gettask').get(authenticate, getAlltasks);
router.route('/updatetaskstatus').put(authenticate, updateTaskStatus);
router
  .route('/gettaskbyid/:id')
  .get(authenticate, assignedProject, assigneName, getTaskById);
router.route('/updatetask/:id').put(authenticate, assignedProject, updateTask);
router.route('/upload-attachments').post(
  upload.fields([
    {
      name: 'attachments',
      maxCount: 10,
    },
  ]),
  uploadtaskAttachment,
  uploadAttachmentImage
);

router.route('/upload-attachment').post(
  upload.fields([
    {
      name: 'attachment',
      maxCount: 10,
    },
  ]),
  uploadAttachment,
  Attachment
);
router.route('/delete-attachment').delete(authenticate, deleteAttachment);
router
  .route('/delete-uploaded-image')
  .delete(authenticate, deleteUploadedImage);
router.route('/deletetask/:id').delete(authenticate, deleteTask);
router.route('/remove-todo/:id').post(authenticate, removeTodo);
export default router;
