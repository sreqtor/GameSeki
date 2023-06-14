const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const Usuario = require('../modelos/Usuario');

class EmailSender {
  constructor() {
    // Configurar el transporte de correo
    this.transporter = nodemailer.createTransport({
      // Configuración del servicio de correo
      service: 'gmail',
      auth: {
        user: 'gameseki.help@gmail.com',
        pass: 'jgvcnnvkdgcyuuts',
      },
    });
  }

  async sendPasswordResetEmail(email) {
    try {
      // Verificar si el usuario existe en la base de datos
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Generar un token único para restablecer la contraseña
      const resetToken = uuidv4();

      // Guardar el token en la base de datos junto con la dirección de correo electrónico
      usuario.resetToken = resetToken;
      usuario.resetTokenExpiry = Date.now() + 3600000; // Válido por 1 hora
      await usuario.save();

      // Enviar el correo electrónico con el enlace para restablecer la contraseña
      await this.transporter.sendMail({
        from: 'gameseki.help@gmail.com',
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `Haga clic <a href="http://localhost:3000/reset-pass?token=${resetToken}">aquí</a> para restablecer su contraseña <b>(el enlace caducará en 1h)</b><br/><br/>O cópielo en otra pestaña: http://localhost:3000/reset-pass?token=${resetToken}`,
      });

      // Devolver el token generado para su uso
      return resetToken;
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw new Error('Error al enviar el correo electrónico');
    }
  }
}

module.exports = EmailSender;
