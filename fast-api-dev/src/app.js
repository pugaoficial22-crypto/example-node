const express = require('express');
const path = require('node:path'); 
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const client = require('prom-client');

// Routers
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const itemsRouter = require('../routes/items');

const app = express();

// --- CONFIGURACIÓN DE PROMETHEUS ---
// Inicia la recolección de métricas por defecto (CPU, Memoria, etc.)
client.collectDefaultMetrics();

// Métrica personalizada: Contador de peticiones
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP procesadas',
  labelNames: ['metodo', 'ruta', 'estado_http'],
});

// Métrica personalizada: Gauge de usuarios
const activeUsersGauge = new client.Gauge({
    name: 'active_users_current',
    help: 'Número actual de usuarios activos simulados'
});

// Middleware para registrar cada petición
app.use((req, res, next) => {
  res.on('finish', () => {
    // Solo registramos si la ruta fue encontrada o es relevante
    httpRequestCounter.inc({
      metodo: req.method,
      ruta: req.route ? req.route.path : req.url,
      estado_http: res.statusCode
    });
  });
  next();
});

// Simulación de usuarios activos (No corre en entorno de pruebas)
if (process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    activeUsersGauge.set(Math.floor(Math.random() * 50) + 10);
  }, 5000);
}
// -----------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- ENDPOINT DE MÉTRICAS (Ubicación Estratégica) ---
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
// ----------------------------------------------------

// Rutas de la API
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

// Manejador de errores básico (404)
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});
     
module.exports = app;