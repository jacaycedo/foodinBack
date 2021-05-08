const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'foodies'
const aws = require('aws-sdk')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const config = require('../middlewares/auth.config')

async function getFoodies() {
  const restaurantes = await db()
    .collection(NOMBRE_COLLECCION)
    .find({})
    .toArray()

  return restaurantes
}

async function getFoodieByUsername({username}) {
  const foodie = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({username: username})

  return foodie
}

async function insertFoodie(body, req) {
  aws.config.setPromisesDependency()
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
  })
  let params = {
    ACL: 'public-read',
    Bucket: process.env.S3_BUCKET,
    Body: fs.createReadStream(req.file.path),
    Key: `${req.file.originalname}${req.file.filename}.${
      req.file.originalname.split('.')[1]
    }`
  }
  const s3 = new aws.S3()
  let uploader = s3.upload(params)
  let promise = uploader.promise()
  await promise.then(async (data, err) => {
    if (err) {
      console.log('ERROR LOADING THE FILE')
    }
    if (data) {
      console.log(data)
      fs.unlinkSync(req.file.path)
      const urlLocation = data.Location
      let newFoodie = {
        username: body.username,
        name: body.name,
        ciudades: body.ciudades.split(','),
        categorias: body.categorias.split(','),
        especialidad: body.especialidad,
        anio: parseInt(body.anio),
        url: urlLocation,
        password: bcrypt.hashSync(body.password)
      }
      await db().collection(NOMBRE_COLLECCION).insertOne(newFoodie)
    }
  })

  return 'User Registered Succesfully!'
}

async function logIn({username, password}) {
  let foodie = await getFoodieByUsername({username: username})
  if (!foodie) {
    return {error: true}
  } else {
    const passwordIsValid = bcrypt.compareSync(password, foodie.password)
    if (!passwordIsValid) {
      return {error: true}
    } else {
      const token = await jwt.sign({username: foodie.username}, config.secret, {
        expiresIn: 86400
      })

      return {
        username: foodie.username,
        email: foodie.email,
        accessToken: token
      }
    }
  }
}

async function listarRecetas({username}) {
  const recipes = await db()
    .collection(NOMBRE_COLLECCION)
    .find({username: username})
    .project({recetas: 1, _id: 0})
    .toArray()

  return recipes
}

async function listarRestaurantesFollow({username}) {
  const restaurants = await db()
    .collection(NOMBRE_COLLECCION)
    .find({username: username})
    .project({followRestaurantes: 1, _id: 0})
    .toArray()

  return restaurants
}

async function listarRestaurantesFavoritos({username}) {
  const restaurants = await db()
    .collection(NOMBRE_COLLECCION)
    .find({username: username})
    .project({restaurantesFav: 1, _id: 0})
    .toArray()

  return restaurants
}

async function listarRecetasFavoritas({username}) {
  const recipes = await db()
    .collection(NOMBRE_COLLECCION)
    .find({username: username})
    .project({recetasFav: 1, _id: 0})
    .toArray()

  return recipes
}
async function listarFoodiesFollow({username}) {
  const foodies = await db()
    .collection(NOMBRE_COLLECCION)
    .find({username: username})
    .project({followFoodies: 1, _id: 0})
    .toArray()

  return foodies
}

async function editarFoodie(newFoodie) {
  const foodie = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({username: newFoodie.username}, {$set: {...newFoodie}})
  return foodie
}

async function agregarReceta(body) {
  const recipe = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({username: body.username}, {$push: {recetas: body.receta}})
  return recipe
}

async function insertarRecetaFavorita(body) {
  const resultado = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({username: body.username}, {$push: {recetasFav: body.receta}})
  return resultado
}

async function insertarRestauranteFavorito(body) {
  const resultado = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne(
      {username: body.username},
      {$push: {restaurantesFav: body.restaurante}}
    )
  return resultado
}

async function insertarFollowRestaurante(body) {
  const foodie = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne(
      {username: body.username},
      {$push: {followRestaurantes: body.restaurante}}
    )
  return foodie
}

async function insertarFollowFoodie(body) {
  const foodie = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({username: body.username}, {$push: {followFoodies: body.follow}})
  return foodie
}

async function insertarCategoria(body) {
  const foodie = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({username: body.username}, {$push: {categorias: body.categoria}})
  return foodie
}

module.exports = {
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
}
