const { ObjectId } = require('bson');
const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'recetas'
const  aws = require('aws-sdk')
const  fs = require('fs')


async function getRecetas()
{
    const recetas = await db()
    .collection(NOMBRE_COLLECCION)
    .find({})
    .toArray();

    return recetas;
}

async function getRecetaByAutor(nombre)
{
    const recetas = await db()
    .collection(NOMBRE_COLLECCION)
    .find({autor:nombre})
    .toArray();

    return recetas;
}

async function deleteRecetaById(id)
{
    const x = await db().collection(NOMBRE_COLLECCION)
    .deleteOne({_id:ObjectId(id)})

    return x
}

async function deleteRecetas()
{
    const x = await db().collection(NOMBRE_COLLECCION)
    .remove({})

    return 'Eliminadas' 
}

async function getRecetaByTitulo(tit)
{   
    const receta = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({nombre:tit})
    return receta;
}
async function getRecetaById(id)
{
    const receta = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({_id:ObjectId(id)})
    return receta;
}
 
async function insertReceta(receta,req)
{
    console.log('Llegue hasta aca')
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
    

    let imageMeta = req.file
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
    

    let newReceta = {
        ...receta,
        urls:urls
    }
    await db().collection(NOMBRE_COLLECCION)
    .insertOne(newReceta);
    return;
}

async function editarReceta(viejo, nuevo)
{
   const act = await db().collection(NOMBRE_COLLECCION).replaceOne(viejo, nuevo);
   return act;
}

module.exports = [getRecetas,getRecetaByTitulo,getRecetaById,insertReceta,editarReceta,getRecetaByAutor,deleteRecetaById,deleteRecetas]
