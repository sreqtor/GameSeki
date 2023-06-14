const { Schema, model } = require('mongoose')

const VideojuegoSchema = Schema({
    nombre: {
        type : String,
        require: true,
        unique: true
    },
    descripcion : {
        type : String,
        require: true
    },
    desarrollador : {
        type : String,
        require: true
    },
    editor : {
        type : String,
        require: true
    },
    fecha_lanzamiento : {
        type : Date,
        require: true
    },
    imagen : {
        type : String,
        require: true
    },
    valoracion : {
        type : Number,
        
    },
    usuario : {
        type : String,
        require: true
    } //Añadir campo usuario | Subido por:

});

const ListadeseosSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    desarrollador: {
        type: String,
        required: true
    },
    editor: {
        type: String,
        required: true
    },
    fecha_lanzamiento: {
        type: Date,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    valoracion: {
        type: Number,
        
    },
    usuario: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    }
});

const CompletadosSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    desarrollador: {
        type: String,
        required: true
    },
    editor: {
        type: String,
        required: true
    },
    fecha_lanzamiento: {
        type: Date,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    valoracion: {
        type: Number,
        
    },
    usuario: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    }
});

const Videojuego = model('Videojuego' , VideojuegoSchema);

const Listadeseos = model('Listadeseos', ListadeseosSchema);

const Completados = model('Completados', CompletadosSchema);

module.exports = { Videojuego, Listadeseos, Completados };