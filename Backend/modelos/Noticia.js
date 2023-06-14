const { Schema, model} = require('mongoose')

const NoticiaSchema = Schema({
    titulo: {
        type : String,
        require: true
    },
    descripcion : {
        type : String,
        require: true
    },   
    fecha : {
        type : Date,
        require: true
    },
    videojuego : {
        type : String, 
        require: true
    },
    imagen : {
        type : String,
        require: true
    },
    autor : {
        type : String,
        require: true
    }

})

const Noticia = model('Noticia' , NoticiaSchema)

module.exports = Noticia