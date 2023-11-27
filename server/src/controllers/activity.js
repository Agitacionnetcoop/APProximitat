const getDatabase = require('../db/getDatabase')
const path = require('path');



// We reuse the function. It can accept a category id or not. 
const getAllActivities = async (req, res) => {
  try {
    const db = new getDatabase()
    const page = req.body.page
    const pageSize = req.body.pageSize
    const activityCatId = req.body.activityCatId
    const { tags } = await db.getActivitiesTags()
    const { results } = await db.getAllActivities(page, pageSize, activityCatId)

    res.status(200).send({ tags, activities: results })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}


const getActivityById = async (req, res) => {
  try {
    const db = new getDatabase();
    const id = req.body.activityId;
    const activity = await db.getActivityById(id);
    res.status(200).send({ activity });
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

// const shareActivity = async (req, res) => {
//   try {
//     const id = req.body.id
//     const url = `http://www.coapp.info-redes.net:3000/redirect?to=activity/${id}`
//     res.status(200).send({ url: url })
//   } catch (error) {
//     res.status(500).send({ message: error.message })
//   }
// }

module.exports = {
  getAllActivities,
  getActivityById,
  // shareActivity
}