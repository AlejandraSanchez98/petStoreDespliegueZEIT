var express = require('express');
var router = express.Router();
//requerir el modelo
var productosModel = require('../models/productosModel');
var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');


router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE")
	next();
});

//obtener todos los registos de la tabla productos
router.get('/listarProductos', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				productosModel.listarProductos(req).then(
					(success) => {
						res.json(success);
					},
					(error) => {
						res.json(error);
					}
				);
			}
			else
			if (error) {
				res.json({
					estatus: -1,
					respuesta: "Token incorrecto, vuelve a intentarlo"
				});
			}
		});
	}
	catch (error) {
		return next(error);
	}
});

//Agregar un nuevo producto
router.post('/agregarProducto',jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				//web service
				productosModel.agregarProducto(req).then(
					(success) => {
						res.json(success);
					},
					(error) => {
						res.json(error);
					}
				);
			}
			else if (error) {
				res.json({
					estatus: -1,
					respuesta: "Token incorrecto, vuelve a intentarlo"
				});
			}
		});
	}
	catch (error) {
		return next(error);
	}
});

//modificar un producto existente
router.put('/modificarProducto/:idProducto', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				productosModel.modificarProducto(req).then(
					(success) => {
						res.json(success);
					},
					(error) => {
						res.json(error);
					}
				);
			}
			else if (error) {
				res.json({
					estatus:-1,
					respuesta:"Token incorrecto, vuelve a intentarlo"
				});
			}
		});
	}
	catch (error) {
		return next(error);
	}
});

//eliminar un producto existente
router.delete('/eliminarProducto/:idProducto', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error, decoded){
			if (decoded) {
				productosModel.eliminarProducto(req).then(
					(success) => {
						res.json(success);
					},
					(error) => {
						res.json(error);
					}
				);
			}
			else if (error) {
				res.json({
					estatus:-1,
					respuesta:"Token incorrecto, vuelve a intentarlo"
				});
			}
		});
	}
	catch (error) {
		return next(error);
	}
});


module.exports = router;
