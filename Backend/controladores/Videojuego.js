const { response } = require('express')
const { Videojuego, Listadeseos, Completados } = require('../modelos/Videojuego')

//Añadir un videojuego
const subirVideojuego = async (req, res = response) => {
    //Extraemos los datos de la película del cuerpo de la petición
    const { nombre } = req.body

    try {
        //Buscamos el videojuego en la base de datos utilizando el nombre
        let videojuego = await Videojuego.findOne({ nombre })

        //Si el videojuego ya existe en la base de datos, devolvemos una respuesta de error
        if (videojuego) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el videojuego ya existe en la BD'
            })
        }

        //Si el videojuego no existe, creamos un nuevo objeto Videojuego con los datos recibidos en el cuerpo de la petición
        videojuego = new Videojuego(req.body)

        //Guardamos el videojuego en la base de datos utilizando el método save() de Mongoose
        await videojuego.save();

        //Devolvemos una respuesta con los datos del videojuego recién subida
        return res.json({
            ok: true,
            mensaje: "subir",
            nombre: videojuego.nombre,
            descripcion: videojuego.descripcion,
            desarrollador: videojuego.desarrollador,
            editor: videojuego.editor,
            fecha_lanzamiento: videojuego.fecha_lanzamiento,
            imagen: videojuego.imagen,
            valoracion: videojuego.valoracion,
            usuario: videojuego.usuario
        })
    } catch (error) {
        //Si se produce un error durante la subida de el videojuego, lo capturamos y devolvemos una respuesta de error
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor'
        })
    }

}

//Buscar videojuego por nombre
const buscarVideojuegoAEditar = async (req, res = response) => {
    //Obtenemos el nombre del videojuego a buscar a partir del cuerpo de la solicitud
    const { nombre } = req.body

    try {
        //Buscamos un videojuego en la base de datos que tenga el título especificado utilizando el método findOne() de Mongoose
        let videojuego = await Videojuego.findOne({ nombre })

        //Si no se encuentra ningun videojuego con el título especificado, devolvemos una respuesta de error
        if (!videojuego) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el videojuego no existe en la BD'
            })
        }

        //Si se encuentra un videojuego con el título especificado, devolvemos una respuesta con el videojuego encontrado
        return res.json({
            ok: true,
            mensaje: "buscar",
            nombre,
            descripcion: videojuego.descripcion,
            desarrollador: videojuego.desarrollador,
            editor: videojuego.editor,
            fecha_lanzamiento: videojuego.fecha_lanzamiento,
            imagen: videojuego.imagen,
            valoracion: videojuego.valoracion,
            usuario: videojuego.usuario,
            id: videojuego.id
        })
    } catch {
        //Si se produce un error durante la búsqueda, devolvemos una respuesta de error
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor'
        })
    }
}

//Buscar videojuego buscador por nombre
const buscarVideojuego = async (req, res = response) => {
    // Obtenemos el nombre del videojuego a buscar a partir del cuerpo de la solicitud
    const { nombre } = req.body;
  
    try {
      // Buscamos todos los videojuegos en la base de datos que tengan un nombre que coincida parcialmente con el nombre especificado
      const videojuegos = await Videojuego.find({ nombre: { $regex: nombre, $options: 'i' } });
  
      // Si no se encuentra ningún videojuego con el nombre especificado, devolvemos una respuesta de error
      if (videojuegos.length === 0) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se encontraron videojuegos con ese nombre en la BD'
        });
      }
  
      // Si se encuentran videojuegos con el nombre especificado, devolvemos una respuesta con los videojuegos encontrados
      const resultados = videojuegos.map((videojuego) => ({
        nombre: videojuego.nombre,
        descripcion: videojuego.descripcion,
        desarrollador: videojuego.desarrollador,
        editor: videojuego.editor,
        fecha_lanzamiento: videojuego.fecha_lanzamiento,
        imagen: videojuego.imagen,
        valoracion: videojuego.valoracion,
        usuario: videojuego.usuario,
        id: videojuego.id
      }));
  
      return res.json(resultados);
    } catch (error) {
      // Si se produce un error durante la búsqueda, devolvemos una respuesta de error
      return res.status(500).json({
        ok: false,
        mensaje: 'Error en el servidor'
      });
    }
  };
  

