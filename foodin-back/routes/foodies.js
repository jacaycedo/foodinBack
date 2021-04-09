var express = require('express')
var router = express.Router('router')
var [getFoodies, getFoodieByUsername,insertFoodie, editarFoodie] = require('../controllers/foodie')

router.get('/', async function (req, res, next){
    const products = await getFoodies();
    res.send(products);
})

router.get('/:foodieUser', async function (req, res, next){
    const products = await getFoodieByUsername(req.param.foodieUser);
    res.send(products);
})



router.post('/', async function (req, res, next){
    try 
    {
        let nuevo = await getFoodieByUsername(req.body.username)
        if (nuevo)
        {
            throw new Error('Ya existe un restaurantre con este titulo');
        }
        await insertFoodie(req.body);
        console.log('nombreReceta', req.body.titulo);
        nuevo = await getFoodieByUsername(req.body.titulo);
        res.send(nuevo);
    } 
    catch ({error}) 
    {
        res.status(500).send('Internal Server Error');
    }
})

router.put('/:userFoodie', async function (req, res, next){
    const product = await editarFoodie(req.params, req.body);
    res.send(product);
})

module.exports = router;
