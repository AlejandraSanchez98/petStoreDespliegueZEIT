//obtener todos los registos de la tabla ventas
exports.listarVentas = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT v.idVenta, v.montoSinIVA, v.IVA, v.montoConIVA,v.cantidadTotalProductos,v.pago,v.cambio, v.fechaRegistro, pro.nombreProducto,u.nombreUsuario,c.nombreCliente,mp.tipoPago FROM Ventas v INNER JOIN ventas_productos vp ON v.idVenta= vp.idVenta INNER JOIN  Productos  pro ON vp.idProducto=pro.idProducto INNER JOIN Usuarios u  ON v.idUsuario=u.idUsuario INNER JOIN Clientes c ON v.idCliente=c.idCliente INNER JOIN ventas_metodoPago vmp ON v.idVenta=vmp.idVenta INNER JOIN metodoPago mp ON vmp.idMetodoPago=mp.idMetodoPago WHERE v.estado=1 ORDER BY idVenta ASC';

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

exports.listarVentasDetalles = function (req) {
	return new Promise((resolve, reject) => {
		let idVenta = req.params.idVenta;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = `SELECT v.idVenta, v.montoSinIVA, v.IVA, v.montoConIVA,v.cantidadTotalProductos,v.pago,v.cambio, v.fechaRegistro, pro.nombreProducto,u.nombreUsuario,c.nombreCliente,mp.tipoPago FROM Ventas v INNER JOIN ventas_productos vp ON v.idVenta= vp.idVenta INNER JOIN  Productos  pro ON vp.idProducto=pro.idProducto INNER JOIN Usuarios u  ON v.idUsuario=u.idUsuario INNER JOIN Clientes c ON v.idCliente=c.idCliente INNER JOIN ventas_metodoPago vmp ON v.idVenta=vmp.idVenta INNER JOIN metodoPago mp ON vmp.idMetodoPago=mp.idMetodoPago WHERE v.idVenta='${idVenta}' AND v.estado=1 ORDER BY idVenta ASC`;

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

exports.listarVentasSinDetalles = function (req) {
	return new Promise((resolve, reject) => {
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
			}
			else {
				var query = 'SELECT v.idVenta,v.montoConIVA,v.cantidadTotalProductos,v.fechaRegistro,u.nombreUsuario,c.nombreCliente FROM Ventas v  INNER JOIN Usuarios u  ON v.idUsuario=u.idUsuario INNER JOIN Clientes c ON v.idCliente=c.idCliente WHERE v.estado=1 ORDER BY idVenta ASC';

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



//Agregar una nueva venta
exports.agregarVenta = function (req) {
	return new Promise((resolve, reject) => {

		let body = req.body;
		req.getConnection(function (error, database) {
			if (error) {
				reject({
					estatus: -1,
					respuesta: error
				});
				return;
			}
			let pago = body.pago;
			let idUsuario = body.idUsuario;
      let idCliente = body.idCliente;
			let productos = body.productos;
      let metodoPago = body.metodoPago;
      let cantidadTotalProductos = 0;
			let montoSinIVA = 0;
			let IVA = 0;
			let montoConIVA=0;
			let cambio=0;
			let arregloResultados= [];
			let arregloProductosNoExistencia=[];
			let ventaInsertada = false;
			let msjProductoInsuficiente = false; // permite recordar insertar transaccion que tuvimos productos insufientes
      let msjTransaccionCompleta = false

			let promesaOperaciones = function(){
				return new Promise((resolve,reject) => {

					for (let j = 0; j < productos.length; j++) {
						let query = `SELECT precioUnitario, stock FROM Productos WHERE idProducto = ${productos[j].idProducto}`;
						database.query(query, function (error, success) {
							if (error) {
								reject({
									estatus: -1,
									respuesta:error
								});
								return;
							}
							if(productos[j].cantidadProductos < success[0].stock){
								montoSinIVA = montoSinIVA + ((success[0].precioUnitario * productos[j].cantidadProductos))/1.16;
								cantidadTotalProductos = cantidadTotalProductos + productos[j].cantidadProductos;
							}

							if (j==productos.length -1) {
								IVA = montoSinIVA * .16;
								montoConIVA = montoSinIVA + IVA;
								cambio = pago - montoConIVA;
								resolve(
									arregloResultados=[cantidadTotalProductos, montoSinIVA, IVA, montoConIVA, cambio]
								);
							}
						});
					}
				});
			}

			promesaOperaciones().then(
				(success) => {

					for (let i = 0; i < productos.length; i++) {
						let queryS = `SELECT stock FROM Productos WHERE idProducto = ${productos[i].idProducto}`;
						database.query(queryS, function (error, stockProductos) {
							if (error) {
								reject({
									estatus: -1,
									respuesta:error
								});
							}else {
								if (productos[i].cantidadProductos < stockProductos[0].stock ) {

									if (ventaInsertada == false) {
										ventaInsertada = true;
										 msjTransaccionCompleta = true;
										console.log("el producto con id: ", productos[i].idProducto, " SI fue insertado");

										let queryIV = `INSERT INTO Ventas(montoSinIVA,IVA,montoConIVA,cantidadTotalProductos,pago,cambio,idUsuario,idCliente) values ('${montoSinIVA}','${IVA}','${montoConIVA}','${cantidadTotalProductos}','${pago}','${cambio}', '${idUsuario}','${idCliente}')`;
										database.query(queryIV, function (error, success) {
											if (error) {
												reject({
													estatus: -1,
													respuesta: error
												});
											}
											else {
												let mensaje
                        if (msjProductoInsuficiente == true) {
                            mensaje = "venta exitosa pero hay un problema, unidades insufientes -> "+ arregloProductosNoExistencia;
                        }else {
                            mensaje = "venta dada de alta correctamente"
                        }
                        resolve({
                          estatus: 1,
                          respuesta: mensaje
                        });
											}
										});
									}


									let queryVP = `INSERT INTO ventas_productos(idVenta,idProducto,cantidadProducto) VALUES (LAST_INSERT_ID() ,'${productos[i].idProducto}','${productos[i].cantidadProductos}')`;
									database.query(queryVP, function (error, success) {
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



									let queryU = `UPDATE Productos SET stock = stock - '${productos[i].cantidadProductos}' WHERE idProducto= '${productos[i].idProducto}'`;
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

									for (let j = 0; j < metodoPago.length; j++) {
										let queryVM = `INSERT INTO ventas_metodoPago(idVenta,idMetodoPago) VALUES (LAST_INSERT_ID(),'${metodoPago[j].idMetodoPago}')`;
										database.query(queryVM, function (error, success) {
											if (error) {
												reject({
													estatus: -1,
													respuesta: error
												});
											}
											else {
												resolve({
													estatus: 1,
													respuesta: 'Venta dada de alta correctamente'
												});
											}
										});
									}
								}
								else {
									msjProductoInsuficiente = true;
									arregloProductosNoExistencia[i]="El producto con id: "+productos[i].idProducto + " tiene " + stockProductos[0].stock +" unidades disponibles";

									if (i == productos.length - 1) {
										let mensaje;
										if (msjTransaccionCompleta == true) {
											resolve({
												estatus: 1,
												respuesta: "venta exitosa pero hay un problema, unidades insuficientes ->"+arregloProductosNoExistencia
											});
										}else if(msjTransaccionCompleta == false) {
											reject({
												estatus: 0,
												respuesta: "unidades insufientes ->"+ arregloProductosNoExistencia
											});
										}
									}
								}
							}
						});
					}
				},
				(error) => {
					console.log("error: ",error);
				});//fin promesa
			});
		});
	}
