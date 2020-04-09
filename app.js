var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/Login/controllers/login');
var categoriaRouter = require('./routes/Categoria/controllers/Categorias');
var proveedoresRouter = require('./routes/Proveedores/controllers/proveedores');
var viaEnvioRouter = require('./routes/ViaEnvios/controllers/viaEnvios');
var clientesRouter = require('./routes/Clientes/controllers/clientes');
var usuariosRouter = require('./routes/Usuarios/controllers/usuarios');
var comprasRouter = require('./routes/Compras/controllers/compras');
var productosRouter = require('./routes/Productos/controllers/productos');
var metodoPagoRouter = require('./routes/MetodoPago/controllers/metodoPago');
var ventasRouter = require('./routes/Ventas/controllers/ventas');
var accesosRouter = require('./routes/Accesos/controllers/accesos');
var enviosRouter = require('./routes/Envios/controllers/envios');
var tipoDevolucionRouter = require('./routes/tipoDevolucion/controllers/tipoDevolucion.js')
var devolucionesRouter = require('./routes/Devoluciones/controllers/devoluciones');
var utilidadRouter = require('./routes/Reportes/controllers/calcularUtilidad');
var productosMasVendidosRouter = require('./routes/Reportes/controllers/productosMasVendidos');
var vendedoresMasVentasRouter = require('./routes/Reportes/controllers/vendedoresMasVentas');
var productoStockMinimoRouter = require('./routes/Reportes/controllers/productoStockMinimo');
var enviarMensajeRouter = require('./routes/EnviarMensaje/controllers/enviarMensaje');

//importar dependencias para poder usar mysql
var mysqlConnection = require('express-myconnection');
var mysql = require('mysql');

//importar body parser
var bodyParser = require('body-parser');

var app = express();

app.use(mysqlConnection(mysql, {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'tiendaMascotas'
}, 'request'));

//usar body parser en mi aplicación express en formato json
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login',loginRouter);
app.use('/categoria', categoriaRouter);
app.use('/proveedores', proveedoresRouter);
app.use('/viaEnvios',viaEnvioRouter);
app.use('/clientes',clientesRouter);
app.use('/usuarios',usuariosRouter);
app.use('/compras', comprasRouter);
app.use('/productos', productosRouter);
app.use('/metodoPago', metodoPagoRouter);
app.use('/ventas',ventasRouter);
app.use('/accesos',accesosRouter);
app.use('/envios',enviosRouter);
app.use('/tipoDevolucion', tipoDevolucionRouter);
app.use('/devoluciones', devolucionesRouter);
app.use('/utilidad',utilidadRouter);
app.use('/productosMasVendidos',productosMasVendidosRouter);
app.use('/vendedoresMasVentas',vendedoresMasVentasRouter);
app.use('/productoStockMinimo', productoStockMinimoRouter);
app.use('/enviarMensaje', enviarMensajeRouter);


//app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
