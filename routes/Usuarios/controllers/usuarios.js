var express = require('express');
var router = express.Router();

//requerir el modelo
var usuariosModel = require('../models/usuariosModel');
var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');


router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

	next();
});

//obtener todos los registos de la tabla usuarios
router.get('/listarUsuarios', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				usuariosModel.listarUsuarios(req).then(
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



//obtener los usuarios por nombre
router.post('/listarUsuariosPornombre', function (req, res, next) {
	try {
		//web service
		usuariosModel.listarUsuariosPornombre(req).then(
			(success) => {
				res.json(success);
			},
			(error) => {
				res.json(error);
			}
		);
	}
	catch (error) {
		return next(error);
	}
});


//Agregar un nuevo usuario
router.post('/agregarUsuario', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				usuariosModel.agregarUsuario(req).then(
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

//modificar un usuario existente
router.put('/modificarUsuario/:idUsuario', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				usuariosModel.modificarUsuario(req).then(
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

//eliminar un usuario existente
router.delete('/eliminarUsuario/:idUsuario', jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				usuariosModel.eliminarUsuario(req).then(
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
