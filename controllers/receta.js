const { ObjectId } = require('bson');
const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'recetas'

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

async function insertReceta(receta)
{
    console.log(receta)
    await db().collection(NOMBRE_COLLECCION)
    .insertOne(receta);
    return;
}

async function editarReceta(viejo, nuevo)
{
   const act = await db().collection(NOMBRE_COLLECCION).replaceOne(viejo, nuevo);
   return act;
}

module.exports = [getRecetas,getRecetaByTitulo,getRecetaById,insertReceta,editarReceta,getRecetaByAutor,deleteRecetaById,deleteRecetas]
