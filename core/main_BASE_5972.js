/**
 * @file Primary bot file
 * @author Artem Veikus artem@veikus.com
 * @version 2.0
 */
var app = {};

(function() {
    var modules = {},
        activeModule = {},
        GOOGLE_API_KEY = "AIzaSyCwSyBbL7zoVg7viHlGxOk0FfGA1GDIaY8";
        
    // API CRISTI: AIzaSyCwSyBbL7zoVg7viHlGxOk0FfGA1GDIaY8
    // API MOODLE: AIzaSyBt9Hcwt_5fxsChvB_1yB4D1ZVCeiZlYuI
    // API UNBOSQ: AIzaSyAZaGRaR7AhX7gNHt4MYosy6Etw20XEcCY
    // API MIRIAM: AIzaSyAoj5K_T-EKau9bQDcQNhLNwXmgkfYc6FQ

    window.onload = init;

    /**
     * Modules initialization
     */
    function init() {
        Object.keys(app.modules).forEach(function(name) {
            var module = app.modules[name],
                magicWord = module.initMessage;

            if (magicWord) {
                modules[magicWord] = module;
            }
        });

        getUpdates();
    }

    /**
     * Receive updates from telegram
     */
    function getUpdates() {
        app.telegram.getUpdates(function(update) {
            if (update) {
                update.forEach(function(obj) {
                    if (obj != null) {
                        console.log("getUpdate* log: \n" + JSON.stringify(update));
                        var message = obj.message;
                        var inlineQuery = obj.inline_query;
                        var callbackQuery = obj.callback_query;
                        if (message) {
                            processMessage(message);                            
                        }else if(inlineQuery){
                            processInlineQuery(inlineQuery);
                        }else if(callbackQuery){
                            processCallbackQuery(callbackQuery);
                        }
                    }else{
                        app.telegram.sendMessage(7455490, 'Mensaje nulo de: ' + mess, null);
                    }
                });

                getUpdates();
            } else {
                setTimeout(getUpdates, 5000);
            }
        });
    }

    /**
     * Process single message
     * @param message {object} Message from getUpdates
     */
    function processMessage(message) {
        //console.log("MENSAJE ANTES: "+ JSON.stringify(message));
        var lang, 
            chat = message.chat.id,
            textEx = message.text,
            text = "";
            if (textEx) {
                text = textEx.toLowerCase();
            };
        var audio = message.audio
            documentEx = message.document,
            photo = message.photo,
            sticker = message.sticker,
            video = message.video,
            voice = message.voice,
            locationEx = message.location,
            contact = message.contact,
            //TODO logg everything
            //Testing variables
            username = message.from.username,
            name = message.from.first_name,
            //Para darle reply_to_message_id
            message_id = message.message_id,
            message_reply = message.reply_to_message;

        /*console.log('@' + username + ': ' + chat + ' --> ' + text +
                                          '\nOr Audio id: ' + JSON.stringify(audio) +
                                          '\nOr Documento id:' + JSON.stringify(documentEx) +
                                          '\nOr foto id:' + JSON.stringify(photo) +
                                          '\nOr sticker id:' + JSON.stringify(sticker) +
                                          '\nOr video id:' + JSON.stringify(video) +
                                          '\nOr voz id:' + JSON.stringify(voice) +
                                          '\nOr location id:' + JSON.stringify(locationEx) +
                                          '\nOr contacto id:' + JSON.stringify(contact)
                                          ); 
        app.telegram.sendMessage(7455490, '@' + username + ': ' + chat + ' --> ' + text +
                                          '\nOr Audio id: ' + audio +
                                          '\nOr Documento id:' + documentEx +
                                          '\nOr foto id:' + photo +
                                          '\nOr sticker id:' + sticker +
                                          '\nOr video id:' + video +
                                          '\nOr voz id:' + voice +
                                          '\nOr location id:' + locationEx
                                          ); */
        // Hack for a new users
        if (text === '/start' || text === '/start@ada_resco_bot') {
            //app.telegram.sendMessage(chat, 'Use /help', null);
            //text = '/language';
            app.settings.lang(chat, "es");
            app.telegram.sendMessage(chat, "Hola!" + 
            "\nGracias por suscribirte al bot de la Resistencia Colombia" +
            "\nEspera prontas actualizaciones." + 
            "\n\nRecuerda visitar https://LaResistencia.co para más información :)", null);
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/iitc@ada_resco_bot') {
            text = '/iitc';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/screenshot@ada_resco_bot') {
            text = '/screenshot';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/help@ada_resco_bot') {
            text = '/help';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        /*if (text === '/language@ada_resco_bot') {
            text = '/language';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/compression@ada_resco_bot') {
            text = '/compression';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/interval@ada_resco_bot') {
            text = '/interval';
        }*/
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/cancel@ada_resco_bot') {
            text = '/cancel';
        }
////////////////////////////////////// COMMANDS /////////////////////////////////////////////////////
        // If user asked for another module
        if (modules[text]) {
            activeModule[chat] = new modules[text](message);
        }

        // If user asked to cancel current action - just remove a module
        else if (text === '/cancel') {
            delete activeModule[chat];

            lang = app.settings.lang(chat);
            app.telegram.sendMessage(chat, app.i18n(lang, 'main', 'cancelled'), null);
        }

        // If user asked to INTERVAL command, will be off this shit
        //Disable command, possible bug and exploitation
        //Looks like this slow the Tasks
        //@cizaquita
        //The result of this command will be a /cancel command
        //For future testing the command will be /intervalEx (case sensitive)
        else if (text === '/interval') {
            delete activeModule[chat];            
            app.telegram.sendMessage(chat, 'Sorry, /interval command disabled.', null);
        }

        // BANEAR USUARIOS
        /*else if(text == "/ban"){
            if (message_reply) {
                app.telegram.kickChatMember(chat,message_reply.from.id);
            }else{
                app.telegram.sendMessage(chat, "Responda al mensaje de quien quiera banear.",null, message_id);
            }
        }¨*/

        // TEST CODE, commands no necessary need to be with '/' slash ^^
        //Tested and working
        //@cizaquita
        /*else if (text === '/cizaquita' || text === '@cizaquita' || text === 'cizaquita') {
            app.telegram.sendMessage(chat, '@CIzaquita dice: hola, qué pasa?');
            text = '/screenshot';
        }*/

        ////////////////////////////////////////////////////////////////////////////////////////////        
        /////////////////////////////////  TODO ZONAS   ////////////////////////////////////////////
        /////////////////////////////////  @Cizaquita   ////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////
        // TEXTO AYUDA DE ZONAS
        else if (text === '/zonas' || text === '/zonas@ada_resco_bot') {
            app.telegram.sendMessage(chat, '\tSistema de Zonas ResBog /bogota\n\n🌎- /avchile\n🌎- /centro\n🌎- /chapi\n🌎- /melgarnorte\n🌎- /nogal\n🌎- /norte\n🌎- /ouest\n🌎- /suba\n🌎- /sudouest\n🌎- /usaquen\n\n⚡️ Más info -> @CIzaquita ⚡️',null);
        }

        // Chapinero, done
        else if (text === '/chapi' || text === '/chapi@ada_resco_bot') {
            message.location = {latitude:4.6278, longitude:-74.089479 };//4.6278,-74.089479&z=14
            activeModule[chat] = new app.modules.screenshot(message, 14);
        }

        // Norte, done
        else if (text === '/norte' || text === '/norte@ada_resco_bot') {
            message.location = {latitude:4.71929, longitude:-74.05145 };//
            activeModule[chat] = new app.modules.screenshot(message, 14);
        }
        // Suba, done
        else if (text === '/suba' || text === '/suba@ada_resco_bot') { //https://www.ingress.com/intel?ll=4.743284,-74.098148&z=14
            message.location = {latitude:4.743284, longitude:-74.098148 };
            activeModule[chat] = new app.modules.screenshot(message, 14);
        }
        // Sudouest, done
        else if (text === '/sudouest' || text === '/sudouest@ada_resco_bot') { //https://www.ingress.com/intel?ll=4.662576,-74.176598&z=13
            message.location = {latitude:4.662576, longitude:-74.176598 };
            activeModule[chat] = new app.modules.screenshot(message, 13);
        }
        // Centro, done
        else if (text === '/centro' || text === '/centro@ada_resco_bot') { //https://www.ingress.com/intel?ll=4.595889,-74.079781&z=14
            message.location = {latitude:4.595889, longitude:-74.079781 };
            activeModule[chat] = new app.modules.screenshot(message, 14);
        }
        // usaquen, done
        else if (text === '/usaquen' || text === '/usaquen@ada_resco_bot') { //4.691811,-74.034934&z=15
            message.location = {latitude:4.691811, longitude:-74.034934 };
            activeModule[chat] = new app.modules.screenshot(message, 15);
        }
        // Ouest, done
        else if (text === '/ouest' || text === '/ouest@ada_resco_bot') { //4.69149,-74.116344&z=13
            message.location = {latitude:4.69149, longitude:-74.116344 };
            activeModule[chat] = new app.modules.screenshot(message, 13);
        }
        // Nogal, done
        else if (text === '/nogal' || text === '/nogal@ada_resco_bot') { //4.673675,-74.052529&z=15
            message.location = {latitude:4.673675, longitude:-74.052529 };
            activeModule[chat] = new app.modules.screenshot(message, 15);
        }
        // AvChile, done
        else if (text === '/avchile' || text === '/avchile@ada_resco_bot') { //4.657978,-74.062185&z=15
            message.location = {latitude:4.657978, longitude:-74.062185 };
            activeModule[chat] = new app.modules.screenshot(message, 15);
        }
        // melgarnorte, done
        else if (text === '/melgarnorte' || text === '/melgarnorte@ada_resco_bot') { //4.575484,-74.14175&z=13
            message.location = {latitude:4.575484, longitude:-74.14175 };
            activeModule[chat] = new app.modules.screenshot(message, 13);
        }

        // Bogota, done
        else if (text === '/bogota' || text === '/bogota@ada_resco_bot') { //https://www.ingress.com/intel?ll=4.642643,-74.11274&z=12
            message.location = {latitude:4.642643, longitude:-74.11274 };
            activeModule[chat] = new app.modules.screenshot(message, 12);
        }

        //////////////////////////// EXTRAS (//////////////////////////////)
        // /Dupor, done
        else if (text === '/dupor' || text === '/dupor@ada_resco_bot' ||
                 text === '/duporlandia' || text === '/Duporlandia') { //https://www.ingress.com/intel?ll=4.725225429813542,-74.04830775797564
            message.location = {latitude:4.725225429813542, longitude:-74.04830775797564 };
            activeModule[chat] = new app.modules.screenshot(message, 17);
        }

        // NorteEx, done
        else if (text === '/norteEx' || text === '/nortEx@ada_resco_bot') {
            message.location = {latitude:4.75064, longitude:-74.042873 };//4.75064,-74.042873&z=14 - 1
            activeModule[chat] = new app.modules.screenshot(message, 14);//
            message.location = {latitude:4.713517, longitude:-74.051199 };//4.713517,-74.051199&z=14 - 2
            activeModule[chat] = new app.modules.screenshot(message, 14);//
        }

        // Chapitony, done
        else if (text === '/chapitoni' || text === '/chapitoni@ada_resco_bot') {
            message.location = {latitude:4.635478, longitude:-74.068837 };//4.635478,-74.068837&z=15
            activeModule[chat] = new app.modules.screenshot(message, 15);
        }
        // /Dupor, done
        else if (text === '/hacienda' || text === '/hacienda@ada_resco_bot') { //https://www.ingress.com/intel?ll=4.691623,-74.033604
            message.location = {latitude:4.691623, longitude:-74.033604 };
            activeModule[chat] = new app.modules.screenshot(message, 17);
        }

        // If user has another active module
        else if (activeModule[chat]) {
            activeModule[chat].onMessage(message);
        }

        // In other case check is it location UBICACION ADJUNTA
        /*else if (message.location && app.modules.screenshot) {
            activeModule[chat] = new app.modules.screenshot(message);
        }*/

        // Mensaje de bienvenida para nuevos usuarios en un grupo donde esta el bot
        else if (message.new_chat_participant) {            
            lang = app.settings.lang(chat);

            var newUser = message.new_chat_participant;
            var hola = app.i18n(lang, 'main', 'welcome_chat_1');
            var bienvenido = app.i18n(lang, 'main', 'welcome_chat_2');
            //REPLY MARKUP
            var inline_button_web = {}, inline_button_tutos = {}, inline_keyboard, inline_markup;
            inline_button_web.text = "LaResistencia"
            inline_button_web.url = "http://laresistencia.co";
            inline_button_tutos.text = "Tutoriales"
            inline_button_tutos.url = "http://rescol.co/tutos";
            //
            inline_keyboard = [[inline_button_web,inline_button_tutos]];
            inline_markup = {
                inline_keyboard: inline_keyboard
            };

            if (chat == -1001061150661 || chat == -1001069963507 || chat == -1001054945393) {
                var mensaje = "";
                if (newUser.username) {
                    mensaje = hola + " @" + newUser.username;
                }else{
                      mensaje = hola + " " + newUser.first_name
                }
                app.telegram.sendMessage(chat, mensaje + ' soy ADA!, ' + bienvenido + " " + message.chat.title + "\n\nCuéntanos en qué lugar del país juegas para ponerte en contacto con el agente de la zona o ciudad." +
                        "\n\nRecuerda visitar los tutoriales en <a href='http://rescol.co/tutos'>http://rescol.co/tutos</a> para que juntos liberemos el mundo de la influencia de los shapers." + 
                        "\n\n<a href='http://laresistencia.co'>LaResistencia.co</a>\n<a href='http://telegram.me/rescol'>@rescol</a>", inline_markup, message_id);
                if (!newUser.username) {
                    //Enviamos el GIF de Dino
                    app.telegram.sendDocument(chat, "BQADAQADIBoAAsI9uwABXiK5HcGnKjwC", newUser.first_name + ", por favor configura tu @alias como se muestra en el GIF.", message_id)
                };
            }else{
                if (newUser.username) {
                    app.telegram.sendMessage(chat, "<b>" + hola + " @" + newUser.username + '!</b>, ' + bienvenido + " " + message.chat.title, null);
                }else{
                    app.telegram.sendMessage(chat, "<b>" + hola + " " + newUser.first_name + '!</b>, ' + bienvenido + " " + message.chat.title, null);                
                }                
            }
        }

        // Mensaje de bienvenida para nuevos usuarios en un grupo donde esta el bot
        else if (message.left_chat_participant) {            
            lang = app.settings.lang(chat);
            var oldUser = message.left_chat_participant;
            var adios = app.i18n(lang, 'main', 'bye_chat');

            if (oldUser.username) {
                app.telegram.sendMessage(chat, "<b>" + adios + " @" + oldUser.username + '!</b>, ', null);
            }else{
                app.telegram.sendMessage(chat, "<b>" + adios + " " + oldUser.first_name + '!</b>, ', null);                
            }
        }


        else if (text == '/test') {
            message.location = {latitude:4.691623, longitude:-74.033604 };
            activeModule[chat] = new app.modules.screenshot(message, 17, 1);
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////NEW COMMANDS WITH PARAMETERS/////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        else if(text){
            /*if (text.indexOf("/hola ") > -1) {
                //Slice descarta el comando inicial para tomar los parámetros
                var echoText = text.slice(6);
                var cantidad = echoText.length;
                //Verificamos que el parametro tenga alguna longitud
                if (cantidad > 2) {
                    app.telegram.sendMessage(chat, 'Txto: ' + echoText + ", length: " + cantidad, null);
                }else{                
                    app.telegram.sendMessage(chat, 'Debe escribir al menos 3 caracteres despues del comando...',null);
                }
            }

            else if (text.indexOf("/negra") > -1) {
                var echoText = text.slice(6);
                var cantidad = echoText.length;
                if (cantidad > 2) {
                    app.telegram.sendMessage(chat, '<b>' + echoText + '</b>', null);
                }else{                
                    app.telegram.sendMessage(chat, 'Debe escribir al menos 3 caracteres despues del comando...',null);
                }
            }

            else if (text.indexOf("/code") > -1) {
                var echoText = text.slice(5);
                var cantidad = echoText.length;
                if (cantidad > 2) {
                    app.telegram.sendMessage(chat, '<code>' + echoText + '</code>', null);
                }else{                
                    app.telegram.sendMessage(chat, 'Debe escribir al menos 3 caracteres despues del comando...',null);
                }
            }

            else if (text.indexOf("/pre") > -1) {
                var echoText = text.slice(4);
                var cantidad = echoText.length;
                if (cantidad > 2) {
                    app.telegram.sendMessage(chat, '<pre>' + echoText + '</pre>', null);
                }else{                
                    app.telegram.sendMessage(chat, 'Debe escribir al menos 3 caracteres despues del comando...',null);
                }
            }

            else if (text.indexOf("/multi") > -1) {
                var echoText = text.slice(6);
                console.log("echotext: " + echoText);

                var textEx = echoText.split(" ");
                console.log("textEx: " + textEx);
                var cantidad = echoText.length;
                if (cantidad > 2) {
                    console.log('<b>' + textEx[1] + '</b> ' + '<i>' + textEx[2] + '</i>');
                    app.telegram.sendMessage(chat, '<b>' + textEx[1] + '</b> ' + '<i>' + textEx[2] + '</i>', null);
                }else{                
                    app.telegram.sendMessage(chat, 'Debe escribir al menos 3 caracteres despues del comando...',null);
                }
            }

            else if (text.indexOf("/link") > -1) {
                var echoText = text.slice(5);
                var textEx = echoText.split(" ");
                var cantidad = echoText.length;
                if (cantidad > 2) {
                    console.log('<a href=' + textEx[1] + '>' + textEx[2] + '</a>');
                    app.telegram.sendMessage(chat, '<a href="' + textEx[1] + '">' + textEx[2] + '</a>', null);
                }else{                
                    app.telegram.sendMessage(chat, 'Debe escribir al menos 3 caracteres despues del comando...',null);
                }
            }

            else if (text.indexOf("/latlon") > -1) {
                var echoText = text.slice(7);
                //El split es para tomar los parámetros separados por " " (Espacio)
                var textEx = echoText.split(" ");
                var cantidad = echoText.length;
                if (cantidad && textEx[1] && textEx[2]) {
                    if (cantidad > 2) {
                        if (textEx[1].length > 3 && textEx[2].length > 3) {
                            console.log("/latlon LOG: \nlat:" + textEx[1] +
                                        "\nLon:" + textEx[2] +
                                        "\nZoom:" + textEx[3]);
                            message.location = {latitude:textEx[1], longitude:textEx[2] };
                            if (textEx[3].length && textEx[3].length > 0) {
                                activeModule[chat] = new app.modules.screenshot(message, textEx[3]);
                            }else{
                                activeModule[chat] = new app.modules.screenshot(message, 14);
                            }
                        }
                    }else{
                        app.telegram.sendMessage(chat, '/latlon [latitude] [longitude] [zoom] \n- Default zoom 14',null);
                    }
                }else{                
                    app.telegram.sendMessage(chat, '/latlon [latitude] [longitude] [zoom] \n- Default zoom 14',null);
                }
            }
            else if (text.indexOf("/place") > -1) {
                app.telegram.sendMessage(chat, "/place [place name]", null);  
                if (text.indexOf("/place ") > -1) {
                    var echoText = text.slice(7);
                    var cantidad = echoText.length;
                    var lat, lon;
                    if (cantidad > 2) {
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + echoText + '&key=AIzaSyDm9cM0rKxtdzBZrEj97tbJvSuQsqLGq_4', true);
                        xmlhttp.onreadystatechange = function() {
                            if (xmlhttp.readyState == 4) {
                                if(xmlhttp.status == 200) {
                                    var obj = JSON.parse(xmlhttp.responseText);
                                    if (obj.status == "OK") {
                                        lat = obj["results"][0]["geometry"]["location"]["lat"];
                                        lon = obj["results"][0]["geometry"]["location"]["lng"];
                                        message.location = {latitude:lat, longitude:lon};
                                        //app.telegram.sendMessage(chat, message, null);                                        
                                        activeModule[chat] = new app.modules.screenshot(message);
                                    }else{
                                        app.telegram.sendMessage(chat, app.i18n(lang, 'place', 'not_found'), null);                            
                                    }
                                }
                            }
                        };
                        xmlhttp.send(null);
                        //app.telegram.sendMessage(chat, '<b>' + echoText + '</b>', null);
                    }else{                
                        app.telegram.sendMessage(chat, 'Debe escribir al menos 3 caracteres despues del comando...',null);
                    }
                };
            }*/
            //////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////BOT SEMÁNTICO/////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////


            if (text.includes("ada ") && text.length > 5) {
            // LA HORA
                if ( text.indexOf("hora") > -1 && words(text) < 5){
                    function addZero(i) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;
                    }
                    var d = new Date();
                    var h = addZero(d.getHours());
                    var m = addZero(d.getMinutes());
                    var s = addZero(d.getSeconds());
                    if (username) {
                        app.telegram.sendMessage(chat, 'Hola @' + username + ', soy ADA y son las ' + h + ":" + m + ":" + s + ' en Colombia GMT-5', null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Hola ' + name + ', soy ADA y son las ' + h + ":" + m + ":" + s + ' en Colombia GMT-5', null, message_id);
                    }                   
                }
            // SALUDAR 
                else if (text.indexOf("saludar") > -1 || text.indexOf("saluda") > -1 && words(text) < 4) {
                    if (chat < 0) {
                        app.telegram.sendMessage(chat, "Hola!, un saludo para todos en " + message.chat.title + "! :*", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "Hola! soy ADA y te envio un gran saludo @" + username + "! :*", null, message_id);
                    }
                }
            // HOLA ADA
                else if(text.indexOf("hola") > -1 && words(text) < 4){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", cómo estás?", null, message_id);
                }
                else if(text.indexOf("nick") > -1 || text.indexOf("@alias") > -1){
                    app.telegram.sendDocument(chat, "BQADAQADIBoAAsI9uwABXiK5HcGnKjwC", "Tutorial para configurar tu @alias.", message_id)                    
                }
		// Este
                else if(text.indexOf("este") > -1 && words(text) < 4){
                    app.telegram.sendMessage(chat, "Oye @" + username + ", no seas irrespetuoso, no quiero que seas como los iluminados.", null, message_id);
                }
                else if(text.indexOf("nick") > -1 || text.indexOf("@alias") > -1){
                    app.telegram.sendDocument(chat, "BQADAQADIBoAAsI9uwABXiK5HcGnKjwC", "Tutorial para configurar tu @alias.", message_id)                    
                }
            // FEEDBACK cuando no sabe responder
                else{
                    //app.telegram.sendMessage(chat, "No entiendo, enviaré un feedback a mi creador, gracias!", null);
                    if (message.chat.title) {
                        app.telegram.sendMessage(-1001069963507, "feedback semántico: " + text + ", de grupo: " + message.chat.title, null);  
                    }else{
                        app.telegram.sendMessage(-1001069963507, "feedback semántico: " + text + ", de: @" + username, null);                          
                    }
                }
            }
        ///////////END
        }
        // Or maybe user made a mistake (do not reply in groups)
        //Users and chat group that sends a message, it will be logged
        //Bad entry or bad command, works fine on groups
        //No one talks with the bot
        //@Cizaquita

        //Chat ID < -1 means is a group chat
        else if (chat > -1) {
            var compression = app.settings.compression(chat);
            lang = app.settings.lang(chat);
            app.telegram.sendMessage(chat, app.i18n(lang, 'main', 'unknown_command'), null);
        }
        // Cleanup complete modules
        if (activeModule[chat] && activeModule[chat].complete) {
            delete activeModule[chat];
        }
    };

    function processCallbackQuery(callbackQuery){
        app.telegram.sendMessage(7455490, 'callbackQuery: ' + JSON.stringify(callbackQuery), null);
            //app.telegram.editMessageReplyMarkup(callbackQuery.inline_message_id);
        if (callbackQuery.data == "data") {
            app.telegram.answerCallbackQuery(callbackQuery.id, "👍", false);
        }
    };

    function words(s){
        s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
        s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
        s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
        return s.split(' ').length; 
    };

    function processInlineQuery(inlineQuery){
        //app.telegram.sendMessage(7455490, 'inlineQuery: ' + JSON.stringify(inlineQuery), null);
        //INLINE_QUERY_ID AND RESULTS MUST BE THE PARAMS
        //app.telegram.answerInlineQuery(inlineQuery);
        //console.log("inlineQueryLog: " + inlineQuery);
        ///////////////////////////////////////////////////////
        var query = inlineQuery.query;
        var inline_query_id = inlineQuery.id;

        var results = [], 
            result_id = 0;


        var inline_button_califica = {}, inline_button_buscar = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Rate me 👍";
        inline_button_califica.url = "http://telegram.me/storebot?start=ada_resco_bot";
        //inline_button.callback_data = "data";
        inline_button_buscar.text = "Share & search new location";
        inline_button_buscar.switch_inline_query = "";
        //
        inline_button_callback.text = "👍";
        inline_button_callback.callback_data = "data";

        inline_keyboard = [[inline_button_buscar],[inline_button_califica,inline_button_callback]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };

        if (query.length > 2) {
            //app.telegram.answerInlineQuery(inlineQuery);
            //app.telegram.sendMessage(7455490, 'inlineQuery: ' + JSON.stringify(inlineQuery), null);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + GOOGLE_API_KEY, true);
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    //console.log("Estado de peticiòn: " + xmlhttp.status)
                    if(xmlhttp.status == 200) {
                        var obj = JSON.parse(xmlhttp.responseText);

                        console.log("obj.status: " + obj.status);
                        if (obj.status == "OK") {
                            //console.log(JSON.stringify(obj));

                            obj.results.forEach(function(val) {
                                //ID, latitude, longitude, title
                                //result: get selected data
                                    result = {};
                                result_id++;
                                result.type = "location";
                                result.id = ""+result_id+"";
                                result.latitude = val.geometry.location.lat;
                                result.longitude = val.geometry.location.lng;
                                result.title = val.name;
                                result.reply_markup = inline_markup;
                                results.push(result);
                                //console.log(val);

                                /*console.log("results data: \nid: " + result_id +"\nLatitude: " + val.geometry.location.lat +
                                            "\nLongitude: " + val.geometry.location.lng + 
                                            "\nName: " + val.name);*/
                            });

                        }else if (obj.status == "ZERO_RESULTS") {
                            if (inlineQuery.location){
                                results = [{
                                            "type":"location",
                                            "id":"1",
                                            "latitude":inlineQuery.location.latitude,
                                            "longitude":inlineQuery.location.longitude,
                                            "title":"No results. This is your location.",
                                            "reply_markup":inline_markup
                                          }];
                            }else{                                
                                results = [{
                                            "type":"location",
                                            "id":"1",
                                            "latitude":0.000,
                                            "longitude":0.000,
                                            "title":"No results. Allow your geolocation",
                                            "reply_markup":inline_markup
                                          }];
                            }
                        }else{

                            if (inlineQuery.location){
                                results = [{
                                            "type":"location",
                                            "id":"1",
                                            "latitude":inlineQuery.location.latitude,
                                            "longitude":inlineQuery.location.longitude,
                                            "title":"Something wrong. This is your location.",
                                            "reply_markup":inline_markup
                                          }];
                            }else{                                
                                results = [{
                                            "type":"location",
                                            "id":"1",
                                            "latitude":0.000,
                                            "longitude":0.000,
                                            "title":"Something wrong. Allow your geolocation",
                                            "reply_markup":inline_markup
                                          }];
                            }
                        }
                        //Send answerInlineQuery
                        app.telegram.answerInlineQuery(inline_query_id, results);

                    }else{
                        console.log("inlineQueryError: " + xmlhttp.responseText)
                    }
                }
            };
            xmlhttp.send(null);
        }else{
            console.log("inlineQueryLog: query muy corto no se realizó búsqueda");
        }
    };

}());
