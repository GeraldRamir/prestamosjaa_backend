import nodemailer from 'nodemailer';
const emailRegistro = async (datos) => {
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
        subject: "Confirma tu cuenta en ADP",
        text: `Hola ${nombre}, confirma tu cuenta en ADP`,
        html: `<p>Hola ${nombre}, comprueba tu cuenta en ADP</p>
        <p>Da click en el siguiente enlace para confirmar tu cuenta</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
        <p>Si no creaste esta cuenta, ignora este mensaje</p>
        `

    })
    console.log('Mensaje enviado:', info.messageId);

}

export default emailRegistro;