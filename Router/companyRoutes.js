import express from 'express'
import authentication from '../middleware/middleware.js'
import { deleteCompany, getCompany, getSingleCompany, registerCompany, updateCompany } from '../Controllers/companyController.js'
import { singleUpload } from '../middleware/multer.js'

const router = express.Router()

router.route("/register").post(singleUpload,authentication,registerCompany)
router.route("/get").get(authentication,getCompany)
router.route("/get/:id").get(authentication,getSingleCompany)
router.route("/update/:id").post(singleUpload,authentication,updateCompany)
router.route("/delete/:id").delete(authentication,deleteCompany)


export default router