var express = require('express');
var router = express.Router();
//requerir el modelo
var categoriasModel = require('../models/categoriasModel');
var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');


router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
		res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
	next();
});

//obtener todos los registos de la tabla Categoria
router.get('/listarCategorias',jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if(decoded){
				categoriasModel.listarCategorias(req).then(
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

//Agregar una nueva categoria
router.post('/agregarCategoria', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token, jwt.claveSecreta,function(error, decoded){
			if (decoded) {
				categoriasModel.agregarCategoria(req).then(
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

//modificar una categoria existente
router.put('/modificarCategoria/:idCategoria', jwt.verificarExistenciaToken, function (req, res, next) {
	try {

		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if(decoded){
				categoriasModel.modificarCategoria(req).then(
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

//eliminar una categoria existente
router.delete('/eliminarCategoria/:idCategoria', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		jsonWebToken.verify(req.token, jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				categoriasModel.eliminarCategoria(req).then(
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
