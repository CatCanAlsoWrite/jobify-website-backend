import express from 'express'
const router = express.Router()

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStates,
} from '../controllers/jobController.js'

// import authenticateUser from './middleware/authenticateUser.js'

router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').delete(deleteJob).patch(updateJob)
router.route('/states').get(showStates)

/*`use middleware to add authentication which can let only authenticated user do sth (short code with setting in 'server.js' only once )`*/
// router
//   .route('/')
//   .post(authenticateUser, createJob)
//   .get(authenticateUser,getAllJobs)
// router
//   .route('/:id')
//   .delete(authenticateUser, deleteJob)
//   .patch(authenticateUser,updateJob)
// router.route('/states').get(authenticateUser, showStates)

export default router
