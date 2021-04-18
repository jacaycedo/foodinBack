var express = require('express')
var router = express.Router('router')
var [getRestaurantes, getRestauranteByNombre,insertRestaurante, editarRestaurante,agregarResenia,listarResenias,agregarReceta,listarRecetas] = require('../controllers/restaurante')

router.get('/', async function (req, res, next){
    
    const products = await getRestaurantes();
    res.send(products);
})

router.get('/resenia', async function (req, res, next){
    
    const resultado = await listarResenias(req.body.nombre)
    console.log(resultado)
    res.send(resultado)
})

router.get('/recetas', async function (req, res, next){
    
    const resultado = await listarRecetas(req.body.nombre)
    console.log(resultado)
    res.send(resultado)
})

router.get('/restaurante/:nombreRestaurante', async function (req, res, next){
    const products = await getRestauranteByNombre(req.params.nombreRestaurante);
    res.send(products);
})

router.post('/resenia', async function (req,res,next){
    const resultado = await agregarResenia(req.body)
    res.send(resultado)
})

router.post('/recetas',async function(req,res,next){
    const resultado = await agregarReceta(req.body)
    res.send(resultado)
})

router.post('/', async function (req, res, next){
    try 
    {
        let nuevo = await getRestauranteByNombre(req.body.nombre)
        if (nuevo)
        {
            throw new Error('Ya existe un restaurantre con este nombre');
        }
        await insertRestaurante(req.body);
        console.log('nombreRestaurante', req.body.nombre);
        nuevo = await getRestauranteByNombre(req.body.nombre);
        res.send(nuevo);
    } 
    catch ({error}) 
    {
        res.status(500).send('Internal Server Error');
    }
})

router.put('/', async function (req, res, next){
    const product = await editarRestaurante(req.body);
    res.send(product);
})

module.exports = router;
