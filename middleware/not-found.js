const notFoundMiddleware = (req, res) => {
  res.status(404).send('page does not exist')
}
export default notFoundMiddleware
