const { createSchedule,getSchedule,getScheduleByCourseId} = require("../controllers/schedule")
const {veryfyUser} = require("../utils/veryfyUser")


const router = require("express").Router()


router.post('/create', veryfyUser,createSchedule)
router.get('/ ', getSchedule)
router.get('/getScheduleByCourseId/:courseId', getScheduleByCourseId);

module.exports = router