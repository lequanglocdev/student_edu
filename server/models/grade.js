const { model, Schema } = require("mongoose");

const gradeSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    midtermGrade: {
      type: Number,
      default: null,
    },
    finalGrade: {
      type: Number,
      default: null,
    },
    totalGrade: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = model("Grade", gradeSchema);
