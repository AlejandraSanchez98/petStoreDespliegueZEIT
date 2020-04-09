//obtener todos los registos de la tabla bitacora de accesos
exports.listarAccesos = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT ba.idAcceso, ba.accion, ba.fechaRegistro, u.nombreUsuario FROM BitacoraAccesos ba  INNER JOIN Usuarios u  ON ba.idUsuario=u.idUsuario WHERE ba.estado = 1 ORDER BY idAcceso ASC';

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

//Agregar un nuevo acceso
exports.agregarAcceso = function (req) {
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

				let query = 'insert into BitacoraAccesos set ?';

				let request_body = {
          accion: body.accion,
          idUsuario: body.idUsuario
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
							respuesta: 'Acceso dado de alta correctamente'

						});
					}
				});
			}
		});
	});
}
