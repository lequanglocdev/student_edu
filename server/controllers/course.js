const Course = require("../models/course");
const { errorHandler } = require("../utils/error");

const createCourse = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a course'));
  }
  const { courseCode, courseName, credits, mandatory, prerequisites } = req.body;
  if (!courseCode || !courseName || !credits) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newCourse = new Course({ courseCode, courseName, credits, mandatory, prerequisites });
  try {
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
}

const getCourse = async (req, res, next) => {
  try {
    const courses = await Course.find(req.query);
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
}

const updateCourse = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update this course'));
  }
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
}

const deleteCourse = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this course'));
  }
  try {
    await Course.findByIdAndDelete(req.params.courseId);
    res.status(200).json('The course has been deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse
};
