//obtener todos los registos de la tabla clientes
exports.listarClientes = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT idCliente, nombreCliente, direccionCliente, ciudadCliente, telefonoCliente, emailCliente FROM Clientes where estado = 1';

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

//Agregar un nuevo cliente
exports.agregarCliente = function (req) {
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
				let nombreCliente = body.nombreCliente;
				let emailCliente = body.emailCliente;

				 var query = `SELECT * FROM Clientes WHERE (nombreCliente ='${nombreCliente}' or emailCliente='${emailCliente}') and  estado = 1`;

				database.query(query, function (error, success) {
					if (error) {
						reject({
							estatus: -1,
							respuesta: error
						});
					}
					if (success.length == 0) {
						let nombreCliente = body.nombreCliente;
						let direccionCliente = body.direccionCliente;
						let ciudadCliente = body.ciudadCliente;
						let telefonoCliente = body.telefonoCliente;
						let emailCliente = body.emailCliente;
						let passwordCliente = body.passwordCliente;

						let query = `INSERT INTO Clientes(nombreCliente, direccionCliente, ciudadCliente, telefonoCliente, emailCliente, passwordCliente) VALUES ('${nombreCliente}', '${direccionCliente}', '${ciudadCliente}', '${telefonoCliente}', '${emailCliente}', '${passwordCliente}')`;
						database.query(query,function(error,success){
							if (error) {
								reject({
									estatus:-1,
									respuesta:error
								});
							}
							else {
								resolve({
									estatus: 1,
									respuesta: 'Cliente dado de alta correctamente'
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

//modificar un cliente existente
exports.modificarCliente = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		let idCliente = req.params.idCliente;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				let nombreCliente = body.nombreCliente;
				let direccionCliente = body.direccionCliente;
				let ciudadCliente = body.ciudadCliente;
				let telefonoCliente = body.telefonoCliente;
				let emailCliente = body.emailCliente;
				let passwordCliente = body.passwordCliente;

				let query = `UPDATE Clientes SET nombreCliente='${nombreCliente}', direccionCliente ='${direccionCliente}', ciudadCliente ='${ciudadCliente}', telefonoCliente='${telefonoCliente}', emailCliente = '${emailCliente}', passwordCliente='${passwordCliente}', fechaActualizacion = now() WHERE  idCliente='${idCliente}'`;
				database.query(query,function (error, success) {
					if (error) {
						reject({
							estatus: -1,
							respuesta: error
						});
					}
					else {
						resolve({
							estatus: 1,
							respuesta: 'Cliente actualizado correctamente'

						});
					}
				});
			}
		});
	});
}

 //eliminar un cliente existente
 exports.eliminarCliente = function (req) {
 	return new Promise((resolve, reject) => {

 		let idCliente = req.params.idCliente;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update Clientes set ? where idCliente = '${idCliente}'`;

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
 							respuesta: 'Cliente eliminado correctamente'

 						});
 					}
 				});
 			}
 		});
 	});
 }
