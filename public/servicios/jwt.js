exports.verificarExistenciaToken=function (req, res, next){
    var headers = req.headers;

    if (headers.authorization) {
      /*res.json({
        estatus: 1,
        respuesta: 'Si hay cabecera de Autorizacion'
      });*/
      var split = headers.authorization.split(" ");
      var token = split[1];
      req.token = token;
      next();
    }
    else {
      res.json({
        estatus: -1,
        respuesta: 'La cabecera de Autorizacion es requerida'
      });
    }
  }

  exports.claveSecreta='anannananna';
