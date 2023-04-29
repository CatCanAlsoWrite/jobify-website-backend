const createJob = async (req, res) => {
  res.send('createJob')
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
