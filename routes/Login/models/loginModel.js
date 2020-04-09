var jwt = require('../../../public/servicios/jwt');
var jsonWebToken = require('jsonwebtoken');

exports.verificarUsuario  = function (req) {
	return new Promise((resolve, reject) => {
    console.log(req.token);
		let body = req.body;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
        let nombreUsuario= body.nombreUsuario;
        let passwordUsuario= body.passwordUsuario;
				var query = `SELECT * FROM Usuarios WHERE nombreUsuario= '${nombreUsuario}' AND passwordUsuario='${passwordUsuario}' AND  estado=1`;

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
                respuesta: "Verificar Credenciales"
              });
            }
            else if (success.length > 0) {
              console.log("Generando token....")
              payload = {
                p1:'AASA2098',
                P2:'W3C0ULDB4CK',
                p3:'4V1C11'
              };
              jsonWebToken.sign(payload,jwt.claveSecreta,function(error,token){
                if(token){
                  console.log("tu token generado en el login es: ", token);
                  resolve({
                    estatus: 1,
                    respuesta: token
                  });
                }
                if (error) {
                  reject({
                    estatus: -1,
                    respuesta: error
                  });
                }
              });
            }
          }
        });
			}
		});
	});
}
