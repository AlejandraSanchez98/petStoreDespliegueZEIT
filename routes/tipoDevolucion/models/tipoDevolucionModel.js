//obtener los tipos de devoluciones
exports.listarTiposDevoluciones = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT idTipoDevolucion, tipoDevolucion, descripcion FROM tipoDevolucion where estado = 1';

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

//Agregar un nuevo tipo de devolución
exports.agregarTipoDevolucion = function (req) {
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

				let query = 'insert into tipoDevolucion set ?';

				let request_body = {
          tipoDevolucion: body.tipoDevolucion,
          descripcion: body.descripcion
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
							respuesta: 'Tipo Devolución dada de alta correctamente'

						});
					}
				});
			}
		});
	});
}

//modificar tipo de devolución existente
exports.modificarTipoDevolucion = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		let idTipoDevolucion = req.params.idTipoDevolucion;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
        let tipoDevolucion = body.tipoDevolucion;
        let descripcion = body.descripcion;

				let query = `UPDATE tipoDevolucion SET tipoDevolucion = '${tipoDevolucion}', descripcion = '${descripcion}', fechaActualizacion = now() WHERE idTipoDevolucion = '${idTipoDevolucion}'`;

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
							respuesta: 'Tipo Devolución actualizada correctamente'

						});
					}
				});
			}
		});
	});
}

 //eliminar un tipo de  devolución existente
 exports.eliminarTipoDevolucion = function (req) {
 	return new Promise((resolve, reject) => {

 		let idTipoDevolucion = req.params.idTipoDevolucion;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update tipoDevolucion set ? where idTipoDevolucion = '${idTipoDevolucion}'`;

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
 							respuesta: 'Tipo Devolución eliminada correctamente'
 						});
 					}
 				});
 			}
 		});
 	});
 }
