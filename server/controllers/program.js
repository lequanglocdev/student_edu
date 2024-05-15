const Program = require("../models/program");
const { errorHandler } = require("../utils/error");

const createProgram = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a program'));
  }
  const { programName, department, requiredCredits, courses } = req.body;
  if (!programName || !department || !requiredCredits) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newProgram = new Program({ programName, department, requiredCredits, courses });
  try {
    const savedProgram = await newProgram.save();
    res.status(201).json(savedProgram);
  } catch (error) {
    next(error);
  }
}

const getProgram = async (req, res, next) => {
  try {
    const programs = await Program.find(req.query);
    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
}

const updateProgram = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update this program'));
  }
  try {
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.programId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProgram);
  } catch (error) {
    next(error);
  }
}

const deleteProgram = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this program'));
  }
  try {
    await Program.findByIdAndDelete(req.params.programId);
    res.status(200).json('The program has been deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProgram,
  getProgram,
  updateProgram,
  deleteProgram
};
