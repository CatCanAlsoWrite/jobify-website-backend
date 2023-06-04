import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index'

const createJob = async (req, res) => {
  // res.send('createJob')
  const { company, position } = req.body
  if (!company || !position) {
    throw new BadRequestError('Please provide all values')
  }

  req.body.createdBy = req.user.UserId //`already set 'req.user.UserId'='_id' in 'authenticateUser.js', and createdBy 'type'='ObjectId' in 'Job.js', so just set value here`

  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED), json({ job })
}
const deleteJob = async (req, res) => {
  res.send('deleteJob')
}
const getAllJobs = async (req, res) => {
  res.send('getAllJobs')
}
const updateJob = async (req, res) => {
  res.send('updateJob')
}
const showStates = async (req, res) => {
  res.send('showStates')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStates }
