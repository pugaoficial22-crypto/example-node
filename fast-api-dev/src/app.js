const express = require('express');
const path = require('node:path'); 
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// CORREGIDO: Subimos un nivel para encontrar las carpetas desde /src
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const itemsRouter = require('../routes/items');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORREGIDO: Ajuste de ruta para la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

// Endpoint de salud para que el test y el deploy no fallen
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;