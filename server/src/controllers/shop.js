const getDatabase = require('../db/getDatabase')
const getUserForHeaders = require('../lib/getUserFromHeaders')

const getPreferencesShops = async (req, res) => {
  try {
    const db = new getDatabase()
    const sustainabilityNames = req.body.sustainabilityNames
    const categoryNames = req.body.categoryNames
    const categories = await db.getPreferencesShops(sustainabilityNames, categoryNames)

    res.status(200).send({ categories })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}


const filterShops = async (req, res) => {
  try {
    const db = new getDatabase();
    const categoryName = req.body.categoryName;
    const tagName = req.body.tagName;
    const sustainabilityTagName = req.body.sustainabilityTagName;
    const page = req.body.page;
    const pageSize = req.body.pageSize;

    const { shops, total } = await db.filterShops(categoryName, tagName, sustainabilityTagName, page, pageSize);

    res.status(200).send({ shops, total });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: error.message });
  }
};


const getShop = async (req, res) => {

  try {
    const db = new getDatabase()
    const shopId = req.body.id
    const userId = req.body.userId || null

    const shop = await db.getShop(shopId, userId)
    res.status(200).send({ shop })
  } catch (error) {

    res.status(500).send({ message: error.message })
  }
}

const getShopsByCoordinates = async (req, res) => {

  try {
    const db = new getDatabase()
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    const sustainabilityNames = req.body.sustainabilityNames
    const categoryNames = req.body.categoryNames
    const shopId = req.body.shopId
    const page = req.body.page
    const pageSize = req.body.pageSize

    const { results } = await db.getShopsByCoordinates(latitude, longitude, sustainabilityNames, categoryNames, shopId, page, pageSize)
    res.status(200).send({ shops: results })

  } catch (error) {

    res.status(500).send({ message: error.message })

  }
}

const searchShops = async (req, res) => {
  try {
    const db = new getDatabase()
    const search = req.body.search
    const page = req.body.page
    const pageSize = req.body.pageSize

    const { results, total } = await db.searchShops(search, page, pageSize)
    res.status(200).send({ shops: results, total })

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}



module.exports = {
  getPreferencesShops,
  filterShops,
  getShop,
  getShopsByCoordinates,
  searchShops,
}