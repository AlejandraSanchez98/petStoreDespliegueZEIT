exports.verificarTokenEnviarCorreo=function (req, res, next){
    var headers = req.headers;

    if (headers.authorization) {
      /*res.json({
        estatus: 1,
        respuesta: 'Si hay cabecera de Autorizacion'
      });*/
      var split = headers.authorization.split(" ");
      var tokenEnviarCorreo = split[1];
      req.tokenEnviarCorreo = tokenEnviarCorreo;
      next();
    }
    else {
      res.json({
        estatus: -1,
        respuesta: 'La cabecera de Autorizacion es requerida'
      });
    }
  }

  exports.claveSecreta='r3cu93r4rc0ntr453n4';
