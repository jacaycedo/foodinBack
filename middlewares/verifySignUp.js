const {db} = require('../db/mongoConexion')

checkDuplicatedUsernameOrEmail = async (req, res, next) => {
  const foodie = await db()
    .collection('foodies')
    .findOne({$or: [{username: req.body.username}, {email: req.body.email}]})
  if (foodie) {
    res.status(400).send({message: 'Failed! Username is already in use!'})
    return
  }
  next()
}

module.exports = checkDuplicatedUsernameOrEmail
