//obtener todos los registos de la tabla proveedores
exports.listarProveedores = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT idProveedor, nombreProveedor,direccionProveedor,telefonoProveedor,ciudadProveedor,emailProveedor,RFCProveedor,razonSocial FROM Proveedores where estado = 1';

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

//Agregar un nuevo proveedor
exports.agregarProveedor = function (req) {
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

				let query = 'insert into Proveedores set ?';

				let request_body = {
          nombreProveedor: body.nombreProveedor,
          direccionProveedor: body.direccionProveedor,
          telefonoProveedor: body.telefonoProveedor,
          ciudadProveedor: body.ciudadProveedor,
          emailProveedor: body.emailProveedor,
          RFCProveedor: body.RFCProveedor,
          razonSocial:body.razonSocial,
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
							respuesta: 'Proveedor dado de alta correctamente'

						});
					}
				});
			}
		});
	});
}

//modificar un proveedor existente
exports.modificarProveedor = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		let idProveedor = req.params.idProveedor;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {

				let nombreProveedor = body.nombreProveedor;
				let direccionProveedor = body.direccionProveedor;
				let telefonoProveedor = body.telefonoProveedor;
				let ciudadProveedor = body.ciudadProveedor;
				let emailProveedor = body.emailProveedor;
				let RFCProveedor = body.RFCProveedor;
				let razonSocial = body.razonSocial;

				let query = `update Proveedores set nombreProveedor='${nombreProveedor}',direccionProveedor='${direccionProveedor}',telefonoProveedor='${telefonoProveedor}',ciudadProveedor='${ciudadProveedor}',emailProveedor='${emailProveedor}',RFCProveedor='${RFCProveedor}',razonSocial='${razonSocial}', fechaActualizacion = now() where idProveedor = '${idProveedor}'`;

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
							respuesta: 'Proveedor actualizado correctamente'

						});
					}
				});
			}
		});
	});
}

 //eliminar un proveedor existente
 exports.eliminarProveedor = function (req) {
 	return new Promise((resolve, reject) => {

 		let idProveedor = req.params.idProveedor;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update Proveedores set ? where idProveedor = '${idProveedor}'`;

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
 							respuesta: 'Proveedor eliminado correctamente'

 						});
 					}
 				});
 			}
 		});
 	});
 }
