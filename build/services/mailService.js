"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendExpiringMail = exports.sendNewAuthorizationNotification = exports.sendForgotPasswordEmail = exports.sendConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendConfirmationEmail = async (email, token) => {
    const url = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirma tu cuenta',
        html: ` <div style="font-family: 'Montserrat', sans-serif; color: #003366; text-align: center; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
        <h2 style="font-size: 30px; color: #003366;">¡Bienvenido a TeLLevoAlCole!</h2>
        <p style="font-size: 16px; color: #333;">Por favor confirma tu cuenta haciendo click en el siguiente enlace:</p>
        <a href="${url}" style="padding: 10px 20px; background-color: #003366; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar cuenta</a>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">Si no realizaste esta solicitud, puedes ignorar este correo.</p>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendConfirmationEmail = sendConfirmationEmail;
const sendForgotPasswordEmail = async (email, token) => {
    const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Restablecer contraseña',
        html: ` <div style="font-family: 'Montserrat', sans-serif; color: #003366; text-align: center; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
        <h2 style="font-size: 30px; color: #003366;">¡Hola!</h2>
        <p style="font-size: 16px; color: #333;">Recibimos una solicitud para restablecer tu contraseña. Haz click en el siguiente enlace para continuar:</p>
        <a href="${url}" style="padding: 10px 20px; background-color: #003366; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer contraseña</a>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">Si no realizaste esta solicitud, puedes ignorar este correo.</p>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
const sendNewAuthorizationNotification = async (userName, authorizationId, adminEmail, adminName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: 'Nueva autorización creada',
        html: `<div style="font-family: 'Montserrat', sans-serif; color: #003366; text-align: center; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
        <h2 style="font-size: 30px; color: #003366;">¡Hola ${adminName}!</h2>
        <p style="font-size: 16px; color: #333;">Se ha creado una nueva solicitud de aprobación (nro ${authorizationId}) de autorización para ${userName}.</p>
        <p style="font-size: 16px; color: #333;">Por favor revisa la aplicación.</p>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendNewAuthorizationNotification = sendNewAuthorizationNotification;
const sendExpiringMail = async (userName, userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Habilitación próxima a vencer',
        html: `<div style="font-family: 'Montserrat', sans-serif; color: #003366; text-align: center; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
        <h2 style="font-size: 30px; color: #003366;">¡Hola ${userName}!</h2>
        <p style="font-size: 16px; color: #333;">Recordá que tu habilitación está próxima a vencerse.</p>
        <p style="font-size: 16px; color: #333;">Por favor revisa la aplicación y generá una nueva para seguir trabajando. Gracias!</p>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendExpiringMail = sendExpiringMail;
