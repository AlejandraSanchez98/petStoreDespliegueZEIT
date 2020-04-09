var nodemailer = require('nodemailer');
var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');

exports.verificarCorreoUsuario  = function (req) {
	return new Promise((resolve, reject) => {
		console.log(req.token);
		let body = req.body;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				let correo= body.correo;

				var query = `SELECT idUsuario, correo FROM Usuarios WHERE correo= '${correo}' AND  estado=1`;

				database.query(query, function (error, success) {
					if (error) {
						reject({
							estatus: -1,
							respuesta: error
						});
					}
					else {
						if (success.length == 0) {
							resolve({
								estatus: 0,
								respuesta: "Verificar Credenciales"
							});
						}
						else if (success.length > 0) {
							console.log("Generando token....",success[0].correo)
							payload = {
								correo:success[0].correo
							};
							expiracion = {
								expiresIn: 60 * 60 * 24
							};

							jsonWebToken.sign(payload,jwt.claveSecreta,expiracion,function(error,token){
								if(token){

									console.log("este es el token de recuperar contraseña: ",token);
									process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
									var transporter = nodemailer.createTransport({
										service: 'Gmail',
										host: 'smtp.gmail.com',
										port: 587,
										secure: false,
										auth: {
											user: 'anasanchezarias98@gmail.com',
											pass: 'wecouldback200498'
										}
									});
									var mailOptions = {
										from: 'PetStore',
										to: success[0].correo,
										subject: 'Restablecer Contraseña',
										text: 'Este es el enlace para restablecer tu contraseña:https://localhost:4200/clientes?token='+ token + '&idUsuario='+ success[0].idUsuario,
										attachments: [{
											filename: 'LogoCorreo.png',
											path: __dirname +'/LogoCorreo.png',
											cid: 'logo'
										}],
										html:
										`<div style="width:750px;background-color:white;color:#2d5277;border: 1px solid #2d5277;border-radius: 5px">
										<div style="background-color:#2d5277;color:white;padding:5px">
										<h1 style="color:white; margin:0;text-align: center;">Pet Store</h1>
										</div>
										<div style="padding-left:20px;margin-bottom: 30px;">
										<div align="center" style="margin:30px;">
										<img style=
										"width:190px;" src="cid:logo">
										</div>
										<div align="center">
										<p class="card-text" style="font-size: 17px;margin:30px;">Recibimos una solicitud de cambio de contraseña haz clic en el botón Restablecer contraseña para hacerlo.</p>
										<a style=" text-decoration: none;border-radius: 4px;background-color: #2d5277;border: none;color: #FFFFFF;text-align: center;font-size: 20px;padding: 15px;width: 250px;" href="http://localhost:4200/cambiarPassword?token=${token}&idUsuario=${success[0].idUsuario}">Restablecer Contraseña</a>
										</div>
										</div>
										</div>`
									};
									transporter.sendMail(mailOptions, function(error, info){
										if (error){
											console.log(error);
											reject({
												estatus: -1,
												respuesta: error
											});
										}
										else {
											resolve({
												estatus: 1,
												respuesta: 'Email enviado'
											});

										}
									});
								}
								if (error) {
									reject({
										estatus: -1,
										respuesta: error
									});
								}
							});
						}
					}
				});
			}
		});
	});
}

exports.verificarToken = function (req) {
	return new Promise((resolve, reject) => {
		let body = req.body;
		jsonWebToken.verify(body.jwt,jwt.claveSecreta,function(error, decode){
			if(decode){
				resolve({
					estatus: 1,
					respuesta: 'Token correcto'
				});
			}else if (error) {
				reject({
					estatus: -1,
					respuesta: 'El token a caducado o es incorrecto'
				});
			}
		})
	});
}



exports.cambiarContrasenia = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {

				let passwordUsuario = body.passwordUsuario;

				let query = `update Usuarios set passwordUsuario = '${passwordUsuario}', fechaActualizacion = now() WHERE idUsuario = '${body.idUsuario}'`;
				database.query(query, function (error, success) {
					if (error) {
						reject({
							estatus: -1,
							respuesta: error
						});
					}
					else {
						resolve({
							estatus: 1,
							respuesta: 'Contraseña actualizada correctamente'

						});
					}
				});
			}
		});
	});
}
