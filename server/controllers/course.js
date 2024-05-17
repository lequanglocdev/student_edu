const Course = require("../models/course");
const { errorHandler } = require("../utils/error");

const createCourse = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a course'));
  }
  const { courseCode, courseName, credits, mandatory,  } = req.body;
  if (!courseCode || !courseName || !credits) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newCourse = new Course({ courseCode, courseName, credits, mandatory });
  try {
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
}

// const getCourse = async (req, res, next) => {
//   try {
//     const courses = await Course.find(req.query);
//     res.status(200).json(courses);
//   } catch (error) {
//     next(error);
//   }
// }
const  getCourse = async(req,res,next) =>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Course.find({
      ...(req.query.courseCode && { courseCode: req.query.courseCode }),
      ...(req.query.courseName && { courseName: req.query.courseName }),
      ...(req.query.credits && { credits: req.query.credits }),
      ...(req.query.mandatory && { _id: req.query.mandatory }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Course.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Course.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
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
