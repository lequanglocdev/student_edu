const { createSchedule,getSchedule,getScheduleByCourseId} = require("../controllers/schedule")
const {veryfyUser} = require("../utils/veryfyUser")


const router = require("express").Router()


router.post('/create', veryfyUser,createSchedule)
router.get('/getSchedule', getSchedule)
router.get('/getScheduleByCourseId/:courseId', getScheduleByCourseId);
// router.delete('/deletecourse/:courseId/:userId', veryfyUser, deleteCourse)
// router.put('/updatepost/:postId/:userId', veryfyUser, updatepost)
module.exports = router