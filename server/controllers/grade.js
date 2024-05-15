const Grade = require("../models/grade");
const { errorHandler } = require("../utils/error");

const createGrade = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isInstructor) {
    return next(errorHandler(403, 'You are not allowed to create a grade'));
  }
  const { student, classId, midtermGrade, finalGrade, totalGrade } = req.body;
  if (!student || !classId) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newGrade = new Grade({ student, class: classId, midtermGrade, finalGrade, totalGrade });
  try {
    const savedGrade = await newGrade.save();
    res.status(201).json(savedGrade);
  } catch (error) {
    next(error);
  }
}

const getGrade = async (req, res, next) => {
  try {
    const grades = await Grade.find(req.query);
    res.status(200).json(grades);
  } catch (error) {
    next(error);
  }
}

const updateGrade = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isInstructor) {
    return next(errorHandler(403, 'You are not allowed to update this grade'));
  }
  try {
    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.gradeId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedGrade);
  } catch (error) {
    next(error);
  }
}

const deleteGrade = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isInstructor) {
    return next(errorHandler(403, 'You are not allowed to delete this grade'));
  }
  try {
    await Grade.findByIdAndDelete(req.params.gradeId);
    res.status(200).json('The grade has been deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createGrade,
  getGrade,
  updateGrade,
  deleteGrade
};
