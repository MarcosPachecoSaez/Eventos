const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { sendTicketEmail } = require('./sendEmail.cjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/enviar-pdf', async (req, res) => {
  const { to, subject, pdfBase64 } = req.body;

  if (!to || !subject || !pdfBase64) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    await sendTicketEmail(to, subject, pdfBuffer);
    res.status(200).json({ mensaje: 'Correo enviado' });
  } catch (error) {
    console.error('❌ Error al enviar:', error);
    res.status(500).json({ error: 'Fallo en el envío' });
  }
});

app.listen(3000, () => {
  console.log('📡 Servidor Node corriendo en http://localhost:3000');
});
