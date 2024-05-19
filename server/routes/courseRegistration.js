const { registerCourse} = require("../controllers/courseRegistration")
const {veryfyUser} = require("../utils/veryfyUser")


const router = require("express").Router()


router.post('/registerCourse', veryfyUser,registerCourse)

module.exports = router