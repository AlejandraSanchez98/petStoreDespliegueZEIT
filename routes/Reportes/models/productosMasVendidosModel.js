//obtener productos mas vendidos
exports.productosMasVendidos = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT  vp.idProducto, p.nombreProducto AS Producto, SUM(vp.cantidadProducto) AS TotalVentas FROM ventas_productos vp  INNER JOIN Productos p ON vp.idProducto = p.idProducto WHERE p.estado = 1  GROUP BY vp.idProducto, p.nombreProducto ORDER BY SUM(vp.cantidadProducto)  DESC  LIMIT 0 , 5 ';

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
