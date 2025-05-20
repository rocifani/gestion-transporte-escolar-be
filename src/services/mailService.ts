import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendConfirmationEmail = async (email:string, token:string) => {
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


export const sendForgotPasswordEmail = async (email:string, token:string) => {
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

export const sendNewAuthorizationNotification = async (userName: string, authorizationId: number, adminEmail: string, adminName: string) => {
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

export const sendExpiringMail = async (userName: string, userEmail: string) => {
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
}

export const sendStatusChangeMail = async (userName: string, userEmail: string, status: number) => {
  const statusText = status === 2 ? 'Aprobada' : 'Rechazada';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Estado de habilitación actualizado',
    html: `<div style="font-family: 'Montserrat', sans-serif; color: #003366; text-align: center; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
        <h2 style="font-size: 30px; color: #003366;">¡Hola ${userName}!</h2>
        <p style="font-size: 16px; color: #333;">El estado de tu habilitación ha cambiado a ${statusText}.</p>
        <p style="font-size: 16px; color: #333;">Podés revisarlo en la aplicación.</p>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
};


