var express = require('express')
var router = express.Router('router')
var [getRecetas,getRecetaByTitulo,getRecetaById,insertReceta,editarReceta,getRecetaByAutor,deleteRecetaById] = require('../controllers/receta')

router.get('/', async function (req, res, next){
    console.log("Todos")

    const products = await getRecetas();
    res.send(products);
})

router.get('/nombre', async function (req, res, next){
    const products = await getRecetaByTitulo(req.body.nombre);
    res.send(products);
})
router.get('/id', async function (req, res, next){
    console.log("ids")

    const products = await getRecetaById(req.body.id);
    res.send(products);
})

router.get('/autor', async function (req, res, next){
    console.log("autor")
    const products = await getRecetaByAutor(req.body.autor);
    res.send(products);
})

router.delete('/id', async function (req, res, next){
    let borrar = await getRecetaById((req.body.id))
    if(!borrar){res.status(404).send("No existe una receta con ese id"); return;}
    else{
        const del = await deleteRecetaById(req.params.id)
        res.send("Eliminada la receta con id ", borrar.id)
    }
})


router.post('/', async function (req, res, next){
    console.log('entre a agregar receta')
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

router.put('/', async function (req, res, next){
    const product = await editarReceta(req.id, req.body);
    res.send(product);
})

module.exports = router;
