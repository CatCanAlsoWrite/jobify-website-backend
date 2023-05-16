import express from 'express'
const router = express.Router()

import { register, login, updateUser } from '../controllers/authController.js'

import authenticateUser from '../middleware/authenticateUser.js'

router.route('/register').post(register)
router.route('/login').post(login)
// router.route('/updateUser').patch(updateUser)
router.route('/updateUser').patch(authenticateUser, updateUser) //`use middleware to add authentication which can let only authenticated user do sth`

export default router
