// Importar Mongoose
import mongoose from "mongoose";

// Definir el esquema
const passwordResetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencia al usuario
  token: { type: String, required: true }, // Token de restablecimiento de contraseña
  expirationDate: { type: Date, required: true } // Fecha de expiración del token
});

// Crear el modelo
const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

// Exportar el modelo
export default PasswordResetToken;
