var express = require('express')
var router = express.Router('router')
var [ getRecetas,getRecetaByTitulo,insertReceta, editarReceta, getRecetaByAutor, deleteRecetaById,getRecetaById] = require('../controllers/receta')

router.get('/', async function (req, res, next){
    const products = await getRecetas();
    res.send(products);
})

router.get('/nombre/:nombreReceta', async function (req, res, next){
    console.log(req.params.nombreReceta)
    const products = await getRecetaByTitulo(req.params.nombreReceta);
    res.send(products);
})
router.get('/id/:id', async function (req, res, next){
    console.log(req.params.nombreReceta)
    const products = await getRecetaById(req.params.id);
    res.send(products);
})

router.get('/autor/:autor', async function (req, res, next){
    const products = await getRecetaByAutor(req.params.autor);
    res.send(products);
})

router.delete('/:id', async function (req, res, next){
    let borrar = await getRecetaById((req.params.id))
    if(!borrar){res.status(404).send("No existe una recerta con ese id"); return;}
    else{
        const del = await deleteRecetaById(req.params.id)
        res.send("Eliminada lareceta con id ", borrar.id)
    }
})


router.post('/', async function (req, res, next){
    try 
    {
        let nuevo = await getRecetaByTitulo(req.body.nombre)
        if (nuevo)
        {
            throw new Error('Ya existe una receta con este nombre');
        } 
        await insertReceta(req.body);
        console.log('nombreReceta', req.body.nombre);
        nuevo = await getRecetaByTitulo(req.body.nombre);
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
