import User from '../models/User.js'

// const register = async (req, res) => {
//   try {
//     const user = await User.create(req.body)
//     res.status(201).json({ user })
//   } catch (err) {
//     res.status(500).json({ err })
//   }
// } //redundant code
// const register = async (req, res, next) => {
//   try {
//     const user = await User.create(req.body)
//     res.status(201).json({ user })
//   } catch (err) {
//     next(err)
//   }
// } //use 'next()' to recall 'errorHandlerMiddleware()'
const register = async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).json({ user })
} //use 'express-async-errors'(import in 'server.js') to recall 'errorHandlerMiddleware()'

const login = async (req, res) => {
  res.send('login')
}
const updateUser = async (req, res) => {
  res.send('updateUser')
}
export { register, login, updateUser }
