const Class = require("../models/class");
const { errorHandler } = require("../utils/error");

const createClass = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a class'));
  }
  const { course, instructor, semester, year, maxStudents, schedule } = req.body;
  if (!course || !instructor || !semester || !year) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newClass = new Class({ course, instructor, semester, year, maxStudents, schedule });
  try {
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    next(error);
  }
}

const getClass = async (req, res, next) => {
  try {

    const classes = await Class.find(req.query);
    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
}

const updateClass = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update this class'));
  }
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.classId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedClass);
  } catch (error) {
    next(error);
  }
}

const deleteClass = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this class'));
  }
  try {
    await Class.findByIdAndDelete(req.params.classId);
    res.status(200).json('The class has been deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass
};
