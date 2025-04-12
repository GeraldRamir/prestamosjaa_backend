 import nodemailer from 'nodemailer';
 const emailOlvidePassword = async (datos) => {
     const transporter = nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS
         }
       });
       const {email, nombre, token}= datos;
 
     //   Enviar el email
     const info= await transporter.sendMail({
         from: "ADP- Administrador de prestamos",
         to: email,
         subject: "Reestablece tu contraseña",
         text: `Hola ${nombre}, Reestablece tu contraseña`,
         html: `<p>Hola ${nombre}, reestablece tu contraseña en ADP</p>
         <p>Da click en el siguiente enlace para reestablecer tu contraseña</p>
         <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
         <p>Si no creaste esta cuenta, ignora este mensaje</p>
         `
 
     })
     console.log('Mensaje enviado:', info.messageId);
 
 }
 
 export default emailOlvidePassword;