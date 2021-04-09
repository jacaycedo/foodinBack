var express = require('express')
var router = express.Router('router')
var [getFoodies, getFoodieByUsername,insertFoodie, editarFoodie] = require('../controllers/foodie')

router.get('/', async function (req, res, next){
    const products = await getFoodies();
    res.send(products);
})

router.get('/:username', async function (req, res, next){
    const products = await getFoodieByUsername(req.param.username);
    res.send(products);
})

router.put('/:username', async function (req, res, next){
    console.log("Not in ")
    const product = await editarFoodie(req.params, req.body);
    res.send(product);
})

router.post('/', async function (req, res, next){
    try 
    {
        let nuevo = await getFoodieByUsername(req.body.username)
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
