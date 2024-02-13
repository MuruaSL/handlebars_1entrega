import jwt from 'jsonwebtoken';
import PasswordResetToken from '../models/password-tokens-schema.js'; // Importar el modelo de tokens de restablecimiento de contraseña
import UserModel from '../models/user-schema.js';
import Mail from "../modules/mail.module.js"; // Importar la clase Mail
import { createHash } from '../../utils.js';

const mailService = new Mail();

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (email) => {
    try {
        // Buscar al usuario por su correo electrónico
        console.log("Buscando usuario con el correo electrónico:", email);
        const user = await UserModel.findOne({ email });
        console.log("Respuesta de búsqueda de usuario:", user);
        
        if (!user) {
            // Si el usuario no existe, devolver null para indicar que el usuario no fue encontrado
            console.log("Usuario no encontrado.");
            return null;
        }
  
        // Generar un token único para el restablecimiento de contraseña
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Guardar el token en la base de datos junto con la fecha de expiración
        const expirationDate = new Date(Date.now() + 3600000); // 1 hora de expiración
        const newToken = new PasswordResetToken({ user: user._id, token, expirationDate });
        await newToken.save();
  
        // Construir el enlace de restablecimiento de contraseña con el token generado
        const resetLink = `http://localhost:8080/reset-password/${token}`;
  
        // Construir el contenido del correo electrónico
        const emailContent = `Hola ${user.username}, haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`;
  
        // Enviar el correo electrónico al usuario
        console.log("Enviando correo electrónico para restablecimiento de contraseña a:", user.email);
        await mailService.send(user, 'Restablecimiento de Contraseña', emailContent);
  
        // Devolver el usuario para indicar que el correo electrónico se envió correctamente
        console.log("Correo electrónico enviado correctamente.");
        return user;
    } catch (error) {
        // Captura y devuelve el error
        console.error('Error al solicitar el restablecimiento de contraseña:', error);
        throw error;
    }
};

// Restablecer contraseña
export const resetPassword = async (token, newPassword) => {
  try {
      // Buscar el token en la base de datos
      const tokenData = await PasswordResetToken.findOne({ token });

      if (!tokenData) {
          console.log("El token de restablecimiento de contraseña no es válido o ha expirado.");
          throw new Error('El token de restablecimiento de contraseña no es válido o ha expirado');
      }

      // Verificar si el token ha expirado
      if (tokenData.expirationDate < new Date()) {
          console.log("El token de restablecimiento de contraseña ha expirado.");
          throw new Error('El token de restablecimiento de contraseña ha expirado');
      }

      // Buscar al usuario por su ID
      const user = await UserModel.findById(tokenData.user);

      // Hashear la nueva contraseña
      const hashedPassword = createHash(newPassword);

      // Actualizar la contraseña del usuario
      user.password = hashedPassword;
      await user.save();

      // Eliminar el token de restablecimiento de la base de datos
      await PasswordResetToken.findByIdAndDelete(tokenData._id);

      console.log("Contraseña restablecida con éxito.");
      return { message: 'Contraseña restablecida con éxito' };
  } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      throw error;
  }
};
