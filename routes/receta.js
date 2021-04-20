var express = require('express')
var router = express.Router()
var [getRecetas,getRecetaByTitulo,getRecetaById,insertReceta,editarReceta,getRecetaByAutor,deleteRecetaById,deleteRecetas] = require('../controllers/receta')
const  multer = require('multer')
let uploader  = multer({dest:'temp/'})


router.get('/', async function (req, res, next){
    console.log("Todos")

    const products = await getRecetas();
    res.send(products);
})

router.get('/nombre/:nombreReceta', async function (req, res, next){
    const products = await getRecetaByTitulo(req.params.nombreReceta);
    res.send(products);
})
router.get('/id/:id', async function (req, res, next){
    console.log("ids")

    const products = await getRecetaById(req.params.id);
    res.send(products);
})

router.get('/autor/:autor', async function (req, res, next){
    const products = await getRecetaByAutor(req.params.autor);
    res.send(products);
})

router.delete('/:id', async function (req, res, next){
    let borrar = await getRecetaById((req.params.id))
    if(!borrar){res.send("No existe una receta con ese id"); return;}
    else{
        const del = await deleteRecetaById(req.params.id)
        res.send("Eliminada la receta con id " + borrar.nombre)
    }
})

router.delete('/efe', async function (req, res, next){
    let eliminar = await deleteRecetas()
    return 'DELETE FROM Recetas ' 
})


router.post('/',uploader.single('images'),async function (req, res, next){
    console.log('entre a agregar receta')
    try 
    {
        let nuevo = await getRecetaByTitulo(req.body.nombre)
        if (nuevo)
        {
            throw new Error('Ya existe una receta con este nombre');
        } 
        await insertReceta(req.body,req);
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

router.put('/:id', async function (req, res, next){
    const product = await editarReceta(req.params.id, req.body);
    res.send(product);
})

module.exports = router;
