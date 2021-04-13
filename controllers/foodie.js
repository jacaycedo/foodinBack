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
