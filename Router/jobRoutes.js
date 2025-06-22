import express from 'express'
import authentication from '../middleware/middleware.js'
import { createJob, deleteJob, getAdminJobs, getJobById, getJobs, updateJob } from '../Controllers/jobContoller.js'

const router = express.Router()

router.route("/post").post(authentication,createJob)
router.route("/update/:id").post(authentication,updateJob)
router.route("/delete/:id").delete(authentication,deleteJob)
router.route("/getjobs").get(getJobs)
router.route("/getjobs/:id").get(getJobById)
router.route("/getadminjobs").get(authentication,getAdminJobs)

export default router