const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Image = require('./modelos/Image');
require('dotenv').config();
const auth = require('./rutas/auth');
const vidAuth = require('./rutas/Videojuego');
const notAuth = require('./rutas/Noticia');
const EmailSender = require('./rutas/EmailSender');
const ResetPass = require('./rutas/ResetPass');
const { conexion } = require('./database/config')

//configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

//creación destino imágenes multer
const upload = multer({ storage });

//conexion a la BD
conexion()

//creación del servidor
const app = express();

//configurar el middleware cors
app.use(cors());

//permitir escritura y lectura en json
app.use(express.json());

app.use('/upload', express.static('uploads'));

//ruta de carga de imágenes
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        //crear un documento de imagen en la base de datos
        const newImage = new Image({
            filename: req.file.filename,
            originalName: req.file.originalname,
        });
        await newImage.save();

        //obtener la ruta de la imagen guardada
        const imagePath = `http://localhost:5000/upload/${req.file.filename}`;
        
        res.status(200).json({ imagePath });
        
    } catch (error) {
        console.error('Error en la subida:', error);
        res.status(500).send('Error en la subida');
    }
});

//rutas
app.use('/api/user', auth);
app.use('/api/videojuego', vidAuth);
app.use('/api/noticia', notAuth);
app.use('/api/correo', EmailSender);
app.use('/api/pass', ResetPass);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("El servidor está en el puerto " + PORT);
})