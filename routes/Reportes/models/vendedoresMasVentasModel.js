//obtener Vendedores con mas ventas
exports.vendedoresMasVentas = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT  u.idUsuario, u.nombreUsuario AS Vendedor, SUM(V.montoConIVA) AS ImporteVenta FROM Usuarios u  INNER JOIN Ventas V ON u.idUsuario = V.idUsuario WHERE V.estado = 1 and u.tipoUsuario="Vendedor"  GROUP BY u.idUsuario, u.nombreUsuario ORDER BY SUM(V.montoConIVA)  DESC  LIMIT 0 , 5';

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
