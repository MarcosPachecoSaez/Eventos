// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sendTicketEmail } = require('./sendEmail');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/enviar-pdf', async (req, res) => {
  const { to, subject, pdfBase64 } = req.body;
  const pdfBuffer = Buffer.from(pdfBase64, 'base64');

  try {
    await sendTicketEmail(to, subject, pdfBuffer);
    res.status(200).json({ message: 'Correo enviado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar correo' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
