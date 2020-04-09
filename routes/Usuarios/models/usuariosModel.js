//obtener todos los registos de la tabla usuarios
exports.listarUsuarios = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT idUsuario, nombreUsuario, telefonoUsuario, direccionUsuario, correo, tipoUsuario FROM Usuarios where estado = 1';

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
								respuesta: success
							});
						}
						else if (success.length > 0) {
							resolve({
								estatus: 1,
								respuesta: success
							});
						}
					}
				});
			}
		});
	});
}


//obtener tipo usuario
exports.listarUsuariosPornombre = function (req) {
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
				let nombreUsuario=body.nombreUsuario;
				var query = `SELECT * FROM Usuarios WHERE nombreUsuario= '${nombreUsuario}' AND estado=1`;

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
								respuesta: success
							});
						}
						else if (success.length > 0) {
							resolve({
								estatus: 1,
								respuesta: success
							});
						}
					}
				});
			}
		});
	});
}


//Agregar un nuevo usuario
exports.agregarUsuario = function (req) {
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

				let nombreUsuario = body.nombreUsuario;
				let correo = body.correo;

				var query = `SELECT * FROM Usuarios where (nombreUsuario ='${nombreUsuario}' or correo='${correo}') and  estado = 1`;

				database.query(query, function (error, success) {
					if (error) {
						reject({
							estatus: -1,
							respuesta: error
						});
					}
					if (success.length == 0) {
						let nombreUsuario = body.nombreUsuario;
						let telefonoUsuario = body.telefonoUsuario;
						let direccionUsuario = body. direccionUsuario;
						let correo = body.correo;
						let passwordUsuario = body.passwordUsuario;
						let tipoUsuario = body.tipoUsuario;

						let query = `INSERT INTO Usuarios ( nombreUsuario, telefonoUsuario, direccionUsuario, correo, passwordUsuario, tipoUsuario) VALUES ('${nombreUsuario}', '${telefonoUsuario}', '${direccionUsuario}', '${correo}', '${passwordUsuario}', '${tipoUsuario}')`;

						database.query(query, function(error, success){
							if (error) {
								reject({
									estatus: -1,
									respuesta: error
								});
							}
							else {
								resolve({
									estatus: 1,
									respuesta: 'Usuario dado de alta correctamente'
								});
							}
						});
					}
					else {
						reject({
							estatus: -1,
							respuesta: 'Ya existe este usuario'
						});
					}
				});
			}
		});
	});
}

//modificar un usuario existente
exports.modificarUsuario = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		let idUsuario = req.params.idUsuario;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				let nombreUsuario = body.nombreUsuario;
				let telefonoUsuario = body.telefonoUsuario;
				let direccionUsuario = body. direccionUsuario;
				let correo = body.correo;
				let passwordUsuario = body.passwordUsuario;
				let tipoUsuario = body.tipoUsuario;

				let query = `update Usuarios set nombreUsuario = '${nombreUsuario}', telefonoUsuario = '${telefonoUsuario}', direccionUsuario = '${direccionUsuario}', correo = '${correo}', passwordUsuario = '${passwordUsuario}', tipoUsuario = '${tipoUsuario}', fechaActualizacion = now() WHERE idUsuario = '${idUsuario}'`;
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
							respuesta: 'Usuario actualizado correctamente'

						});
					}
				});
			}
		});
	});
}

 //eliminar un usuario existente
 exports.eliminarUsuario = function (req) {
 	return new Promise((resolve, reject) => {

 		let idUsuario = req.params.idUsuario;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update Usuarios set ? where idUsuario = '${idUsuario}'`;

 				let request_body = {
 					estado: 0
 				};
 				database.query(query, request_body, function (error, success) {
 					if (error) {
 						reject({
 							estatus: -1,
 							respuesta: error
 						});
 					}
 					else {
 						resolve({
 							estatus: 1,
 							respuesta: 'Usuario eliminado correctamente'

 						});
 					}
 				});
 			}
 		});
 	});
 }
