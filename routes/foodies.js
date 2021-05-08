const express = require('express')
const router = express.Router('router')
const verifyToken = require('../middlewares/auth')
const verifySignUp = require('../middlewares/verifySignUp')

const {
  getFoodies,
  getFoodieByUsername,
  insertFoodie,
  editarFoodie,
  agregarReceta,
  listarRecetas,
  insertarRecetaFavorita,
  insertarRestauranteFavorito,
  insertarFollowRestaurante,
  insertarFollowFoodie,
  insertarCategoria,
  listarRestaurantesFollow,
  listarFoodiesFollow,
  listarRestaurantesFavoritos,
  listarRecetasFavoritas,
  logIn
} = require('../controllers/foodie')
const multer = require('multer')
let uploader = multer({dest: 'temp/'})

router.get('/', verifyToken, async function (req, res, next) {
  const foodies = await getFoodies()
  res.send(foodies)
})

router.get('/user/:username', async function (req, res, next) {
  const foodie = await getFoodieByUsername(req.params)
  if (foodie) {
    res.status(200).send(foodie)
  } else {
    res.status(400).send('Foodie not found')
  }
})

router.put('/', verifyToken, async function (req, res, next) {
  const foodie = await editarFoodie(req.body)
  res.send(foodie)
})

router.get('/recetas/:username', async function (req, res, next) {
  const recipes = await listarRecetas(req.params)
  res.send(recipes)
})
router.post(
  '/restaurantesFavoritos',
  verifyToken,
  async function (req, res, next) {
    const restaurants = await insertarRestauranteFavorito(req.body)
    res.send(restaurants)
  }
)
router.get('/restaurantesFavoritos/:username', async function (req, res, next) {
  const restaurants = await listarRestaurantesFavoritos(req.params)
  res.send(restaurants)
})

router.get('/recetasFavoritas/:username', async function (req, res, next) {
  const recipes = await listarRecetasFavoritas(req.params)
  res.send(recipes)
})
router.post('/recetasFavoritas', verifyToken, async function (req, res, next) {
  const recipe = await insertarRecetaFavorita(req.body)
  res.send(recipe)
})

router.post('/recetas', verifyToken, async function (req, res, next) {
  const recipe = await agregarReceta(req.body)
  res.send(recipe)
})

router.post('/followRestaurante', verifyToken, async function (req, res, next) {
  const restaurant = await insertarFollowRestaurante(req.body)
  res.send(restaurant)
})

router.get('/followRestaurante/:username', async function (req, res, next) {
  const restaurant = await listarRestaurantesFollow(req.params)
  res.send(restaurant)
})

router.post('/followFoodie', verifyToken, async function (req, res, next) {
  const foodie = await insertarFollowFoodie(req.body)
  res.send(foodie)
})

router.get(
  '/followFoodie/:username',
  verifyToken,
  async function (req, res, next) {
    const foodies = await listarFoodiesFollow(req.param)
    res.send(foodies)
  }
)

router.post('/categorias', verifyToken, async function (req, res, next) {
  const foodie = await insertarCategoria(req.body)
  res.send(foodie)
})

router.post('/user/logIn', verifyToken, async function (req, res, next) {
  const response = await logIn(req.body)
  console.log(response)
  res.send(response)
})

router.post(
  '/user/signUp',
  [verifySignUp, uploader.single('avatar')],
  async function (req, res, next) {
    try {
      const nuevo = await insertFoodie(req.body, req)
      res.send(nuevo)
    } catch (error) {
      console.log(error)
      res.status(500).send('Internal Server Error')
    }
  }
)

module.exports = router
