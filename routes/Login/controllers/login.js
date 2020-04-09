var express = require('express');
var router = express.Router();
//requerir el modelo
var loginModel = require('../models/loginModel');

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods: POST");
	next();
});

router.post('/verificarUsuario', function (req, res, next) {
	try {
		//web service
		loginModel.verificarUsuario(req).then(
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

module.exports = router;
