const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 4000;

// Cambia a blue o green
app.post('/switch/:color', (req, res) => {
  const color = req.params.color;
  if (color !== 'blue' && color !== 'green') {
    return res.status(400).send('Color inválido');
  }
  // Script para cambiar el backend en nginx
  exec(`/home/g2023171060/switch.sh ${color}`, (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Blue/Green API corriendo en puerto ${PORT}`);
});
