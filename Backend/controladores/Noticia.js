const {response} = require('express')
const Noticia = require('../modelos/Noticia')

//Añadir una noticia
const subirNoticia = async (req, res = response) => {
    //Extraemos los datos de la noticia del cuerpo de la petición
    const {titulo} = req.body
   
    try { 
            //Buscamos la noticia en la base de datos utilizando el título
            let noticia = await Noticia.findOne({ titulo })
            
            //Si la noticia ya existe en la base de datos, devolvemos una respuesta de error
            if ( noticia ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'la noticia ya existe en la BD'
                })
            }

            //Si la noticia no existe, creamos un nuevo objeto Noticia con los datos recibidos en el cuerpo de la petición
            noticia = new Noticia(req.body)

            //Guardamos la noticia en la base de datos utilizando el método save() de Mongoose
            await noticia.save();

            //Devolvemos una respuesta con los datos de la noticia recién subida
            return res.json({
            ok:true,
            mensaje: "subir",
            titulo: noticia.titulo,
            descripcion: noticia.descripcion,
            fecha: noticia.fecha,
            videojuego: noticia.videojuego,
            imagen: noticia.imagen,
            autor: noticia.autor
        })
    } catch (error) {
        //Si se produce un error durante la subida de la noticia, lo capturamos y devolvemos una respuesta de error
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor'
        })
    }

}

//Buscar noticia por nombre
const buscarNoticia = async(req, res = response) => {
    //Obtenemos el titulo de la noticia a buscar a partir del cuerpo de la solicitud
    const {titulo}= req.body

    try {
        //Buscamos una noticia en la base de datos que tenga el título especificado utilizando el método findOne() de Mongoose
        let noticia = await Noticia.findOne({ titulo })

        //Si no se encuentra ninguna noticia con el título especificado, devolvemos una respuesta de error
        if ( !noticia ){
            return res.status(400).json({
                ok: false,
                mensaje: 'la noticia no existe en la BD'
            })
        }

        //Si se encuentra una noticia con el título especificado, devolvemos una respuesta con la noticia encontrada
        return res.json({
            ok:true,
            mensaje: "buscar",
            titulo,
            descripcion: noticia.descripcion,
            fecha: noticia.fecha,
            videojuego: noticia.videojuego,
            imagen: noticia.imagen,
            autor: noticia.autor,
            id: noticia.id
        })
    } catch {
        //Si se produce un error durante la búsqueda, devolvemos una respuesta de error
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor'
        })
    }    
}

//Listar todas las noticias
const listarNoticias = async (req, res = response) => {
    try {
        //Realizamos la búsqueda de todos las noticias en la base de datos utilizando el método find() de Mongoose
        const noticias = await Noticia.find();
        
        //Si la búsqueda se realiza correctamente, devolvemos una respuesta con un objeto JSON que contiene el arreglo de noticias
        return res.json({
            ok: true,
            mensaje: "listado de noticias:",
            noticias
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

//Actualizar una noticia
const actualizarNoticia = async (req, res = response) => {
    //Obtenemos el nombre de la noticia a actualizar desde los parámetros de la solicitud
    const { titulo } = req.params;
    //Obtenemos la nueva información de la noticia desde el cuerpo de la solicitud
    const { titulo: nuevoTitulo, descripcion, fecha, videojuego, imagen, autor } = req.body;

    try {
        //Utilizamos el método updateOne() de Mongoose para actualizar el videojuego en la base de datos
        const result = await Noticia.updateOne(
            //Especificamos el criterio de búsqueda
            { titulo: titulo },
            //Especificamos los campos que queremos actualizar utilizando el operador $set de MongoDB
            { $set: { titulo: nuevoTitulo, descripcion, fecha, videojuego, imagen, autor } }
        );

        //Si el número de documentos modificados es 0, significa que la noticia no existe en la base de datos
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

//Eliminar una noticia
const eliminarNoticia = async (req, res) => {
    //Obtenemos el nombre de la noticia a eliminar de los parámetros de la solicitud
    const { titulo } = req.params;
    
    try {
        //Utilizamos el método deleteOne() de Mongoose para eliminar la película con el título especificado
        const result = await Noticia.deleteOne({ titulo: titulo });

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
    subirNoticia, buscarNoticia, listarNoticias, actualizarNoticia, eliminarNoticia
}