//Listar todos los videojuegos
const listarVideojuegos = async (req, res = response) => {
    try {
        //Realizamos la búsqueda de todos los videojuegos en la base de datos utilizando el método find() de Mongoose
        const videojuegos = await Videojuego.find();

        //Si la búsqueda se realiza correctamente, devolvemos una respuesta con un objeto JSON que contiene el arreglo de videojuegos
        return res.json({
            ok: true,
            mensaje: "listado de videojuegos:",
            videojuegos
        });
    } catch (error) {
        //Si se produce un error durante la búsqueda, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({
            ok: false,
            mensaje: "error en el servidor"
        });
    }
}

//Actualizar un videojuego
const actualizarVideojuego = async (req, res = response) => {
    //Obtenemos el nombre del videojuego a actualizar desde los parámetros de la solicitud
    const { nombre } = req.params;
    //Obtenemos la nueva información de la película desde el cuerpo de la solicitud
    const { nombre: nuevoNombre, descripcion, desarrollador, editor, fecha_lanzamiento, imagen, valoracion, usuario } = req.body;

    try {
        //Utilizamos el método updateOne() de Mongoose para actualizar el videojuego en la base de datos
        const result = await Videojuego.updateOne(
            //Especificamos el criterio de búsqueda
            { nombre: nombre },
            //Especificamos los campos que queremos actualizar utilizando el operador $set de MongoDB
            { $set: { nombre: nuevoNombre, descripcion, desarrollador, editor, fecha_lanzamiento, imagen, valoracion, usuario } }
        );

        //Si el número de documentos modificados es 0, significa que la película no existe en la base de datos
        if (result.modifiedCount === 0) {
            return res.status(404).json({ mensaje: 'registro no encontrado' });
        }

        //Si la actualización se realizó correctamente, devolvemos una respuesta exitosa
        return res.json({ mensaje: 'registro actualizado' });
    } catch (error) {
        //Si se produce un error durante la actualización, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({ mensaje: 'error en el servidor' });
    }
}

//Eliminar un videojuego
const eliminarVideojuego = async (req, res) => {
    //Obtenemos el nombre del videojuego a eliminar de los parámetros de la solicitud
    const { nombre } = req.params;

    try {
        //Utilizamos el método deleteOne() de Mongoose para eliminar el videojuego con el título especificado
        const result = await Videojuego.deleteOne({ nombre: nombre });

        //Si el resultado indica que no se eliminó ningún registro, devolvemos un error 404
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'registro no encontrado' });
        }

        //Si se eliminó el registro correctamente, devolvemos un mensaje de éxito
        return res.json({ mensaje: 'registro eliminado' });
    } catch (error) {
        //Si se produce un error durante la eliminación, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({ mensaje: 'error en el servidor' });
    }
}

//Añadir a lista deseos
const agregarListadeseos = async (req, res) => {
    const { nombre } = req.body;
    const { propietario } = req.body;

    try {

        let juegoExistente = await Listadeseos.findOne({ nombre, propietario });

        if (juegoExistente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El juego ya está en la lista de deseos',
            });
        }

        let videojuego = await Videojuego.findOne({ nombre })

        if (!videojuego) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el videojuego no existe en la BD'
            })
        }

        const entradaLista = new Listadeseos({
            nombre: videojuego.nombre,
            descripcion: videojuego.descripcion,
            desarrollador: videojuego.desarrollador,
            editor: videojuego.editor,
            fecha_lanzamiento: videojuego.fecha_lanzamiento,
            imagen: videojuego.imagen,
            valoracion: videojuego.valoracion,
            usuario: videojuego.usuario,
            propietario: propietario,
        });

        await entradaLista.save();

        return res.json({
            ok: true,
            mensaje: "agregar",
            nombre: entradaLista.nombre,
            descripcion: entradaLista.descripcion,
            desarrollador: entradaLista.desarrollador,
            editor: entradaLista.editor,
            fecha_lanzamiento: entradaLista.fecha_lanzamiento,
            imagen: entradaLista.imagen,
            valoracion: entradaLista.valoracion,
            usuario: entradaLista.usuario
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor',
            error: error.message
        })
    }
}

