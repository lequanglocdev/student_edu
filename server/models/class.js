const { model, Schema } = require("mongoose");

const classSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    maxStudents: {
      type: Number,
      default: 40,
    },
    enrolledStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    schedule: [{
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
    }],
  },
  { timestamps: true }
);

module.exports = model("Class", classSchema);
