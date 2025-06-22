import express from 'express'
import authentication from '../middleware/middleware.js'
import { applyJob, getApplicants, getAppliedjobs, updateStatus } from '../Controllers/applicationController.js'

const router = express.Router()

router.route("/apply/:id").get(authentication,applyJob)
router.route("/getapplications").get(authentication,getAppliedjobs)
router.route("/getapplicants/:id").get(authentication,getApplicants)
router.route("/status/:id").post(authentication,updateStatus)

export default router