//obtener todos los registos de la tabla compras
exports.listarCompras = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT c.idCompra,c.montoTotal,c.fechaRegistro,p.nombreProveedor, u.nombreUsuario, pro.nombreProducto, cp.cantidadProducto  FROM Compras c INNER JOIN Proveedores p  ON c.idProveedor=p.idProveedor INNER  JOIN Usuarios u  ON c.idUsuario=u.idUsuario INNER JOIN compras_productos cp ON c.idCompra= cp.idCompra INNER JOIN  Productos  pro ON cp.idProducto=pro.idProducto WHERE c.estado=1 ORDER BY idCompra ASC';

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


exports.listarComprasDetalles = function (req) {
	return new Promise((resolve, reject) => {
		let idCompra = req.params.idCompra;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = `SELECT c.idCompra,c.montoTotal,c.fechaRegistro,p.nombreProveedor, u.nombreUsuario, pro.nombreProducto, cp.cantidadProducto  FROM Compras c INNER JOIN Proveedores p  ON c.idProveedor=p.idProveedor INNER  JOIN Usuarios u  ON c.idUsuario=u.idUsuario INNER JOIN compras_productos cp ON c.idCompra= cp.idCompra INNER JOIN  Productos  pro ON cp.idProducto=pro.idProducto WHERE c.idCompra='${idCompra}' AND c.estado=1  ORDER BY idCompra ASC`;

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


exports.listarComprasSinDetalles = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT c.idCompra,c.montoTotal,c.fechaRegistro,p.nombreProveedor, u.nombreUsuario FROM Compras c INNER JOIN Proveedores p  ON c.idProveedor=p.idProveedor  INNER  JOIN Usuarios u  ON c.idUsuario=u.idUsuario WHERE c.estado=1 ORDER BY idCompra ASC';

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


//Agregar una nueva compra
exports.agregarCompra = function (req) {
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
				let montoTotal = body.montoTotal;
				let idProveedor = body.idProveedor;
				let idUsuario = body.idUsuario;
				let productos = body.productos;

				let query = `INSERT INTO Compras(montoTotal,idProveedor, idUsuario) values(${montoTotal},${idProveedor},${idUsuario})`;
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
							respuesta: 'Compra dada de alta correctamente'

						});
					}
				});


				for (var i = 0; i < productos.length; i++) {
					console.log("entro", productos);
					let queryCP = `INSERT INTO compras_productos (idCompra,idProducto,cantidadProducto) values(LAST_INSERT_ID(),${productos[i].idProducto},${productos[i].cantidadProducto})`;
					database.query(queryCP, function (error, success) {
						if (error) {
							reject({
								estatus: -1,
								respuesta: error
							});
						}
						else {
							resolve({
								estatus: 1,
								respuesta: 'Venta  dada de alta correctamente'
							});
						}
					});

					let queryU = `UPDATE Productos SET stock = stock + ${productos[i].cantidadProducto} WHERE estado = 1 AND  idProducto=${productos[i].idProducto}`;
					database.query(queryU, function (error, success) {
						if (error) {
							reject({
								estatus: -1,
								respuesta: error
							});
						}
						else {
							resolve({
								estatus: 1,
								respuesta: 'Venta  dada de alta correctamente'
							});
						}
					});
				}
			}
		});
	});
}
