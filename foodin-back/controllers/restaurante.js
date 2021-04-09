const {db} = require('../db/mongoConexion')
const NOMBRE_COLLECCION = 'restaurantes'

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


async function insertRestaurante(restaurante)
{
    await db().collection(NOMBRE_COLLECCION)
    .insertOne(restaurante);
    return;
}

async function editarRestaurante(viejo, nuevo)
{
    const act = await db().collection(NOMBRE_COLLECCION).replaceOne(viejo, nuevo);
    return act;
}

module.exports =[getRestaurantes, getRestauranteByNombre,insertRestaurante, editarRestaurante]
