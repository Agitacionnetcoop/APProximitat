const getDatabase = require('../db/getDatabase')
const sendVerifyEmail = require('../lib/email/verifyEmail')
const sendLoginEmail = require('../lib/email/loginEmail')
const { createJWT } = require('../lib/jwt/JWTHandler')
const getUserForHeaders = require('../lib/getUserFromHeaders')
const saveOrUpdatePlayerId = require('../lib/checkPlayerId')
const { nanoid } = require('nanoid')
const fetch = require('node-fetch');
const checkUniqueNanoid = require('../lib/checkUniqueNanoid')
const { json } = require('express')

const getLiterals = async (req, res) => {
  try {
    const db = new getDatabase()
    const literals = await db.getLiterals()
    const categories = await db.getCategories()
    const sustainabilityTags = await db.getSustainabilityTags()
    const icons = await db.getIcons()
    res.status(200).send({ literals, categories, sustainabilityTags, icons })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const register = async (req, res) => {
  try {
    const db = new getDatabase()
    const name = req.body.name
    const email = req.body.email

    const public_id = await checkUniqueNanoid()

    const newUser = await db.register(public_id, name, email)

    if (newUser.error) {
      res.status(401).send({ message: 'User already exists' })
      return

    } else {

      //TODO: delete after publish
      // await sendVerifyEmail(newUser)
      res.status(200).send({ user: newUser })

    }

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const verify = async (req, res) => {
  try {
    const db = new getDatabase()
    const userId = req.body.userId
    const userVerified = await db.verify(userId)
    res.status(200).send({ user: userVerified })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const getCode = async (req, res) => {
  try {
    const db = new getDatabase()
    const email = req.body.email

    const user = await db.getUserByEmail(email)

    if (!user) {
      res.status(401).send({ message: 'No user found' })
      return
    }


    let code;
    //TODO: Delete after publish
    if (email === 'test@dallonses.com') {
      code = "0000"
    } else {

      code = nanoid(4)
    }

    try {
      await sendLoginEmail(user, code)
    } catch (error) {
      res.send({ message: "Email wasn't send" })
    }

    if (code !== "0000") {
      await db.setCode(user, code)
    }
    res.status(200).send({ user })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const db = new getDatabase()
    const email = req.body.email
    const code = req.body.code
    const playerId = req.body.playerId

    //TODO: Delete after publish
    // if (email === 'test@dallonses.com') {
    //   const user = await db.login(email)
    //   const userCode = "0000"
    //   const token = createJWT({ userId: user.id })
    //   res.status(200).send({ user, token })
    //   return
    // }

    await db.deleteExpiredCode(email)
    const userCode = await db.getCode(email)

    if (!userCode || userCode.code !== code || userCode.email !== email) {
      res.status(401).send({ message: 'Invalid code or email' })
      return
    }

    const currentTime = new Date().getTime()
    const codeTime = new Date(userCode.data).getTime()
    const expirationTime = 300000
    const timeDifference = currentTime - codeTime;


    if (timeDifference <= expirationTime) {
      const user = await db.login(email)
      const existplayerId = await saveOrUpdatePlayerId(user.id, playerId)

      if (!user) {
        res.status(401).send({ message: 'Unauthorized' })
        return
      }

      const token = createJWT({ userId: user.id })
      res.status(200).send({ user, token })
    } else {
      res.status(500).send({ message: "Code has expired" })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const profile = async (req, res) => {
  try {
    const db = new getDatabase()
    const user = await getUserForHeaders(req.headers)

    if (!user) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }

    const { id } = user

    const name = req.body.name
    const email = req.body.email
    const updatedUser = await db.profile(id, name, email)

    res.status(200).send({ user: updatedUser })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const toggleFavorite = async (req, res) => {
  try {
    const db = new getDatabase()
    const user = await getUserForHeaders(req.headers)

    if (!user) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }

    const { id } = user
    const shopId = req.body.shopId
    const favorite = await db.toggleFavorite(shopId, id)
    res.status(200).send(favorite)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const userPurchases = async (req, res) => {
  try {
    const db = new getDatabase()
    const user = await getUserForHeaders(req.headers)

    if (!user) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }
    const { id } = user
    const purchases = await db.userPurchases(id)

    res.status(200).send(purchases)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const favorites = async (req, res) => {
  try {
    const db = new getDatabase()
    const user = await getUserForHeaders(req.headers)

    if (!user) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }
    const { id } = user
    const favorites = await db.favorites(id)

    res.status(200).send(favorites)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const listNotifications = async (req, res) => {
  try {
    const db = new getDatabase()
    const user = await getUserForHeaders(req.headers)

    if (!user) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }
    const { id } = user
    const notifications = await db.listNotifications(id)

    res.status(200).send(notifications)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const readNotifications = async (req, res) => {
  try {
    const db = new getDatabase()
    const user = await getUserForHeaders(req.headers)

    if (!user) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }

    const notificationsId = req.body.notificationsId
    const notification = await db.readNotifications(notificationsId)

    res.status(200).send(notification)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}


const sendNotification = async (req, res) => {
  const { public_userId, shopId, offerId } = req.params;

  if (!shopId || !public_userId) {
    const missingParam = !shopId ? 'shop Id' : 'user Id';
    res.status(401).send({ message: `No ${missingParam} found` });
    return;
  }

  try {
    const db = new getDatabase();
    const user = await db.getUserByPublicId(public_userId);

    const playerId = await db.getPlayerId(user.id);
    if (!playerId) {
      res.status(401).send({ message: 'No playerId found ' });
      return;
    }

    const shop = await db.getShop(shopId, user.id);
    const { name: shopName, offer } = shop;

    const isCompleted = offer.user_purchases === offer.max_purchases;

    const headingsText = isCompleted ? `Has completat l'oferta de ${shopName}.` : `Compra registrada a ${shopName}!`;
    const response = await sendOneSignalNotification(playerId, headingsText);



    res.status(200).send({ message: 'Notification sent' });
  } catch (error) {
    console.error('error:', error);
    res.status(500).send({ error: 'Error on sending notification' });
  }
};

const sendOneSignalNotification = async (playerId, headingsText) => {
  const url = 'https://onesignal.com/api/v1/notifications';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      name: 'Test-push',
      include_player_ids: [playerId],
      contents: { en: headingsText, es: headingsText },
      headings: { en: 'Approximitat', es: 'Approximitat' },
    })
  };

  const response = await fetch(url, options);
  const json = await response.json();
  return json;
};

const getUnreadNotificationsNumber = async (req, res) => {
  try {

    const db = new getDatabase()
    const userId = req.body.userId

    if (!userId) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }

    const unreadNumber = await db.getUnreadNotificationsNumber(userId)

    res.status(200).send({ unreadNumber })

  } catch (error) {

    res.status(500).send({ message: error.message })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const db = new getDatabase()
    const user = await getUserForHeaders(req.headers)

    if (!user) {
      res.status(401).send({ message: 'Unauthorized' })
      return
    }
    const { id } = user
    const deletedUser = await db.deleteAccount(id)

    res.status(200).send(deletedUser)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

module.exports = {
  getLiterals,
  register,
  verify,
  getCode,
  login,
  profile,
  userPurchases,
  toggleFavorite,
  favorites,
  listNotifications,
  sendNotification,
  readNotifications,
  getUnreadNotificationsNumber,
  deleteAccount,
}
