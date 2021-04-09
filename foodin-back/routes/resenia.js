var express = require('express')
var router = express.Router('router')
var [getResenas,getResenaByAutor,getRecetaByRestaurante,editarResenia,editarResenia] = require('../controllers/resenia')

router.get('/', async function (req, res, next){
    const products = await getResenas();
    res.send(products);
})

router.get('/restaurante/:nombreRes', async function (req, res, next){
    const products = await getRecetaByRestaurante(req.param.nombreRes);
    res.send(products);
})

router.get('/autor/:autor', async function (req, res, next){
    const products = await getResenaByAutor(req.param.autor);
    res.send(products);
})


router.post('/', async function (req, res, next){
    try 
    {
        await editarResenia(req.body);
        console.log('nombreReceta', req.body.nombre);
        const nuevo = await getRecetaByNombre(req.body.nombre);
        res.send(nuevo);
    } 
    catch ({error}) 
    {
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router;
