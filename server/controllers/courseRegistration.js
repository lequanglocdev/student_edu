const CourseRegistration = require('../models/courseRegistration');
const Course = require('../models/course');
const Schedule = require('../models/schedule');
const User = require('../models/user');
const { errorHandler } = require("../utils/error");

const registerCourse = async (req, res, next) => {
  try {
    const { studentId, courseId, scheduleId } = req.body;

    // Kiểm tra tham số đầu vào
    if (!studentId || !courseId || !scheduleId) {
      return next(errorHandler(400, 'Missing required fields'));
    }

    // Kiểm tra sự tồn tại của sinh viên
    const student = await User.findById(studentId);
    if (!student) {
      return next(errorHandler(404, 'Student not found'));
    }

    // Kiểm tra sự tồn tại của khóa học
    const course = await Course.findById(courseId);
    if (!course) {
      return next(errorHandler(404, 'Course not found'));
    }

    // Kiểm tra sự tồn tại của lịch học
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return next(errorHandler(404, 'Schedule not found'));
    }

    // Kiểm tra xem sinh viên đã đăng ký khóa học này chưa
    const existingRegistration = await CourseRegistration.findOne({
      student: studentId,
      course: courseId,
      schedule: scheduleId,
    });

    if (existingRegistration) {
      return next(errorHandler(400, 'You have already registered for this course'));
    }

    // Tạo mới đăng ký khóa học
    const newRegistration = new CourseRegistration({
      student: studentId,
      course: courseId,
      schedule: scheduleId,
      tuitionFee: parseInt(course.credits) * 900, // Tính toán học phí
      status: 'Đã đăng ký',
    });

    await newRegistration.save();
    res.status(201).json({ message: 'Course registered successfully', registration: newRegistration });
  } catch (error) {
    next(errorHandler(500, 'Server error', error.message));
  }
};

module.exports = {
  registerCourse,
};
