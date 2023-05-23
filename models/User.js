import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    trim: true,
    select: false, //`not to show password in the frontend by default(eg '.findOne()') in 'controller.js' (001), except when '.create()'(but can be solved with hard code 'json({user:{...}})')`
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'my city',
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'last name',
  },
})

/*use 'schema.pre' to create function which will be called before action 'save', use 'bcrypt' to hash password, then can hide it in the frontend/backend*/
UserSchema.pre('save', async function () {
  // console.log(this.password)

  //1.default setting, connect with (solution1) in 'authController.js'
  // const salt = await bcrypt.genSalt(10)
  // this.password = await bcrypt.hash(this.password, salt)

  //2.add condition, connect with (solution2) in 'authController.js'
  // console.log(this.modifiedPaths()) //['name'] `if modified name in 'postman' in 'updateUser' page`
  // console.log(this.isModified('name')) //true `if modified name in 'postman' in 'updateUser' page`
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

/*use 'schema.method' to create 'createJWT(JSON web token)' function, and call it in 'controller.js'*/
// UserSchema.method('createJWT', function () {
//   console.log(this)
// }) //`print data created when call 'createJWT()' function directly in 'controller.js' (01)`

UserSchema.method('createJWT', function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  }) //expiresIn: how long a token is valid
}) //`use 'jsonwebtoken' to securely transmitting information when call 'createJWT()' function directly in 'controller.js' (02)`

/*use 'schema.method' to create 'comparePassword' function, use 'bcrypt' to compare password, and call it in 'controller.js'*/
UserSchema.method('comparePassword', async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
})

export default mongoose.model('User', UserSchema)
