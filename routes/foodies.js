var express = require('express')
var router = express.Router('router')
var [
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
  listarRecetasFavoritas
] = require('../controllers/foodie')
const multer = require('multer')
let uploader = multer({dest: 'temp/'})
router.get('/', async function (req, res, next) {
  const products = await getFoodies()
  res.send(products)
})

router.get('/user/:username', async function (req, res, next) {
  const products = await getFoodieByUsername(req.params.username)
  res.send(products)
})

router.put('/', async function (req, res, next) {
  const product = await editarFoodie(req.body)
  res.send(product)
})

router.get('/recetas/:username', async function (req, res, next) {
  const resultado = await listarRecetas(req.params)
  res.send(resultado)
})
router.post('/restaurantesFavoritos', async function (req, res, next) {
  const resultado = await insertarRestauranteFavorito(req.body)
  res.send(resultado)
})
router.get('/restaurantesFavoritos/:username', async function (req, res, next) {
  const resultado = await listarRestaurantesFavoritos(req.params)
  res.send(resultado)
})

router.get('/recetasFavoritas/:username', async function (req, res, next) {
  const resultado = await listarRecetasFavoritas(req.params)
  res.send(resultado)
})
router.post('/recetasFavoritas', async function (req, res, next) {
  const resultado = await insertarRecetaFavorita(req.body)
  res.send(resultado)
})

router.post('/recetas', async function (req, res, next) {
  const resultado = await agregarReceta(req.body)
  res.send(resultado)
})

router.post('/followRestaurante', async function (req, res, next) {
  const resultado = await insertarFollowRestaurante(req.body)
  res.send(resultado)
})

router.get('/followRestaurante/:username', async function (req, res, next) {
  const resultado = await listarRestaurantesFollow(req.params)
  res.send(resultado)
})

router.post('/followFoodie', async function (req, res, next) {
  const resultado = await insertarFollowFoodie(req.body)
  res.send(resultado)
})

router.get('/followFoodie/:username', async function (req, res, next) {
  const resultado = await listarFoodiesFollow(req.param)
  res.send(resultado)
})

router.post('/categorias', async function (req, res, next) {
  const resultado = await insertarCategoria(req.body)
  res.send(resultado)
})

router.post('/', uploader.single('avatar'), async function (req, res, next) {
  try {
    console.log('uwu')
    let nuevo = await getFoodieByUsername(req.body.username)
    console.log(nuevo)
    console.log('Imprimi')
    if (nuevo) {
      throw new Error('Ya existe un foodie con este titulo')
    } else {
      console.log('voy a seguir')
    }
    await insertFoodie(req.body, req)
    console.log('nombrefoodie', req.body.name)
    nuevo = await getFoodieByUsername(req.body.username)
    res.send(nuevo)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
