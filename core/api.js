(function() {
    var API_URL = 'http://127.0.0.1:1338/',
        TIMEOUT = 10,
        //cizaquita, fabianv, rataeltriforce
        admins = [7455490,97115847,15498173];

    app.api = {};

    /**
     * Get Agents from BOT API
     * @param callback {Function} Callback function
     */
    app.api.getAgents = function(callback) {
        var url = API_URL + "agents/",
        	result = "";

        request('get', url, null, function(data) {
			//console.log("data: " + JSON.stringify(data));
            if (data) {
                result = data;
                callback(result);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Create new Agent in BOT API
     * @param name, 
     * @param faction / 0 Res - 1 Enl
     * @param city,
     * @param verified, boolean
     *        verified_level
     * @param ingress_nick,
     * @param ingress_level, integer
     * @param telegram_nick,
     * @param telegram_id, integer
     * @param geo_latitude
     * @param geo_longitude
     *        trivia_points
     */
    app.api.createAgent = function(name, telegram_nick, telegram_id, callback) {
        var url = API_URL + "create_agent/",
        	params = {};

        params.name = name;
        params.telegram_nick = telegram_nick;
        params.telegram_id = telegram_id;
        console.log('\n\nTELEGRAM ID A CREAR ' + telegram_id + '\n\n');


        request('post', url, params, function(data) {
			console.log("data: " + JSON.stringify(data));
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Get Agent from BOT API
     * @param telegram_id
     * @param callback {Function} Callback function
     */
    app.api.getAgent = function(telegram_id, callback) {
        var url = API_URL + "get_agent/",
            params = {};

        params.telegram_id = telegram_id;

        console.log('\n\nTELEGRAM ID A consultar ' + telegram_id + '\n\n');

        request('post', url, params, function(data) {
            console.log("data: " + JSON.stringify(data));
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Get Agent by Nick from BOT API
     * @param telegram_id
     * @param callback {Function} Callback function
     */
    app.api.getAgentByNick = function(telegram_nick, callback) {
        var url = API_URL + "get_agent_bynick/",
            params = {};

        params.telegram_nick = telegram_nick;

        console.log('\n\nTELEGRAM @NICK A consultar ' + telegram_nick + '\n\n');

        request('post', url, params, function(data) {
            console.log("data: " + JSON.stringify(data));
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Update Agent CITY in BOT API
     * @param telegram_id
     * @param callback {Function} Callback function
     */
    app.api.updateAgentCity = function(telegram_id, agent_city, callback) {
        var url = API_URL + "update_agent_city/",
            params = {};

        params.telegram_id = telegram_id;
        params.agent_city = agent_city;

        console.log('\n\nTELEGRAM ID ' + telegram_id + ', CIUDAD' + agent_city + '\n\n');

        request('post', url, params, function(data) {
            console.log("data: " + JSON.stringify(data));
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Verificar Agente from BOT API
     * @param telegram_id
     * @param verified_for admin who verify
     * @param callback {Function} Callback function
     */
    app.api.verifyAgent = function(telegram_id, verified_for, callback) {
        var url = API_URL + "verify_agent/",
            params = {};

        params.telegram_id = telegram_id;
        params.verified_for = verified_for

        request('post', url, params, function(data) {
            console.log("data: " + JSON.stringify(data));
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Verificar Perfil de Agente from BOT API
     * @param telegram_id
     * @param callback {Function} Callback function
     */
    app.api.verifyAgentProfile = function(telegram_id, callback) {
        var url = API_URL + "verify_profile/",
            params = {};

        params.telegram_id = telegram_id;

        request('post', url, params, function(data) {
            console.log("data: " + JSON.stringify(data));
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Get Factions from BOT API
     * @param callback {Function} Callback function
     */
    app.api.getFactions = function(callback) {
        var url = API_URL + "factions/",
            result = "";

        request('get', url, null, function(data) {
            //console.log("data: " + JSON.stringify(data));
            if (data) {
                result = data;
                callback(result);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Create Faction in BOT API
     * @param name nombre de la facción
     * @param callback {Function} Callback function
     */
    app.api.createFaction = function(name, callback) {
        var url = API_URL + "factions/",
            result = "",
            params = {};

        params.name = name;


        request('post', url, params, function(data) {
            console.log("data: " + JSON.stringify(data));
            if (data) {
                result = data;
                callback(result);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Get cat-facts testing API request
     * @param callback {Function} Callback function
     */
    app.api.getCatFact = function(callback) {
        var url = "http://catfacts-api.appspot.com/api/facts?number={}",
        	result = "";

        request('get', url, null, function(data) {
            if (data) {
                console.log("data: " + JSON.stringify(data));
                result = data.facts;
                callback(result);
            } else {
                callback(null);
            }
        })
    };

    /**
     * get weather from https://api.forecast.io/forecast/55a69d9bdee001b95ce6c22ab9cbea66/
     * param latitude
     * @param longitude
     * @param callback {Function} Callback function
     */
	app.api.getWeather = function(latitude, longitude, callback){
    	var url = "https://api.forecast.io/forecast/55a69d9bdee001b95ce6c22ab9cbea66/" + latitude + "," + longitude + "?units=si&lang=es";
        var result = "";
        request('get', url, null, function(data) {
        	console.log("data: " + data)
            if (data) {
                console.log("weather: " + JSON.stringify(data));
                result = data;
                callback(result);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Request wrapper
     * @param method {String} GET or POST
     * @param url {String} Request url
     * @param data {Object} Request parameters
     * @param callback {Function} Callback function
     */
    function request(method, url, data, callback) {
        var formData, i,
            xmlhttp = new XMLHttpRequest();

        if (typeof callback !== 'function') {
            callback = undefined;
        }

        if (method.toLowerCase() === 'post') {
            formData = new FormData();

            for (i in data) {
                if (!data.hasOwnProperty(i)) {
                    continue;
                }
                if (i === 'caption') {
                    formData.append(i, data[i]);
                }else if (i === 'photo') {
                    formData.append('photo', dataURItoBlob(data[i]), 'screen.png');
                } /*else if (i === 'document') {
                    formData.append('document', dataURItoBlob(data[i]), 'screen.png');
                }*/ else {
                    formData.append(i, data[i]);
                }
            }
        } else {
        	if (data) {
            	url += '?' + serialize(data);        		
        	}
        }

        xmlhttp.onreadystatechange = function() {
            var result = null;

            if (xmlhttp.readyState !== 4) {
                return;
            }

            try {
                result = JSON.parse(xmlhttp.responseText);
            } catch (e) {
                console.error('JSON parse error: ' + e);
            }

            if (callback) {
                callback(result);
            }
        };

        xmlhttp.open(method, url, true);
        try{
            xmlhttp.send(formData);
        }catch(e){
            app.telegram.sendMessage("error formdata: " + e.description)
        }
    }

    function serialize(obj) {
        var p,
            str = [];

        for (p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }

        return str.join('&');
    }

    /**
     * Convert base64 to raw binary data held in a string
     */
    function dataURItoBlob(dataURI) {
        var mimeString, ab, ia, i,
            byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        ab = new ArrayBuffer(byteString.length);
        ia = new Uint8Array(ab);
        for (i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }
}());