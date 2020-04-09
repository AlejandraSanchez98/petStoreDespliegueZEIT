//obtener todos los registos de la tabla envios
exports.listarEnvios = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT e.idEnvio,e.direccion,e.ciudad,e.observaciones,v.idVenta,ve.medioEnvio FROM Envios e INNER JOIN Ventas v ON e.idVenta=v.idVenta INNER JOIN viaEnvio ve ON e.idViaEnvio=ve.idViaEnvio WHERE e.estado=1';

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

//Agregar un nuevo envio
exports.agregarEnvio = function (req) {
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

				let query = 'insert into Envios set ?';

				let request_body = {
          direccion: body.direccion,
          ciudad: body.ciudad,
          observaciones: body.observaciones,
          idVenta: body.idVenta,
          idViaEnvio:body.idViaEnvio
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
							respuesta: 'Envio dado de alta correctamente'

						});
					}
				});
			}
		});
	});
}


 //eliminar un envio existente
 exports.eliminarEnvio = function (req) {
 	return new Promise((resolve, reject) => {

 		let idEnvio = req.params.idEnvio;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update Envios set ? where idEnvio = ${idEnvio}`;

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
 							respuesta: 'Envio  eliminado correctamente'
 						});
 					}
 				});
 			}
 		});
 	});
 }
