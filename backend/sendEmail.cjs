// sendEmail.cjs
require('dotenv').config(); // 👈 IMPORTANTE
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendTicketEmail = async (to, subject, pdfBuffer) => {
  const msg = {
    to,
    from: process.env.CORREO_VERIFICADO, // 👈 más seguro así
    subject,
    text: 'Gracias por tu compra. Adjuntamos tu entrada en PDF.',
    attachments: [
      {
        content: pdfBuffer.toString('base64'),
        filename: 'entrada.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Correo enviado a', to);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.response?.body || error.message);
  }
};
