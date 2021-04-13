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

async function getRecetaByTitulo(id)
{
    const receta = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({id:id});

    return receta;
}

async function insertReceta(receta)
{
    await db().collection(NOMBRE_COLLECCION)
    .insertOne(receta);
    return;
}

async function editarReceta(viejo, nuevo)
{
   const act = await db().collection(NOMBRE_COLLECCION).replaceOne(viejo, nuevo);
   return act;
}

module.exports = [getRecetas,getRecetaByTitulo,insertReceta,editarReceta,getRecetaByAutor]
