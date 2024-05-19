const { model, Schema } = require("mongoose");

const courseRegistrationSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    tuitionFee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Đã đăng ký', 'Đã hủy', 'Đã hoàn thành'],
      default: 'Đã đăng ký',
    },
  },
  { timestamps: true }
);

// Middleware to automatically calculate the tuition fee before saving
courseRegistrationSchema.pre('save', async function(next) {
  const course = await this.model('Course').findById(this.course);
  if (course) {
    this.tuitionFee = parseInt(course.credits) * 900;
  } else {
    throw new Error('Course not found');
  }
  next();
});

module.exports = model("CourseRegistration", courseRegistrationSchema);
