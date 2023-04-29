const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  // res.status(500).json({ msg: 'there was an error' })
  res.status(500).json({ err }) //log error details
}
export default errorHandlerMiddleware
