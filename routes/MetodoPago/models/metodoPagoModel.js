//obtener todos los registos de la tabla metodo de pago
exports.listarMetodosPago = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT idMetodoPago, tipoPago FROM  metodoPago WHERE estado = 1';

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


//obtener todos los registos de la tabla metodo de pago por id
exports.listarMetodosPagoPorID = function (req) {
	return new Promise((resolve, reject) => {
		let idMetodoPago = req.params.idMetodoPago;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = `SELECT * FROM  metodoPago WHERE idMetodoPago='${idMetodoPago}' AND estado = 1`;

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



//Agregar un nuevo metodo de pago
exports.agregarMetodoPago = function (req) {
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

				let query = 'insert into MetodoPago set ?';

				let request_body = {
          tipoPago:body.tipoPago
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
							respuesta: 'Metodo de pago dado de alta correctamente'

						});
					}
				});
			}
		});
	});
}

//modificar un metodo de pago existente
exports.modificarMetodoPago = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		let idMetodoPago = req.params.idMetodoPago;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				let tipoPago = body.tipoPago;
				let query = `UPDATE MetodoPago set tipoPago = '${tipoPago}', fechaActualizacion = now() WHERE idMetodoPago = '${idMetodoPago}'`;

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
							respuesta: 'Metodo de pago actualizado correctamente'

						});
					}
				});
			}
		});
	});
}

 //eliminar un metodo de pago existente
 exports.eliminarMetodoPago = function (req) {
 	return new Promise((resolve, reject) => {

 		let idMetodoPago = req.params.idMetodoPago;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update MetodoPago set ? where idMetodoPago = '${idMetodoPago}'`;

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
 							respuesta: 'Metodo de Pago eliminado correctamente'

 						});
 					}
 				});
 			}
 		});
 	});
 }
