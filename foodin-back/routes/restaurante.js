var express = require('express')
var router = express.Router('router')
var [getRestaurantes, getRestauranteByNombre,insertRestaurante, editarRestaurante] = require('../controllers/restaurante')

router.get('/', async function (req, res, next){
    const products = await getRestaurantes();
    res.send(products);
})

router.get('/:nombreRestaurante', async function (req, res, next){
    const products = await getRestauranteByNombre(req.param.nombreRestaurante);
    res.send(products);
})


router.post('/', async function (req, res, next){
    try 
    {
        const nuevo = await getRestauranteByNombre(req.body.nombre)
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

router.put('/:nombreRestaurante', async function (req, res, next){
    const product = await editarRestaurante(req.params, req.body);
    res.send(product);
})

module.exports = router;
