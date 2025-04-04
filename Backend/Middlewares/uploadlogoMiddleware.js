import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { projectlogo } from "../Utils/cloudinary.js";

const uploadlogo = AsyncHandler(async (req, res, next) => {
  const logoLocalPath = req.files?.logo?.[0]?.path;

  if (!logoLocalPath) {
    throw new ApiError(404, "Logo is required");
  }

  let logophoto;

  try {
    logophoto = await projectlogo(logoLocalPath);
    console.log("logo uploaded");
  } catch (error) {
    console.log("Error in uploading logo", error);
    throw new ApiError(500, "Failed to upload logo");
  }
  req.logodetail = logophoto;

  next();
});

export { uploadlogo };
