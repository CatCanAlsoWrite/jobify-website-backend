import unauthenticatedError from '../errors/unauthenticatedError.js'
import jwt from 'jsonwebtoken'

const authenticateUser = async (req, res, next) => {
  // console.log('auth')

  /*1.manually set global '{{token}}'(copied from 'Login' page) in 'postman'-'Environment' */
  /*2.then choose token type 'Bearer' and add global token in 'postman'-'Authorization'-'Token'-'save'-'send' in 'updateUser' page and other pages(which need authentications)*/
  // const headers = req.headers
  // console.log(headers) //{authorization: 'Bearer ...token...','user-agent': ...,...}
  // const authHeader = req.headers.authorization
  // console.log(authHeader) //Bearer ...token...

  /*use code to set global token */
  /*1.set global '{{token}}' using code below in 'postman'-'Test'-'save'-'send' in 'registerUser' page and 'login' page(which create authentications) */
  /*const jsonData = pm.response.json()
  pm.globals.set('token', jsonData.token) //`can choose 'get a global variable' to set directly`*/
  /*2.then choose token type 'Bearer' and add global token  manually in 'postman'-'Authorization'-'Token'-'save'-'send' in 'updateUser' page and other pages(which need authentications)*/
  const authHeader = req.headers.authorization
  // console.log(authHeader) //Bearer ...token...
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new unauthenticatedError('Authentication Invalid')
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) //`verify 'token' with secret key 'process.env.JWT_SECRET'`

    // console.log(payload) //{userID:... , iat:... ,exp:... } `'iat'/Issued At,means the time which jwt was issued; 'exp'/Expired, means the time which jwt must not be accepted for processing`
    req.user = { userID: payload.userID }
    // console.log(req.user) //{userID:...} `then can use 'req.user.userID' in 'authController.js' to add clue to '.findOne()' in pages (which need authentication)`

    next()
  } catch (error) {
    throw new unauthenticatedError('Authentication Invalid')
  }
}
export default authenticateUser
