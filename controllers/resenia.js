const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'resenias'

async function getResenas() {
  const resenias = await db().collection(NOMBRE_COLLECCION).find({}).toArray()

  return resenias
}

async function getResenaByAutor(nombre) {
  const resenias = await db()
    .collection(NOMBRE_COLLECCION)
    .find({autor: nombre})
    .toArray()

  return resenias
}

async function getRecetaByRestaurante(id) {
  const resenias = await db()
    .collection(NOMBRE_COLLECCION)
    .find({restaurante: id})
    .toArray()

  return resenias
}

async function insertResenia(resenia) {
  await db().collection(NOMBRE_COLLECCION).insertOne(resenia)
  return
}

module.exports = [
  getResenas,
  getResenaByAutor,
  getRecetaByRestaurante,
  insertResenia
]
