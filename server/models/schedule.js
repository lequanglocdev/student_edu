const { model, Schema } = require("mongoose");

const scheduleSchema = new Schema(
  {
    class: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    teacher:{
      type:String,
      require:true
    }
    ,
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Schedule", scheduleSchema);
