const { model, Schema, Types } = require("mongoose");

const registerCourse = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: Types.ObjectId,
      ref: 'Course',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    fee: {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = model("Registration", registerCourse);
