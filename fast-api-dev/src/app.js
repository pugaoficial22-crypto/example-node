const express = require('express');
const path = require('node:path'); 
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const client = require('prom-client'); // <--- Cliente de Prometheus

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const itemsRouter = require('../routes/items');

const app = express();

// --- CONFIGURACIÓN DE MÉTRICAS ---
client.collectDefaultMetrics(); // Métricas de CPU/RAM del contenedor

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP procesadas',
  labelNames: ['metodo', 'ruta', 'estado_http'],
});

const activeUsersGauge = new client.Gauge({
    name: 'active_users_current',
    help: 'Número actual de usuarios activos simulados'
});

// Middleware para contar cada visita a tus rutas
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      metodo: req.method,
      ruta: req.route ? req.route.path : req.url,
      estado_http: res.statusCode
    });
  });
  next();
});

// --- CORRECCIÓN: Solo activa el simulador si NO estamos haciendo pruebas ---
if (process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    activeUsersGauge.set(Math.floor(Math.random() * 50) + 10);
  }, 5000);
}
// ---------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

// RUTA PARA PROMETHEUS
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
     
module.exports = app;