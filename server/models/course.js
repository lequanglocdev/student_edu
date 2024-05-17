const { model, Schema } = require("mongoose");

const courseSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    credits: {
      type: String,
      required: true,
    },
    mandatory: {
      type: Boolean,
      required: true,
    },
    prerequisites: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],
  },
  { timestamps: true }
);

module.exports = model("Course", courseSchema);
