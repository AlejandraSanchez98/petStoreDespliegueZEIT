var express = require('express');
var router = express.Router();
//requerir el modelo
var comprasModel = require('../models/comprasModel');
var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods: GET, POST");
	next();
});



router.get('/listarCompras',jwt.verificarExistenciaToken,function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				comprasModel.listarCompras(req).then(
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


//obtener todos los registos de la tabla compras
router.get('/listarComprasDetalles/:idCompra',jwt.verificarExistenciaToken,function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				comprasModel.listarComprasDetalles(req).then(
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

router.get('/listarComprasSinDetalles',jwt.verificarExistenciaToken,function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				comprasModel.listarComprasSinDetalles(req).then(
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

//Agregar una nueva compra
router.post('/agregarCompra',jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				comprasModel.agregarCompra(req).then(
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
