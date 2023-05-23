import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import authenticateUser from '../middleware/authenticateUser.js'

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
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'

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
  // res.status(StatusCodes.CREATED).json({ user, token, location })

  /*(03)call 'createJWT()' function, and hard code to show only part of data in the frontend*/
  // const token = user.createJWT()
  // res.status(StatusCodes.CREATED).json({
  //   user: {
  //     name: user.name,
  //     lastName: user.lastName,
  //     email: user.email,
  //     location: user.location,
  //   },
  //   token,
  //   location: user.location,
  // })

  /*(04)use 'user.password=undefined' to short the code*/
  const token = user.createJWT()
  user.password = undefined
  user._id = undefined
  user.__v = undefined

  res.status(StatusCodes.CREATED).json({
    user,
    token,
    location: user.location,
  }) //???'user._id = undefined' doesn't work?
}

const login = async (req, res) => {
  // const user = await User.findOne({ email })
  // res.status(StatusCodes.OK).json({ user })

  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT()
  user.password = undefined
  res.status(StatusCodes.OK).json({ user, token, location: user.location })
}

const updateUser = async (req, res) => {
  // res.send('updateUser')

  // console.log(req.user) //`grab data from 'authenticateUser.js' middleware`
  const { name, email, lastName, location } = req.body
  if (!name || !email || !lastName || !location) {
    throw new BadRequestError('Please provide all values')
  }

  //(solution2): add condition to the method 'schema.pre' in 'User.js'
  const user = await User.findOne({ _id: req.user.userID })
  user.name = name
  user.email = email
  user.lastName = lastName
  user.location = location

  await user.save() //`'save()' method was created in 'User.js'`

  /*not necessary to 'createJWT()' again, but better to do that for the reason of get rid of old infos */
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user, token, location: user.location }) //`update in 'postman' calls an error, for the 'schema.pre' method defined a hashing password function before  '.save()' method in 'User.js', which will lead to a double hashed password`

  //(solution1): change '.findOne()' to '.findOneAndUpdate()', then the method 'schema.pre' will not be triggered
  // const user = await User.findOneAndUpdate({ _id: req.user.userID })
  // user.name = name
  // user.email = email
  // user.lastName = lastName
  // user.location = location

  // await user.save()

  // const token = user.createJWT()
  // res.status(StatusCodes.OK).json({ user, token, location: user.location })
}
export { register, login, updateUser }
