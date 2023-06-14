const { Router } = require('express');
const { subirVideojuego, buscarVideojuego, listarVideojuegos, actualizarVideojuego, eliminarVideojuego, agregarListadeseos, listarDeseos, eliminarListaDeseos, agregarListacompletados, listarCompletados, eliminarCompletados, buscarVideojuegoAEditar } = require('../controladores/Videojuego');
const { check } = require('express-validator')
const { validarCampos } = require('../middleware/validator');
const router = Router();

//Comprobación funcionamiento
router.get("/", (req, res) => {
    res.send('Funcionando...')
});

//Crear videojuego
router.post("/subirVideojuego", 
    [       
        check('nombre', 'el nombre no puede estar vacío').notEmpty(),
        check('descripcion', 'la descripcion no puede estar vacía').notEmpty(),
        check('imagen', 'la imagen no puede estar vacía').notEmpty(),
        validarCampos
    ], 
subirVideojuego);

//Listar videojuego a editar por nombre
router.post("/buscarVideojuegoAEditar", 
    [
        check('nombre', 'el nombre no puede estar vacío').notEmpty(),
        validarCampos
    ], 
buscarVideojuegoAEditar);

//Listar videojuego por nombre
router.post("/buscarVideojuego", 
    [
        check('nombre', 'el nombre no puede estar vacío').notEmpty(),
        validarCampos
    ], 
buscarVideojuego);

router.get("/listarVideojuegos", 
    [validarCampos],
listarVideojuegos);

//Actualizar por titulo
router.put("/actualizarVideojuego/:nombre", 
    [
        check('nombre', 'el nombre no puede estar vacío').notEmpty(),
        check('descripcion', 'la descripcion no puede estar vacía').notEmpty(),
        check('imagen', 'la imagen no puede estar vacía').notEmpty(),
        validarCampos
    ], 
actualizarVideojuego);

//Eliminar
router.delete("/eliminarVideojuego/:nombre", 
    [
        validarCampos
    ],
eliminarVideojuego);

router.post("/listadeseos/agregar",
    [
        validarCampos
    ],
agregarListadeseos);

router.get("/listadeseos/listar", 
    [validarCampos],
listarDeseos);

router.delete("/listadeseos/eliminar/:nombre/:propietario", 
    [
        validarCampos
    ],
eliminarListaDeseos);

router.post("/completados/agregar",
    [
        validarCampos
    ],
agregarListacompletados);

router.get("/completados/listar", 
    [validarCampos],
listarCompletados);

router.delete("/completados/eliminar/:nombre/:propietario", 
    [
        validarCampos
    ],
eliminarCompletados);

module.exports = router;