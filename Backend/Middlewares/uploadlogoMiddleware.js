import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";

const uploadlogo = AsyncHandler(async (req, res, next) => {
  console.log(req.files);

  const logoLocalPath = req.files?.logo?.[0]?.path;

  if (!logoLocalPath) {
    throw new ApiError(404, "Logo is required");
  }

  let logophoto;

  try {
    logophoto = await uploadOnCloudinary(logoLocalPath);
    console.log("logo uploaded");
  } catch (error) {
    console.log("Error in uploading logo", error);
    throw new ApiError(500, "Failed to upload logo");
  }
  req.logo = logophoto?.url;
  req.logodetail = logophoto;

  next();
});

export { uploadlogo };
