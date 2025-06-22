import express from 'express'
import { login, logOut, register, updatedProfile } from '../Controllers/userController.js'
import authentication from '../middleware/middleware.js'
import { singleUpload } from '../middleware/multer.js'

const router = express.Router()

router.route("/register").post(singleUpload,register)
router.route("/login").post(login)
router.route("/logout").get(logOut)
router.route("/profile/update").post(singleUpload,authentication,updatedProfile)

export default router