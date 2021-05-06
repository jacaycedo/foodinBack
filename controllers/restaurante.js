const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'restaurantes'
const aws = require('aws-sdk')
const fs = require('fs')

async function insertarRestaurantePrueba(restaurante, req) {
  console.log('Llegue hasta aca')
  console.log(req.files)
  aws.config.setPromisesDependency()
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
  })

  let urls = new Array()
  const s3 = new aws.S3()

  for (const imageMeta of req.files) {
    let params = {
      ACL: 'public-read',
      Bucket: process.env.S3_BUCKET,
      Body: fs.createReadStream(imageMeta.path),
      Key: `${imageMeta.filename}.${imageMeta.originalname.split('.')[1]}`
    }

    let uploader = s3.upload(params)
    let promise = uploader.promise()

    await promise.then((data, err) => {
      if (err) {
        console.log('ERROR LOADING THE FILE')
      }
      if (data) {
        fs.unlinkSync(imageMeta.path)
        const urlLocation = data.Location
        console.log(urlLocation)
        urls.push(urlLocation)
      }
    })
  }
  console.log(urls)
  restaurante.estrellas = parseFloat(restaurante.estrellas)
  restaurante.costo = parseFloat(restaurante.costo)
  let newRestaurante = {...restaurante, url: urls}
  db().collection(NOMBRE_COLLECCION).insertOne(newRestaurante)
}

async function getRestaurantes() {
  const restaurantes = await db()
    .collection(NOMBRE_COLLECCION)
    .find({})
    .toArray()

  return restaurantes
}

async function getRestauranteByNombre(id) {
  const restaurante = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({nombre: id})

  return restaurante
}

async function insertRestaurante(restaurante, req) {
  aws.config.setPromisesDependency()
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
  })

  const s3 = new aws.S3()

  let params = {
    ACL: 'public-read',
    Bucket: process.env.S3_BUCKET,
    Body: fs.createReadStream(req.file.path),
    Key: `${req.file.originalname}`
  }

  let uploader = s3.upload(params)
  let promise = uploader.promise()
  await promise.then((data, err) => {
    if (err) {
      console.log('ERROR LOADING THE FILE')
    }
    if (data) {
      console.log(data)
      fs.unlinkSync(req.file.path)
      const urlLocation = data.Location
      let newRestaurante = {...restaurante, url: urlLocation}
      db().collection(NOMBRE_COLLECCION).insertOne(newRestaurante)
    }
  })

  return
}

async function editarRestaurante(nuevo) {
  const act = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({nombre: nuevo.nombre}, {$set: {...nuevo}})
  return act
}

async function listarRecetas(restaurante) {
  console.log('Hola')
  const act = await db()
    .collection(NOMBRE_COLLECCION)
    .find({nombre: restaurante})
    .project({receta: 1, _id: 0})
    .toArray()

  return act
}
async function listarResenias(restaurante) {
  console.log('Hola resenias')
  const act = await db()
    .collection(NOMBRE_COLLECCION)
    .find({nombre: restaurante})
    .project({resenias: 1, _id: 0})
    .toArray()

  return act
}

async function agregarResenia(body, req) {
  console.log('Llegue hasta aca')
  console.log(req.files)
  aws.config.setPromisesDependency()
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
  })

  let urls = new Array()
  const s3 = new aws.S3()

  for (const imageMeta of req.files) {
    let params = {
      ACL: 'public-read',
      Bucket: process.env.S3_BUCKET,
      Body: fs.createReadStream(imageMeta.path),
      Key: `${imageMeta.filename}${imageMeta.originalname}.${
        imageMeta.originalname.split('.')[1]
      }`
    }

    let uploader = s3.upload(params)
    let promise = uploader.promise()

    await promise.then((data, err) => {
      if (err) {
        console.log('ERROR LOADING THE FILE')
      }
      if (data) {
        fs.unlinkSync(imageMeta.path)
        const urlLocation = data.Location
        console.log(urlLocation)
        urls.push(urlLocation)
      }
    })
  }
  let addreview = {
    autor: body.autor,
    comentario: body.comentario,
    estrellas: parseFloat(body.estrellas)
  }
  resultado = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne(
      {nombre: body.restaurante},
      {$push: {resenias: {...addreview, urls: urls}}}
    )
  const act = await listarResenias(body.restaurante)
  let resenias = act[0].resenias

  let numresenias = resenias.length
  const reductor = (accumulator, currentValue) => accumulator + currentValue
  let calificaciones = resenias.map((r) => r.estrellas).reduce(reductor)
  calificaciones = calificaciones / numresenias
  resultado = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({nombre: body.restaurante}, {$set: {estrellas: calificaciones}})

  let reseniaAutor = {
    nombreRestaurente: body.restaurante,
    estrellas: body.estrellas,
    comentario: body.comentario
  }
  let user = await db()
    .collection('foodies')
    .updateOne(
      {username: body.autor},
      {$push: {resenias: {...reseniaAutor, urls: urls}}}
    )

  return resenias
}

async function agregarReceta(body) {
  resultado = await db()
    .collection(NOMBRE_COLLECCION)
    .updateOne({nombre: body.restaurante}, {$push: {receta: body.receta}})
  return resultado
}

module.exports = [
  getRestaurantes,
  getRestauranteByNombre,
  insertRestaurante,
  editarRestaurante,
  agregarResenia,
  listarResenias,
  agregarReceta,
  listarRecetas,
  insertarRestaurantePrueba
]
