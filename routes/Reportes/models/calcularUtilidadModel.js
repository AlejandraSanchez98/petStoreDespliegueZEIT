
//obtener utilidad
exports.calcularUtilidad = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'CALL Utilidad()';

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
							var array = [];
							for (var i = 0; i < success.length - 1; i++) {
								array[i]=success[i];
							}
							resolve({
								estatus: 1,
								respuesta: array

							});
						}
					}
				});
			}
		});
	});
}
