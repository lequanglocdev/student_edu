const { createCourse,getCourse} = require("../controllers/course")
const {veryfyUser} = require("../utils/veryfyUser")


const router = require("express").Router()


router.post('/create', veryfyUser,createCourse)
router.get('/getCourse', getCourse)
// router.delete('/deletepost/:postId/:userId', veryfyUser, deletepost)
// router.put('/updatepost/:postId/:userId', veryfyUser, updatepost)
module.exports = router