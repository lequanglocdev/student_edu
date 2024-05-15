const { model, Schema } = require("mongoose");

const programSchema = new Schema(
  {
    programName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    requiredCredits: {
      type: Number,
      required: true,
    },
    courses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course',
    }],
  },
  { timestamps: true }
);

module.exports = model("Program", programSchema);
