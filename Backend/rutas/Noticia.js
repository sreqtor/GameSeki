const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middleware/validator');
const { subirNoticia, buscarNoticia, listarNoticias, actualizarNoticia, eliminarNoticia } = require('../controladores/Noticia');
const router = Router();

//Comprobación funcionamiento
router.get("/", (req, res) => {
    res.send('Funcionando...')
});

//Crear noticia
router.post("/subirNoticia", 
    [       
        check('titulo', 'el titulo no puede estar vacío').notEmpty(),
        check('descripcion', 'la descripcion no puede estar vacía').notEmpty(),
        check('fecha', 'la fecha no puede estar vacía').notEmpty(),
        check('videojuego', 'el videojuego no puede estar vacío').notEmpty(),
        check('imagen', 'la imagen no puede estar vacía').notEmpty(),
        check('autor', 'el autor no puede estar vacío').notEmpty(),
        validarCampos
    ], 
subirNoticia);

//Listar noticia por título
router.post("/buscarNoticia", 
    [
        check('titulo', 'el titulo no puede estar vacío').notEmpty(),
        validarCampos
    ], 
buscarNoticia);

router.get("/listarNoticias", 
    [validarCampos],
listarNoticias);

//Actualizar por titulo
router.put("/actualizarNoticia/:titulo", 
    [
        check('titulo', 'el titulo no puede estar vacío').notEmpty(),
        check('descripcion', 'la descripcion no puede estar vacía').notEmpty(),
        check('videojuego', 'el videojuego no puede estar vacío').notEmpty(),
        check('imagen', 'la imagen no puede estar vacía').notEmpty(),
        validarCampos
    ], 
actualizarNoticia);

//Eliminar
router.delete("/eliminarNoticia/:titulo",
    [
        validarCampos
    ],
eliminarNoticia);

module.exports = router;