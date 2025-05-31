import { Salary } from '../Models/salary.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { ApiError } from '../Utils/ApiError.js';

const generateSalary = AsyncHandler(async (req, res) => {
  const { User, WeekOff, Effective_Date, salary } = req.body;

  if (!req.body) {
    throw new ApiError(403, 'All fields are required');
  }

  const SalaryDetailPerUser = await Salary.find({
    User: req.body.User,
    is_Deleted: false,
  });

  const isSalaryLiesinSameMonth = SalaryDetailPerUser.some(
    (item) =>
      item.Effective_Date.split('-')[1] ===
      req.body.Effective_Date.split('-')[1]
  );

  if (isSalaryLiesinSameMonth) {
    throw new ApiError(
      400,
      'User Salary for this particular month already exists'
    );
  }

  try {
    const createdSalaryData = await Salary.create({
      User: User,
      WeekOff: WeekOff,
      Effective_Date: Effective_Date,
      Salary: salary,
    });
    await createdSalaryData.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, createdSalaryData, 'Salary created Successfully')
      );
  } catch (error) {
    throw new ApiError(
      500,
      error,
      'Something went wrong while assigning Salary'
    );
  }
});

const getSalaryDetail = AsyncHandler(async (req, res) => {
  const SalaryDetail = await Salary.find({})
    .populate('User', 'Name')
    ?.populate('WeekOff', 'WeekOffName');

  const formattedData = SalaryDetail.map((detail) => ({
    _id: detail._id,
    User: detail.User.Name,
    WeekOff: detail.WeekOff?.WeekOffName,
    Effective_Date: detail.Effective_Date,
    Salary: detail.Salary,
    is_Deleted: detail.is_Deleted,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(200, formattedData, 'Salary Details fetched Successfully')
    );
});

const updateSalary = AsyncHandler(async (req, res) => {
  const salarydetail = await Salary.findById(req.body.id);

  if (!salarydetail) {
    throw new ApiError(404, 'Salary Details not found');
  }
  salarydetail.User = req.body.data.User;
  salarydetail.WeekOff = req.body.data.WeekOff;
  salarydetail.Effective_Date = req.body.data.Effective_Date;
  salarydetail.Salary = req.body.data.salary;

  const updatedSalaryDetail = await salarydetail.save();

  const newSalaryDetail = {
    User: updatedSalaryDetail.User,
    WeekOff: updatedSalaryDetail.WeekOff,
    Effective_Date: updatedSalaryDetail.Effective_Date,
    Salary: updatedSalaryDetail.Salary,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newSalaryDetail,
        'Salary detail Updated Successfully'
      )
    );
});

const getSalarybyId = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(403, 'Id is required');
  }
  const salarybyId = await Salary.findById(id);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        salarybyId,
        'Particular Salaru detail fethced Successfully'
      )
    );
});

const deleteSalaryDetail = AsyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(403, 'Id is required');
  }
  const salarybyId = await Salary.findById(id);
  await salarybyId.updateOne({ is_Deleted: true });
  return res
    .status(200)
    .json(
      new ApiResponse(200, salarybyId, 'Particular Salary deleted Successfully')
    );
});

export {
  generateSalary,
  getSalaryDetail,
  updateSalary,
  getSalarybyId,
  deleteSalaryDetail,
};
