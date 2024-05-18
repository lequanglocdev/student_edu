const { createCourse,getCourse,deleteCourse} = require("../controllers/course")
const {veryfyUser} = require("../utils/veryfyUser")


const router = require("express").Router()


router.post('/create', veryfyUser,createCourse)
router.get('/getCourse', getCourse)
router.delete('/deletecourse/:courseId/:userId', veryfyUser, deleteCourse)
// router.put('/updatepost/:postId/:userId', veryfyUser, updatepost)
module.exports = router