import express from 'express'
const router = express.Router()

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStates,
} from '../controllers/jobController.js'

router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').delete(deleteJob).patch(updateJob)
router.route('/states').get(showStates)

export default router
