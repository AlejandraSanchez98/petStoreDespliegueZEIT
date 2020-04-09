var express = require('express');
var router = express.Router();
//requerir el modelo
var  productoStockMinimoModel= require('../models/productoStockMinimoModel');
var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
	res.header("Access-Control-Allow-Methods: GET");

	next();
});

//obtener productos con stock minimo
router.get('/productoStockMinimo',jwt.verificarExistenciaToken, function (req, res, next) {
	try {
		//web service
		jsonWebToken.verify(req.token,jwt.claveSecreta,function(error,decoded){
			if (decoded) {
				productoStockMinimoModel.productoStockMinimo(req).then(
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
