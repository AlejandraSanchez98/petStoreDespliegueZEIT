var express = require('express');
var router = express.Router();
//requerir el modelo
var metodoPagoModel = require('../models/metodoPagoModel');
var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
	next();
});

//obtener todos los registos de la tabla metodo de pago
router.get('/listarMetodosPago',jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				metodoPagoModel.listarMetodosPago(req).then(
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

//obtener todos los registos de la tabla metodo de pago por ID
router.get('/listarMetodosPagoPorID/:idMetodoPago',jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				metodoPagoModel.listarMetodosPagoPorID(req).then(
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


//Agregar un nuevo metodo de pago
router.post('/agregarMetodoPago',jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				metodoPagoModel.agregarMetodoPago(req).then(
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

//modificar un metodo de pago existente
router.put('/modificarMetodoPago/:idMetodoPago',jwt.verificarExistenciaToken, function (req, res, next) {
	try {

		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				metodoPagoModel.modificarMetodoPago(req).then(
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

//eliminar un  metodo de pago existente
router.delete('/eliminarMetodoPago/:idMetodoPago',jwt.verificarExistenciaToken, function (req, res, next) {
	try {

		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				metodoPagoModel.eliminarMetodoPago(req).then(
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


module.exports = router;
