const {
  registerCourse,
  getRegisterCourse,
  getRegistrationsByStudent,
  deleteRegistration
} = require("../controllers/courseRegistration");
const { veryfyUser } = require("../utils/veryfyUser");

const router = require("express").Router();

router.post("/registerCourse", veryfyUser, registerCourse);
router.get("/getRegisterCourse",getRegisterCourse)
router.get("/getRegistrationsByStudent/:userId",getRegistrationsByStudent)
router.delete("/deleteRegistration/:registrationId", veryfyUser, deleteRegistration); 
module.exports = router;
