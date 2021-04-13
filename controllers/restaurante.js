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


module.exports =[getRestaurantes, getRestauranteByNombre,insertRestaurante, editarRestaurante,agregarResenia,listarResenias,agregarReceta,listarRecetas]
