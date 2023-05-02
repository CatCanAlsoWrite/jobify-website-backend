import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'

/*(1)redundant code*/
// const register = async (req, res) => {
//   try {
//     const user = await User.create(req.body)
//     res.status(201).json({ user })
//   } catch (err) {
//     res.status(500).json({ err })
//   }
// }

/*(2)use 'next()' to recall 'errorHandlerMiddleware()'*/
// const register = async (req, res, next) => {
//   try {
//     const user = await User.create(req.body)
//     res.status(201).json({ user })
//   } catch (err) {
//     next(err)
//   }
// }

/*(3)use 'express-async-errors'(import in 'server.js') to recall 'errorHandlerMiddleware()'*/
// const register = async (req, res) => {
//   const user = await User.create(req.body)
//   // res.status(201).json({ user })
//   res.status(StatusCodes.CREATED).json({ user }) //`use 'StatusCodes.CREATED' to replace '201'`
// }

/*(4)split 'req.body', then use condition to log err.message, then add it to 'error-handler.js' middleware */
// const register = async (req, res) => {
//   const { name, email, password } = req.body

//   if (!name || !email || !password) {
//     throw new Error('Please provide all values')
//   }

// const userAlreadyExists = await User.findOne({ email })
// if (userAlreadyExists) {
//   throw new Error('Email already in use')
// }

//   const user = await User.create({ name, email, password })

//   res.status(StatusCodes.CREATED).json({ user })
// }

/*(5)add 'BadRequestError' and 'NotFoundError' class to inherit and modify 'statusCode' from 'Error' class, then add it to 'error-handler.js' middleware */
// class BadRequestError extends Error {
//   constructor(message) {
//     super(message)
//     this.statusCode = StatusCodes.BAD_REQUEST
//   }
// }

// class NotFoundError extends Error {
//   constructor(message) {
//     super(message)
//     this.statusCode = StatusCodes.NOT_FOUND
//   }
// }

// const register = async (req, res) => {
//   const { name, email, password } = req.body

//   if (!name || !email || !password) {
//     throw new BadRequestError('Please provide all values')
//   }

//   const userAlreadyExists = await User.findOne({ email })
//   if (userAlreadyExists) {
//     throw new BadRequestError('Email already in use')
//   }

//   const user = await User.create({ name, email, password })
//   res.status(StatusCodes.CREATED).json({ user })
// }

/*(6)use 'index.js' in 'errors' folder to tidy codes */
import { BadRequestError } from '../errors/index.js'

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const userAlreadyExists = await User.findOne({ email })
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use')
  }

  const user = await User.create({ name, email, password })

  /*(01)call 'createJWT()' function directly */
  // user.createJWT() //{name:xxx, email:xxx, password:xxx} //`use function 'createJWT()' created in 'User.js' to deal with data from 'req.body'`
  // res.status(StatusCodes.CREATED).json({ user })

  /*(02)call 'createJWT()' function with variable*/
  // const token = user.createJWT()
  // res.status(StatusCodes.CREATED).json({ user, token })

  /*(03)call 'createJWT()' function with only part of data showing in the frontend*/
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    },
    token,
  })
}

const login = async (req, res) => {
  const user = await User.findOne({ email })

  res.status(StatusCodes.OK).json({ user })
}
const updateUser = async (req, res) => {
  res.send('updateUser')
}
export { register, login, updateUser }
