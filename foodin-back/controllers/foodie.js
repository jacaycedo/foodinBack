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

async function editarFoodie(nuevo)
{
    const act = await db().collection(NOMBRE_COLLECCION).updateOne(nuevo);
    return act;
}

module.exports =[getFoodies, getFoodieByUsername,insertFoodie, editarFoodie]
