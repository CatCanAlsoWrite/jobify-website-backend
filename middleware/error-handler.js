import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  /*(01)log error message*/
  // res.status(500).json({ msg: 'there was an error' })

  /*(02)log error details*/
  // res.status(500).json({ msg: err })

  /*(03)log error more concisely*/
  const defaultError = {
    // statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    /*set up 'err.statusCode' in 'controller.js (5)'*/
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,

    // msg: 'sth went wrong, try again later',
    /*set up 'err.message' in 'controller.js (4)'*/
    msg: err.message || 'sth went wrong, try again later',
  }

  /*delete 'name', 'email', or 'password' line in register page in 'postman' app to check*/
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    // defaultError.msg = err.message
    defaultError.msg = Object.values(err.errors)
      .map((m) => m.message)
      .join(',') //`use 'Object.values()' to returns an array of values, then use 'map()' to split them, then use 'join()' to add them into one line `
  } //`similar result as 'if (!name || !email || !password){...}' in 'controller.js (4)'`

  /*use the same 'email' in register page in 'postman' app to check*/
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
  } //`similar result as 'if (userAlreadyExists){...}' in 'controller.js (4)'`

  // res.status(defaultError.statusCode).json({ msg: err }) //`use this code to check and set up 'defaultError'`
  res.status(defaultError.statusCode).json({ msg: defaultError.msg }) //`use 'defaultError.statusCode' to replace '500'`
}
export default errorHandlerMiddleware
