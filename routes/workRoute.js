import express from 'express'
import multer from 'multer'
const upload = multer({ dest: 'uploads/'})
import { createWorkDone, updateWorkDone, getItems, getItem, deleteItem } from '../controllers/workController.js'
import { adminProtect } from '../middleware/adminMiddleware.js'
const router = express.Router()

router.route("/add").post(adminProtect, upload.single('image'),createWorkDone)
router.route("/update/:id").put(adminProtect, upload.single('image'),updateWorkDone)
router.route("/").get(getItems)
router.route("/:id").get(getItem)
router.route("/delete/:id").delete(adminProtect, deleteItem)

export default router