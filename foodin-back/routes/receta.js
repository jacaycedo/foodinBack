var express = require('express')
var router = express.Router('router')
var [getRecetaByTitulo, getRecetas,insertReceta, editarReceta, getRecetaByAutor] = require('../controllers/receta')

router.get('/', async function (req, res, next){
    const products = await getRecetas();
    res.send(products);
})

router.get('/:nombreReceta', async function (req, res, next){
    const products = await getRecetaByTitulo(req.param.nombreReceta);
    res.send(products);
})

router.get('/autor/:autor', async function (req, res, next){
    const products = await getRecetaByAutor(req.param.autor);
    res.send(products);
})


router.post('/', async function (req, res, next){
    try 
    {
        const nuevo = await getRecetaByTitulo(req.body.titulo)
        if (nuevo)
        {
            throw new Error('Ya existe un restaurantre con este titulo');
        }
        await insertReceta(req.body);
        console.log('nombreReceta', req.body.titulo);
        nuevo = await getRecetaByNombre(req.body.titulo);
        res.send(nuevo);
    } 
    catch ({error}) 
    {
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router;
