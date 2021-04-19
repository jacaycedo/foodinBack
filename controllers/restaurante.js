const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'restaurantes'
const  aws = require('aws-sdk')
const  fs = require('fs')
const checkMulterParams = require('./check-multer-params');

async function insertarRestaurantePrueba(restaurante, req){
    console.log('Llegue hasta aca')
    console.log(req.files)
    aws.config.setPromisesDependency()
    aws.config.update(
        {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.REGION
        }
    )

    let urls = new Array()
    const s3 = new aws.S3()

    for (const imageMeta of req.files){
        let params = {
            ACL:'public-read',
            Bucket:process.env.S3_BUCKET,
            Body:fs.createReadStream(imageMeta.path),
            Key: `${imageMeta.filename}.${imageMeta.originalname.split('.')[1]}` 
        }

        let uploader = s3.upload(params)
        let promise = uploader.promise()

        await promise.then((data,err)=>{
            if (err){
                console.log('ERROR LOADING THE FILE')
            }
            if(data){
                
                fs.unlinkSync(imageMeta.path)
                const urlLocation = data.Location
                console.log(urlLocation)
                urls.push(urlLocation)
            }
        })
    }
    console.log(urls)
    let newRestaurante = {...restaurante,url:urls}
        db().collection(NOMBRE_COLLECCION).insertOne(newRestaurante);
}

async function getRestaurantes()
{
    const restaurantes = await db()
    .collection(NOMBRE_COLLECCION)
    .find({})
    .toArray();

    return restaurantes;
}

async function getRestauranteByNombre(id)
{
    const restaurante = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({nombre:id});

    return restaurante;
}


async function insertRestaurante(restaurante,req)
{
    aws.config.setPromisesDependency()
    aws.config.update(
        {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.REGION
        }
    )

    const s3 = new aws.S3()

    let params = {
        ACL:'public-read',
        Bucket:process.env.S3_BUCKET,
        Body:fs.createReadStream(req.file.path),
        Key: `${req.file.originalname}` 
    }
    
    let uploader = s3.upload(params)
    let promise = uploader.promise()
    await promise.then((data,err)=>{
        if (err){
            console.log('ERROR LOADING THE FILE')
        }
        if(data){
            console.log(data)
            fs.unlinkSync(req.file.path)
            const urlLocation = data.Location
            let newRestaurante = {...restaurante,url:urlLocation}
            db().collection(NOMBRE_COLLECCION)
            .insertOne(newRestaurante);
        }
    })

    return;
}

async function editarRestaurante(nuevo)
{
    const act = await db().collection(NOMBRE_COLLECCION).updateOne(
        {nombre:nuevo.nombre},
        {$set:{...nuevo}}
    )
    return act;
}

async function listarRecetas(restaurante){
    console.log('Hola')
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {nombre:restaurante}
    )
    .project({receta:1,_id:0}).toArray()

    return act
}
async function listarResenias(restaurante)
{
    console.log('Hola resenias')
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {nombre:restaurante}
    )
    .project({resenia:1,_id:0}).toArray()
    
    

    return act
}

async function agregarResenia(body)
{   
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {nombre:body.restaurante},
        {$push:{resenia:body.resenia}}
        )
        const act = await listarResenias(body.restaurante)
        let resenias = act[0].resenia
        let numresenias =resenias.length
        const reductor = (accumulator, currentValue)=> accumulator + currentValue
        let calificaciones = resenias.map(r =>r.calificacion).reduce(reductor)
        calificaciones = calificaciones/numresenias
        resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
            {nombre:body.restaurante},
            {$set:{calificacion:calificaciones}}
            )
    return resultado
}

async function agregarReceta(body){
    resultado = await db().collection(NOMBRE_COLLECCION).updateOne(
        {nombre:body.restaurante},
        {$push:{receta:body.receta}}
    )
    return resultado
}


module.exports =[getRestaurantes, getRestauranteByNombre,insertRestaurante, editarRestaurante,agregarResenia,listarResenias,agregarReceta,listarRecetas,insertarRestaurantePrueba]
