//obtener todas las devoluciones
exports.listarDevoluciones = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT d.idDevolucion, d.montoDevolucion, d.motivoDevolucion, c.nombreCliente, td.tipoDevolucion, p.nombreProducto FROM Devoluciones d INNER JOIN  Clientes c  ON d.idCliente = c.idCliente INNER JOIN tipoDevolucion td  ON d.idTipoDevolucion = td.idTipoDevolucion INNER JOIN Productos p ON d.idProducto = p.idProducto WHERE d.estado = 1';

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

//Agregar una nueva devolución
exports.agregarDevolucion = function (req) {
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

				let query = 'insert into Devoluciones set ?';

				let request_body = {
         			montoDevolucion: body.montoDevolucion,
         			motivoDevolucion: body.motivoDevolucion,
         			idCliente: body.idCliente,
					idTipoDevolucion: body.idTipoDevolucion,
					idProducto: body.idProducto
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
							respuesta: 'Devolución dada de alta correctamente'

						});
					}
				});
			}
		});
	});
}
