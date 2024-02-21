const jwt_decode = require('jwt-decode')
const getDatabase = require('../db/getDatabase')
const { validateJWT } = require('./jwt/JWTHandler')

const getUserForHeaders = async (headers) => {

  const authorization = headers['Authorization'] || headers['authorization']

  if (!authorization) {
    return null
  }

  const authorizationParts = authorization.split(' ')
  const token = authorizationParts[1]

  try {
    const { userId } = await validateJWT(token)
    const db = new getDatabase()
    const user = await db.getUserById(userId)

    return user
  } catch (e) {
    console.log('Error', e)
    return null
  }

}

module.exports = getUserForHeaders