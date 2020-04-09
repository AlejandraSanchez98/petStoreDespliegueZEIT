var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
  next();
});

/* GET home page. */
router.get('/json', function (req, res, next) {
  console.log('query params :', req.query);
  console.log('cabeceras :', req.headers);
  console.log('body :', req.body);
  res.json({
    estatus: 1,
    respuesta: req.body
  });
});


//web service para obtener todos los registos de la tabla usuarios
router.get('/listar_usuarios',jwt.verificarExistenciaToken,function(req, res, next){
	try
	{
		console.log('token');
		console.log(req.token);

		jsonWebToken.verify(req.token, jwt.claveSecreta,function(req,res,next){

			router.get('/crearToken', function(req,res,next){
				payload = {
					nombre: 'Pablo',
					apellidos: 'Aguilar',
					correo: 'pablo.aguilar@grupo375.com'
				};
				jsonWebToken.sign(payload,jwt.claveSecreta, function(error, success){
					if (error) {
						res.json({
							estatus: -1,
							respuesta: error
						});
					}
					else {
						res.json({
							estatus: 1,
							respuesta: success
						});
					}
				});

			});
		});

		req.getConnection(function(error, db){
			if(error)
			{
				console.log('error al conectar a db ', error);
				return next(error);
			}
			else
			{
				let query = 'select * from usuarios where estatus = 1;';

				db.query(query, function(error, success){
					if(error)
					{
						console.log('error el ejecutar query ', error);
						return next(error);
					}
					else
					{
						console.log(success);

						for(var i in success)
						{
							success[i].valido = true;
						}

						console.log(success);

						res.json({
							estatus: 1,
							respuesta: success
						});
					}
				});
			}
		});
	}
	catch(error)
	{
		return next(error);
	}
});

/*
	count
	sum
	between
	group by
*/

//web service para agregar un nuevo usuario
router.post('/agregar_categoria', function(req, res, next){
	try
	{
		let body = req.body;
		req.getConnection(function(error, database){
			if(error)
			{
				return next(error);
			}
			else
			{
				let query = 'insert into categoria set ?';

				let request_body = {
					nombreCategoria: body.nombreCategoria,
          			subCategoria: body.subCategoria,
          			descripcion: body.descripcion,
          			estado: body.estado
				};

				database.query(query, request_body, function(error, success){
					if(error)
					{
						console.log('error en query ', error);
						return next(error);
					}
					else
					{
						res.json({
							estatus: 1,
							respuesta: 'Categoria dada de alta correctamente'
						});
					}
				});
			}
		});
	}
	catch(error)
	{
		return next(error);
	}
});

//web service para modificar un usuario existente
router.put('/modificar_usuario/:id_usuario', function(req, res, next){
	try
	{
		let body = req.body;
		let id_usuario = req.params.id_usuario;
		req.getConnection(function(error, database){
			if(error)
			{
				return next(error);
			}
			else
			{
				let query = `update usuarios set ? where id_usuario = ${id_usuario}`;

				let request_body = {
					nombre: body.nombre,
					apellidos: body.apellidos,
					correo: body.correo
				};

				database.query(query, request_body, function(error, success){
					if(error)
					{
						console.log('error en query ', error);
						return next(error);
					}
					else
					{
						console.log('inserción exitosa: ', success);
						res.json({
							estatus: 1,
							respuesta: 'Usuario actualizado correctamente'
						});
					}
				});
			}
		});
	}
	catch(error)
	{
		return next(error);
	}
});

//web service para eliminar un usuario existente
router.delete('/eliminar_usuario/:id_usuario', function(req, res, next){
	try
	{
		let id_usuario = req.params.id_usuario;
		req.getConnection(function(error, database){
			if(error)
			{
				return next(error);
			}
			else
			{
				let query = `update usuarios set ? where id_usuario = ${id_usuario}`;

				let request_body = {
					estatus: 0
				};

				database.query(query, request_body, function(error, success){
					if(error)
					{
						console.log('error en query ', error);
						return next(error);
					}
					else
					{
						console.log('eliminación exitosa: ', success);
						res.json({
							estatus: 1,
							respuesta: 'Usuario eliminado correctamente'
						});
					}
				});
			}
		});
	}
	catch(error)
	{
		return next(error);
	}
});



//MUCHAS INSERCIONES:

router.post('/insertarMuchosUsuarios', function(req,res,next){
	try {
		var body = req.body;
		req.getConnection(function(error,database){
			if (error) {
				return next(error);
			}
			else{
				var query= 'INSERT INTO usuarios(nombre,apellidos,correo) values ?';
				var finalBody = body.usuarios;
				console.log(finalBody);

				var insercionfinal = [];
				for (var i = 0; i < finalBody.length; i++) {
					insercionfinal.push([
						finalBody[i]['nombre'],
						finalBody[i]['apellidos'],
						finalBody[i]['correo']
					]
				);
			}
				console.log(insercionfinal);
				//indica que es un array de objetos postman...[]
				database.query(query, [insercionfinal], function(error, success){
					if (error) {
						return next(error);
					}
					else{
						res.json({
							estatus: 1,
							respuesta: "todos los usuarios fueron insertados correctamente"
						});
					}

				});
			}
		});
	}
	catch (e) {
			return next(error);
	}
});


module.exports = router;
