var express = require('express');
var router = express.Router();

/* GET home page with DevOps Dashboard */
router.get('/', function(req, res, next) {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fast API Dev - DevOps UTEQ</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #1e293b;
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 600px;
      width: 100%;
      text-align: center;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    h1 { font-size: 2rem; color: #38bdf8; margin-bottom: 0.5rem; }
    p { color: #94a3b8; margin-bottom: 0.25rem; }
    .infra {
      background: #0f172a;
      border-radius: 12px;
      padding: 1.5rem;
      font-family: monospace;
      font-size: 0.85rem;
      color: #4ade80;
      text-align: left;
      max-width: 600px;
      width: 100%;
    }
    .label { color: #38bdf8; font-weight: bold; }
    .endpoints { display: flex; gap: 0.8rem; margin-top: 1.5rem; flex-wrap: wrap; justify-content: center; }
    .btn {
      background: #1e40af;
      color: white;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .btn:hover { background: #2563eb; transform: translateY(-2px); }
    .btn-monitoring { background: #c2410c; } /* Estilo para Prometheus/Grafana */
    .btn-monitoring:hover { background: #ea580c; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Fast API Dev - v2.0</h1>
    <p>Pipeline CI/CD con GitHub Actions</p>
    <p style="color:#64748b; font-size:0.85rem;">UTEQ — DevOps 2026</p>
    
    <div class="endpoints">
      <a class="btn" href="/health">🟢 Health</a>
      <a class="btn" href="/items">📦 Items</a>
      <a class="btn" href="/metrics">📊 Metrics</a>
    </div>

    <div class="endpoints" style="margin-top: 10px;">
      <p style="width: 100%; font-size: 0.8rem; margin-bottom: 5px;">Observabilidad:</p>
      <a class="btn btn-monitoring" href="http://${req.hostname}:9090" target="_blank">🔥 Prometheus</a>
      <a class="btn btn-monitoring" href="http://${req.hostname}:3000" target="_blank">📈 Grafana</a>
    </div>
  </div>

  <div class="infra">
    <span class="label">INFRAESTRUCTURA DE RED</span><br>
    &nbsp;&nbsp;&nbsp;↓&nbsp; Acceso Externo: http://${req.hostname}:8080<br>
    +----------------------------------+<br>
    |&nbsp; INSTANCIA GCP (vpn-1)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
    |&nbsp; User: g2023171060&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
    +----------------------------------+<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓&nbsp; Docker Containers<br>
    +----------------------------------+<br>
    |&nbsp; [Node.js App] :3000 &lt;- Mapeado :8080 |<br>
    |&nbsp; [Prometheus]  :9090&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
    |&nbsp; [Grafana]     :3000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
    +----------------------------------+<br>
  </div>
</body>
</html>
  `);
});

/* Endpoint de salud */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime() 
  });
});

module.exports = router;
