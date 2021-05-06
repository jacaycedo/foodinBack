var express = require('express')
var router = express.Router('router')
var [
  getResenas,
  getResenaByAutor,
  getRecetaByRestaurante,
  editarResenia,
  editarResenia
] = require('../controllers/resenia')

router.get('/', async function (req, res, next) {
  const products = await getResenas()
  res.send(products)
})

router.get('/restaurante/:nombreRes', async function (req, res, next) {
  const products = await getRecetaByRestaurante(req.params.nombreRes)
  res.send(products)
})

router.get('/autor/:autor', async function (req, res, next) {
  const products = await getResenaByAutor(req.params.autor)
  res.send(products)
})

router.post('/', async function (req, res, next) {
  try {
    let nuevo = await getRecetaByTitulo(req.body.titulo)
    console.log('nombreReceta', req.body.nombre)
    nuevo = await getRecetaByNombre(req.body.nombre)
    res.send(nuevo)
  } catch ({error}) {
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
