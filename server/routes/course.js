const { createCourse,getCourse,deleteCourse,updateCourse} = require("../controllers/course")
const {veryfyUser} = require("../utils/veryfyUser")


const router = require("express").Router()


router.post('/create', veryfyUser,createCourse)
router.get('/getCourse', getCourse)
router.delete('/deletecourse/:courseId/:userId', veryfyUser, deleteCourse)
router.put('/updatecourse/:courseId/:userId', veryfyUser, updateCourse)
module.exports = router