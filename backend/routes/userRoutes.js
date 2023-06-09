import express from 'express'
const router = express.Router()
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserByID, updateUser, sendVerificationCode, verifyCode } from '../controlers/userControler.js'
import { admin, protect } from '../middleware/authMiddleware.js'


router.route('/').post(registerUser).get(protect, admin, getUsers)

router.post('/login', authUser)

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserByID).put(protect, admin, updateUser)

router.route("/send-code").post(sendVerificationCode);

router.route("/verify-code").post(verifyCode);

export default router