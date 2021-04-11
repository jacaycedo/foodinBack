const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'foodies'

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
    const restaurante = await db()
    .collection(NOMBRE_COLLECCION)
    .findOne({username:id});

    return restaurante;
}


async function insertFoodie(foodie)
{
    console.log('entre')
    await db().collection(NOMBRE_COLLECCION)
    .insertOne(foodie);
    return;
}

async function listarRecetas (body){
    const act = await db().collection(NOMBRE_COLLECCION).find(
        {username:body.username}
    )
    .project({receta:1,_id:0}).toArray()

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
        {$push:{receta:body.receta}}
    )
    return resultado
}

module.exports =[getFoodies, getFoodieByUsername,insertFoodie, editarFoodie,agregarReceta,listarRecetas]
