var express = require('express')
var router = express.Router('router')
var [
  getRestaurantes,
  getRestauranteByNombre,
  insertRestaurante,
  editarRestaurante,
  agregarResenia,
  listarResenias,
  agregarReceta,
  listarRecetas,
  insertarRestaurantePrueba
] = require('../controllers/restaurante')
const multer = require('multer')

let uploader = multer({dest: 'temp/'})
router.get('/', async function (req, res, next) {
  const products = await getRestaurantes()
  res.send(products)
})

router.get('/resenia/:nombreRestaurante', async function (req, res, next) {
  const resultado = await listarResenias(req.params.nombreRestaurante)
  console.log(resultado)
  res.send(resultado)
})

router.get('/recetas/:nombreRestaurante', async function (req, res, next) {
  const resultado = await listarRecetas(req.params.nombreRestaurante)
  console.log(resultado)
  res.send(resultado)
})

router.get('/restaurante/:nombreRestaurante', async function (req, res, next) {
  const products = await getRestauranteByNombre(req.params.nombreRestaurante)
  res.send(products)
})

router.post(
  '/resenia',
  uploader.array('images', 10),
  async function (req, res, next) {
    const resultado = await agregarResenia(req.body, req)
    res.send(resultado)
  }
)

router.post('/recetas', async function (req, res, next) {
  const resultado = await agregarReceta(req.body)
  res.send(resultado)
})

router.post('/', uploader.array('images', 10), async function (req, res, next) {
  try {
    console.log('Entre a cargar pruebas')
    let nuevo = await getRestauranteByNombre(req.body.nombre)
    if (nuevo) {
      throw new Error('Ya existe un restaurantre con este nombre')
    }
    console.log('El nombre del archivo')
    await insertarRestaurantePrueba(req.body, req)
    console.log('nombreRestaurante', req.body.nombre)
    nuevo = await getRestauranteByNombre(req.body.nombre)
    res.send(nuevo)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }
})

router.put('/', async function (req, res, next) {
  const product = await editarRestaurante(req.body)
  res.send(product)
})

module.exports = router
