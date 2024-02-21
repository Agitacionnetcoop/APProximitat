const express = require('express');
const router = express.Router();
const path = require('path');
const getDatabase = require('../db/getDatabase')
const activityController = require('../controllers/activity')
const userController = require('../controllers/user')
const shopController = require('../controllers/shop')


//User endpoints
router.get('/redirect', (req, res) => {
  res.render(path.join(__dirname, '../views/redirect'));
});
router.post('/register', userController.register)
router.put('/verify', userController.verify)
router.post('/getCode', userController.getCode)
router.post('/login', userController.login)
router.put('/profile', userController.profile)
router.post('/purchases', userController.userPurchases)
router.put('/toggleFavorites', userController.toggleFavorite)
router.post('/favorites', userController.favorites)
router.post('/listNotifications', userController.listNotifications)
router.post('/sendNotification/:public_userId/:shopId/:offerId', userController.sendNotification)
router.post('/readNotifications', userController.readNotifications)
router.post('/getUnreadNotificationsNumber', userController.getUnreadNotificationsNumber)
router.delete('/deleteAccount', userController.deleteAccount)


//literals
router.get('/literals', userController.getLiterals)


//Categories - Shop endpoints
router.post('/home', shopController.getPreferencesShops)
router.post('/filter', shopController.filterShops)
router.post('/shop', shopController.getShop)
router.post('/map', shopController.getShopsByCoordinates)
router.post('/search', shopController.searchShops)

//Activity endpoints
router.post('/allActivities', activityController.getAllActivities)
router.post('/activityDetail', activityController.getActivityById)
// router.post('/shareActivity', activityController.shareActivity)


module.exports = router;
