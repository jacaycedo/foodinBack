const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'foodies'
const  aws = require('aws-sdk')
const  fs = require('fs')

async function getFoodies()
{
    const restaurantes = await db()
    .collection(NOMBRE_COLLECCION)
    .find({})
    .toArray();

    return restaurantes;
}



async function getFoodieByUsername(id)
{
    console.log('Busco por id')
    const restaurante = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({username:id});

    return restaurante;
}


async function insertFoodie(body,req)
{
    aws.config.setPromisesDependency()
    aws.config.update(
        {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.REGION
        }
    )
    let params = {
        ACL:'public-read',
        Bucket:process.env.S3_BUCKET,
        Body:fs.createReadStream(req.file.path),
        Key: `${req.file.originalname}${req.file.filename}.${req.file.originalname.split(".")[1]}` 
    }
    const s3 = new aws.S3()
    let uploader = s3.upload(params)
    let promise = uploader.promise()
    await promise.then( async (data,err)=>{
        if (err){
            console.log('ERROR LOADING THE FILE')
        }
        if(data){
            console.log(data)
            fs.unlinkSync(req.file.path)
            const urlLocation = data.Location
            let newFoodie = {
                username:body.username,
                name:body.name,
                ciudades: body.ciudades.split(','),
                categorias:body.categorias.split(','),
                especialidad:body.especialidad,
                anio:parseInt(body.anio),
                url:urlLocation
            }
            await db().collection(NOMBRE_COLLECCION)
            .insertOne(newFoodie);
        }
    })
 
    return;
}

async function listarRecetas (body){
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {username:body.username}
    )
    .project({recetas:1,_id:0}).toArray()

    return act
}

async function listarRestaurantesFollow (body){
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {username:body.username}
    )
    .project({followRestaurantes:1,_id:0}).toArray()

    return act
}

async function listarRestaurantesFavoritos(body){
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {username:body.username}
    )
    .project({restaurantesFav:1,_id:0}).toArray()

    return act
}

async function listarRecetasFavoritas(body){
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {username:body.username}
    )
    .project({recetasFav:1,_id:0}).toArray()

    return act
}
async function listarFoodiesFollow(body){
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {username:body.username}
    )
    .project({followFoodies:1,_id:0}).toArray()

    return act
}

async function editarFoodie(nuevo)
{
    const act = await db().collection(NOMBRE_COLLECCION).
    updateOne(
        {username:nuevo.username},
        {$set:{...nuevo}}
    )
    return act;
}

async function agregarReceta(body){
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {username:body.username},
        {$push:{recetas:body.receta}}
    )
    return resultado
}


async function insertarRecetaFavorita(body){
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {username:body.username},
        {$push:{recetasFav:body.receta}}
    )
    return resultado
}

async function insertarRestauranteFavorito(body){
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {username:body.username},
        {$push:{restaurantesFav:body.restaurante}}
    )
    return resultado
}

async function insertarFollowRestaurante(body){
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {username:body.username},
        {$push:{followRestaurantes :body.restaurante}}
    )
    return resultado
}

async function insertarFollowFoodie(body){
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {username:body.username},
        {$push:{followFoodies :body.follow}}
    )
    return resultado
}

async function insertarCategoria(body){
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {username:body.username},
        {$push:{categorias :body.categoria}}
    )
    return resultado
}

module.exports =[getFoodies, getFoodieByUsername,insertFoodie, editarFoodie,agregarReceta,listarRecetas,
    insertarRecetaFavorita,insertarRestauranteFavorito,insertarFollowRestaurante,
    insertarFollowFoodie,insertarCategoria,listarRestaurantesFollow,listarFoodiesFollow,
    listarRestaurantesFavoritos,listarRecetasFavoritas]
