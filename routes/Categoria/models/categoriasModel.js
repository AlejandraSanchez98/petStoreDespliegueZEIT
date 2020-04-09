//obtener todos los registos de la tabla Categoria
exports.listarCategorias = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT idCategoria,nombreCategoria,subCategoria,descripcion FROM Categoria where estado = 1;';

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

//Agregar una nueva categoria
exports.agregarCategoria = function (req) {
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

				let query = 'insert into Categoria set ?';

				let request_body = {
					nombreCategoria: body.nombreCategoria,
					subCategoria: body.subCategoria,
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
							respuesta: 'Categoria dada de alta correctamente'

						});
					}
				});
			}
		});
	});
}

//modificar una categoria existente
exports.modificarCategoria = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		let idCategoria = req.params.idCategoria;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				let nombreCategoria = body.nombreCategoria;
				let subCategoria = body.subCategoria;
				let descripcion = body.descripcion;

				let query = `update Categoria set nombreCategoria= '${nombreCategoria}',subCategoria= '${subCategoria}',descripcion= '${descripcion}', fechaActualizacion = now() where idCategoria = '${idCategoria}'`;

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
							respuesta: 'Categoria actualizada correctamente'

						});
					}
				});
			}
		});
	});
}

 //eliminar una categoria existente
 exports.eliminarCategoria = function (req) {
 	return new Promise((resolve, reject) => {

 		let idCategoria = req.params.idCategoria;
 		req.getConnection(function (error, database) {
 			if (error) {
 				reject({
 					estatus: -1,
 					respuesta: error
 				});
 			}
 			else {

 				let query = `update Categoria set ? where idCategoria = '${idCategoria}'`;

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
 							respuesta: 'Categoria eliminada correctamente'

 						});
 					}
 				});
 			}
 		});
 	});
 }
