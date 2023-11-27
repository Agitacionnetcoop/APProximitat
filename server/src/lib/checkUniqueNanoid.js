const getDatabase = require('../db/getDatabase')
const { nanoid, customAlphabet } = require('nanoid')


const checkUniqueNanoid = async () => {
  const db = new getDatabase();
  const customCode = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

  const generatedNanoid = customCode();

  try {
    const existingRecord = await db.findRecordByNanoid(generatedNanoid);

    if (existingRecord) {
      return await checkUniqueNanoid();
    } else {
      return generatedNanoid;
    }

  } catch (error) {
    console.log('Error', error);
    return null;
  }
}

module.exports = checkUniqueNanoid;