//Listar lista deseos
const listarDeseos = async (req, res = response) => {
    try {
        //Realizamos la búsqueda de todos los videojuegos en la base de datos utilizando el método find() de Mongoose
        const listadeseos = await Listadeseos.find();

        //Si la búsqueda se realiza correctamente, devolvemos una respuesta con un objeto JSON que contiene el arreglo de videojuegos
        return res.json({
            ok: true,
            mensaje: "listado de videojuegos deseados:",
            listadeseos
        });
    } catch (error) {
        //Si se produce un error durante la búsqueda, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({
            ok: false,
            mensaje: "error en el servidor"
        });
    }
}

//Eliminar lista deseos
const eliminarListaDeseos = async (req, res) => {
    //Obtenemos el nombre del videojuego a eliminar de los parámetros de la solicitud
    const { nombre } = req.params;
    const { propietario } = req.params;

    try {
        //Utilizamos el método deleteOne() de Mongoose para eliminar el videojuego con el título especificado
        const result = await Listadeseos.deleteOne({ nombre: nombre, propietario:propietario });

        //Si el resultado indica que no se eliminó ningún registro, devolvemos un error 404
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'registro no encontrado' });
        }

        //Si se eliminó el registro correctamente, devolvemos un mensaje de éxito
        return res.json({ mensaje: 'registro eliminado' });
    } catch (error) {
        //Si se produce un error durante la eliminación, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({ mensaje: 'error en el servidor' });
    }
}

//Añadir a completados
const agregarListacompletados = async (req, res) => {
    const { nombre } = req.body;
    const { propietario } = req.body;

    try {

        let juegoExistente = await Completados.findOne({ nombre, propietario });

        if (juegoExistente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El juego ya está en la lista de completados',
            });
        }

        let videojuego = await Videojuego.findOne({ nombre })

        if (!videojuego) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el videojuego no existe en la BD'
            })
        }

        const entradaCompletados = new Completados({
            nombre: videojuego.nombre,
            descripcion: videojuego.descripcion,
            desarrollador: videojuego.desarrollador,
            editor: videojuego.editor,
            fecha_lanzamiento: videojuego.fecha_lanzamiento,
            imagen: videojuego.imagen,
            valoracion: videojuego.valoracion,
            usuario: videojuego.usuario,
            propietario: propietario,
        });

        await entradaCompletados.save();

        return res.json({
            ok: true,
            mensaje: "agregar",
            nombre: entradaCompletados.nombre,
            descripcion: entradaCompletados.descripcion,
            desarrollador: entradaCompletados.desarrollador,
            editor: entradaCompletados.editor,
            fecha_lanzamiento: entradaCompletados.fecha_lanzamiento,
            imagen: entradaCompletados.imagen,
            valoracion: entradaCompletados.valoracion,
            usuario: entradaCompletados.usuario
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor',
            error: error.message
        })
    }
}

//Listar completados
const listarCompletados = async (req, res = response) => {
    try {
        //Realizamos la búsqueda de todos los videojuegos en la base de datos utilizando el método find() de Mongoose
        const completados = await Completados.find();

        //Si la búsqueda se realiza correctamente, devolvemos una respuesta con un objeto JSON que contiene el arreglo de videojuegos
        return res.json({
            ok: true,
            mensaje: "listado de videojuegos deseados:",
            completados: completados
        });
    } catch (error) {
        //Si se produce un error durante la búsqueda, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({
            ok: false,
            mensaje: "error en el servidor"
        });
    }
}

//Elimimar completados
const eliminarCompletados = async (req, res) => {
    //Obtenemos el nombre del videojuego a eliminar de los parámetros de la solicitud
    const { nombre } = req.params;
    const { propietario } = req.params;

    try {
        //Utilizamos el método deleteOne() de Mongoose para eliminar el videojuego con el título especificado
        const result = await Completados.deleteOne({ nombre: nombre, propietario:propietario });

        //Si el resultado indica que no se eliminó ningún registro, devolvemos un error 404
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'registro no encontrado' });
        }

        //Si se eliminó el registro correctamente, devolvemos un mensaje de éxito
        return res.json({ mensaje: 'registro eliminado' });
    } catch (error) {
        //Si se produce un error durante la eliminación, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({ mensaje: 'error en el servidor' });
    }
}

//Exportamos las funciones para que puedan ser utilizadas desde otros módulos
module.exports = {
    subirVideojuego, buscarVideojuegoAEditar, buscarVideojuego, listarVideojuegos, actualizarVideojuego, eliminarVideojuego, agregarListadeseos, listarDeseos, eliminarListaDeseos, agregarListacompletados, listarCompletados, eliminarCompletados
}