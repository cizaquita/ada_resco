var api = (function(){
	
	var module = {};
	var host = "http://localhost:8000";
	
	var urls = {
		"users":        host + "users/",
		"groups":    host + "groups/",
		"posts":       host + "posts/"
	}


	function request(url,data,done){		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				//document.getElementById("demo").innerHTML = xhttp.responseText;
				console.log(xhttp.responseText);
			}
		};
		xhttp.open("GET", "http://127.0.0.1:8000/users/", true);
		xhttp.send();
	}
	function request(url,data,done){

		$.post(url, data).done(done).fail(function(data) {
			
			console.log(  url );
    		console.log( JSON.stringify( data ) );

    		if (data.statusText == "error") {
    				myApp.alert("Verifique su conexión a internet e intente de nuevo", "Error de conexión", function () {
                	navigator.app.exitApp();
            	});
    		};

  		});
	}
	/**
	 * Search for shopkeepers given coords.
	 *
	 * @param {String} lat
	 * @param {String} long
	 * @return {JSON} shopkeepers
	 */
	
	module.shopkeepers = function(lat,lon, done){
		var point = "POINT("+lon+" "+lat+")";
		request(urls.shopkeepers, {point: point} ,function(data){
			done(data);
		});
	}
	/**
	 * Get lkatitude and longitude
	 *
	 * @param {JSON} data
	 * @return {JSON} shopkeepers
	 */
	
	module.direccionTest = function(direccion){
		request("http://servidorweb2.sitimapa.com/geocoderws/geocoder.php", direccion ,function(data){
			console.log(data);
		});
	}
	
	/**
	 * Search for inventory of shopkeeper.
	 *
	 * @param {Int} shopkeeper_id
	 * @return {JSON} inventory
	 */
	
	module.inventory = function(shopkeeper_id,done){

		request(urls.inventory, {shopkeeper_id: shopkeeper_id} ,function(data){
			done(data);
			//console.log("inventory data: " + data);
		});

	}
	
	module.getRatings = function(shopkeeper_id,done){

		request(urls.get_ratings, {shopkeeper_id: shopkeeper_id} ,function(data){
			done(data);
			//console.log("inventory data: " + data);
		});

	}

	
	module.getUser = function(id,done){
		request(urls.get_user, {id: id} ,function(data){
			done(data);
		});
	}
	module.login = function(email,password,device, device_type,done){
		request(urls.login, {email: email, password:password,device:device, device_type:device_type} ,function(data){
			done(data);
		});
	}


	module.rate = function(client,shopkeeper,order,rating,comment,done){
		request(urls.rate, {client_id: client, shopkeeper_id:shopkeeper,order_id:order,rating:rating,comment:comment} ,function(data){
			done(data);
			console.log(data);
		});
	}

	module.createUser  = function(name,lastname,email,telephone,password,device,device_type,done){

		request(urls.user,
			{
				
				telephone: telephone,
				name: name,
				lastname: lastname,
				password: password,
				email: email,
				device: device,
				device_type: device_type

			} ,function(data){
				done(data);
		});

	}


	
	module.order = function(order,done){
		
		request(urls.order, {order: order} ,function(data){
			done(data);
		});

	}
	
	module.createAddress = function(address,client,done){
		address_text = address.nomenclature + " " + address.n1 + " # " + address.n2 + " - " + address.n3;
		request(urls.address, {address: address_text, client:client,address_detail: address.address_detail},

				function(data){
					done(data);
				}
		);
	}

	module.saveUserNotification = function(email,lat,lon,device,device_type,done){
		request(urls.user_notification, {email:email, lat:lat, lon:lon, device:device, device_type:device_type},
			function(data){
				done(data)
		});
	}

	return module;

})();