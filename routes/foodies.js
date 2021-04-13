var express = require('express')
var router = express.Router('router')
var [getFoodies, getFoodieByUsername,insertFoodie, editarFoodie,agregarReceta,listarRecetas,insertarRecetaFavorita,
    insertarRestauranteFavorito,insertarFollowRestaurante,insertarFollowFoodie,
    insertarCategoria,listarRestaurantesFollow,listarFoodiesFollow,
    listarRestaurantesFavoritos,listarRecetasFavoritas
] = require('../controllers/foodie')

router.get('/', async function (req, res, next){
    const products = await getFoodies();
    res.send(products);
})

router.get('/user', async function (req, res, next){
    const products = await getFoodieByUsername(req.body.username);
    res.send(products);
})

router.put('/', async function (req, res, next){
    const product = await editarFoodie(req.body);
    res.send(product);
})

router.get('/recetas',async function (req,res,next){
    const resultado = await listarRecetas(req.body)
    res.send(resultado)
})
router.post('/restaurantesFavoritos', async function (req,res,next){
    const resultado = await insertarRestauranteFavorito(req.body)
    res.send(resultado)
})
router.get('/restaurantesFavoritos', async function (req,res,next){
    const resultado = await listarRestaurantesFavoritos(req.body)
    res.send(resultado)
})

router.get('/recetasFavoritas', async function (req,res,next){
    const resultado = await listarRecetasFavoritas(req.body)
    res.send(resultado)
})
router.post('/recetasFavoritas', async function (req,res,next){
    const resultado = await insertarRecetaFavorita(req.body)
    res.send(resultado)
})

router.post('/recetas', async function (req,res,next){
    const resultado = await agregarReceta(req.body)
    res.send(resultado)
})


router.post('/followRestaurante', async function (req,res,next){
    const resultado = await insertarFollowRestaurante(req.body)
    res.send(resultado)
})

router.get('/followRestaurante', async function (req,res,next){
    const resultado = await listarRestaurantesFollow(req.body)
    res.send(resultado)
})

router.post('/followFoodie', async function (req,res,next){
    const resultado = await insertarFollowFoodie(req.body)
    res.send(resultado)
})

router.get('/followFoodie', async function (req,res,next){
    const resultado = await listarFoodiesFollow(req.body)
    res.send(resultado)
})

router.post('/categorias', async function (req,res,next){
    const resultado = await insertarCategoria(req.body)
    res.send(resultado)
})

router.post('/', async function (req, res, next){
    try 
    {
        let nuevo = await getFoodieByUsername(req.body.username)
        console.log(nuevo)
        if (nuevo)
        {
            throw new Error('Ya existe un foodie con este titulo');
        }
        await insertFoodie(req.body);
        console.log('nombrefoodie', req.body.nombre);
        nuevo = await getFoodieByUsername(req.body.username);
        res.send(nuevo);
    } 
    catch ({error}) 
    {
        res.status(500).send('Internal Server Error');
    }
})



module.exports = router;
