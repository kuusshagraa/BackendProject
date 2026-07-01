import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import registerUser  from "../controllers/user.controller.js";
const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    ) //using multer middleware to handle file uploads for avatar and coverImage fieldsX
export default router;