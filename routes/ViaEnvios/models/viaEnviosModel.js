//obtener todos los medios de  envio
exports.listarMediosEnvios = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT idViaEnvio, medioEnvio, descripcion FROM viaEnvio WHERE estado=1';

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

//Agregar un nuevo medio de envio
exports.agregarMedioEnvio = function (req) {
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

				let query = 'insert into viaEnvio set ?';

				let request_body = {
          medioEnvio:body.medioEnvio,
          descripcion:body.descripcion
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
							respuesta: 'Medio de Envio dado de alta correctamente'

						});
					}
				});
			}
		});
	});
}

//modificar un medio de envio existente
exports.modificarMedioEnvio = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		let idViaEnvio = req.params.idViaEnvio;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				let medioEnvio=body.medioEnvio;
				let descripcion=body.descripcion;

				let query = `UPDATE viaEnvio set  medioEnvio = '${medioEnvio}', descripcion = '${descripcion}', fechaActualizacion = now()  where idViaEnvio = '${idViaEnvio}'`;
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
							respuesta: 'Medio de Envio actualizado correctamente'

						});
					}
				});
			}
		});
	});
}

 //eliminar un medio de envio existente
 exports.eliminarMedioEnvio = function (req) {
 	return new Promise((resolve, reject) => {

 		let idViaEnvio = req.params.idViaEnvio;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update viaEnvio set ? where idViaEnvio = '${idViaEnvio}'`;

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
 							respuesta: 'Medio de Envio eliminado correctamente'

 						});
 					}
 				});
 			}
 		});
 	});
 }
