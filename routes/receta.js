var express = require('express')
var router = express.Router('router')
var [ getRecetas,getRecetaByTitulo,insertReceta, editarReceta, getRecetaByAutor] = require('../controllers/receta')

router.get('/', async function (req, res, next){
    const products = await getRecetas();
    res.send(products);
})

router.get('/:nombreReceta', async function (req, res, next){
    const products = await getRecetaByTitulo(req.param.nombreReceta);
    res.send(products);
})

router.get('/:autor', async function (req, res, next){
    const products = await getRecetaByAutor(req.param.autor);
    res.send(products);
})


router.post('/', async function (req, res, next){
    try 
    {
        console.log("entre")
        let nuevo = await getRecetaByTitulo(req.body.nombre)
        if (nuevo)
        {
            throw new Error('Ya existe una receta con este nombre');
        }
        await insertReceta(req.body);
        console.log('nombreReceta', req.body.id);
        nuevo = await getRecetaByTitulo(req.body.id);
        console.log(nuevo)
        res.send(nuevo);
    } 
    catch (error) 
    {   
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
})

router.put('/:idreceta', async function (req, res, next){
    const product = await editarReceta(req.params, req.body);
    res.send(product);
})

module.exports = router;
