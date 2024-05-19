const Schedule = require("../models/schedule");
const { errorHandler } = require("../utils/error");

const createSchedule = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a schedule'));
  }
  const { classId,course, dayOfWeek, startTime, endTime,teacher, location } = req.body;
  if (!classId || !course ||!dayOfWeek || !startTime || !endTime || !teacher || !location) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newSchedule = new Schedule({ class: classId, course,dayOfWeek, startTime, endTime, teacher, location });
  try {
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    next(error);
  }
}

const getSchedule = async (req, res, next) => {
  try {
    const schedules = await Schedule.find(req.query);
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
}
const getScheduleByCourseId = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const schedules = await Schedule.find({ course: courseId });
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
}

const updateSchedule = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update this schedule'));
  }
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.scheduleId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedSchedule);
  } catch (error) {
    next(error);
  }
}

const deleteSchedule = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this schedule'));
  }
  try {
    await Schedule.findByIdAndDelete(req.params.scheduleId);
    res.status(200).json('The schedule has been deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSchedule,
  getSchedule,
  getScheduleByCourseId,
  updateSchedule,
  deleteSchedule
};
