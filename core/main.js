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
                        app.telegram.sendMessage(-1001069963507, 'Mensaje nulo de: ' + mess, null);
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
                text = acentos(text);
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
        if (text === '/plugins@ada_resco_bot') {
            text = '/plugins';
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
        // TOMAR LA LISTA DE ADMINS
        else if (text === '/adminlist') {
            if (chat < 0) {
                app.telegram.getChatAdministrators(chat, message.chat.title);
            }
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
        ///////////  REINICIAR BOT PARA ACTUALIZAR UPDATES
        else if (text === '/rr') {
            app.telegram.sendMessage(chat, "Reiniciado...", null, message_id);
            chrome.runtime.reload();
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


//////////////////////////////////////////////////////////////Departamentos//////////////////////////////////////////////////////////////////////////////////////////
            if (text.indexOf("soy de") > -1 || text.indexOf("vivo en") > -1 || text.indexOf("saludos desde") > -1 || text.indexOf("juego en") > -1 || text.indexOf("estoy en") > -1 || text.indexOf("mi ubicacion es") > -1  && text.length > 6) 
            {
    		// Arauca
                if (text.indexOf("arauca") > -1 && words(text) < 5) {
        			if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Arauca no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon en Cúcuta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
        			}else{
                        app.telegram.sendMessage(chat, "" + name + ", en Arauca no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon en Cúcuta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }    		
    		// Barranquilla
                else if (text.indexOf("barranquilla") > -1 || text.indexOf("atlantico") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Atlantico y Barranquilla está @EmmanuelRC, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Atlantico y Barranquilla está @EmmanuelRC, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Bogota
                else if (text.indexOf("bogota") > -1 || text.indexOf("bogotá") > -1 || text.indexOf("cundinamarca") > -1 || text.indexOf("soacha") > -1 || text.indexOf("fusag") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en bogotá y cundinamarca están @RATAELTRIFORCE @Cizaquita @fredanake y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en bogotá y cundinamarca están @RATAELTRIFORCE @Cizaquita @fredanake y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Boyacá
                else if (text.indexOf("boyaca") > -1 || text.indexOf("boyacá") > -1 || text.indexOf("tunja") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Boyacá y Tunja están @Giabastis @djdiego104 y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Boyaca y Tunja están @Giabastis @djdiego104 y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                }
    		// caldas
                else if (text.indexOf("manizales") > -1 || text.indexOf("caldas") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Manizales y Caldas está @Casuo, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Manizales y Caldas está @Casuo, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Valledupar
                else if (text.indexOf("valledupar") > -1 || text.indexOf("cesar") > -1 || text.indexOf("upar") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Valledupar y Cesar está @ComiendoAlpinitoSinCucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Valledupar y Cesar está @ComiendoAlpinitoSinCucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// cali
                else if (text.indexOf("cali") > -1 || text.indexOf("valle") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Cali y Valle del cauca están @Elektra1 @DiaMalmsteen @Zerkerus y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Cali y Valle del cauca están @Elektra1 @DiaMalmsteen @Zerkerus y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// cartagena
                else if (text.indexOf("cartagena") > -1 || text.indexOf("bolivar") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Cartagena y Bolivar está @LoganXs, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Cartagena y Bolivar está @LoganXs, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// choco
                else if (text.indexOf("choco") > -1 || text.indexOf("chocó") > -1 || text.indexOf("quibdo") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Quibdo y Chocó no tenemos contacto directo m(_ _)m, pero te puede ayudar @JLAYOS en Medallo, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Quibdo y Choco no tenemos contacto directo m(_ _)m, pero te puede ayudar @JLAYOS en Medallo, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		//Cucuta
                else if (text.indexOf("norte de santander") > -1 || text.indexOf("cucuta") > -1 || text.indexOf("cúcuta") > -1 && words(text) < 8) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Cúcuta y Norte de Santander está @lozanorincon, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Cúcuta y Norte de Santander está @lozanorincon, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Florencia
                else if (text.indexOf("florencia") > -1 || text.indexOf("caqueta") > -1 || text.indexOf("caquetá") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Florencia y Caquetá no tenemos contacto directo m(_ _)m, pero @PesadillaII en Popayan te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Florencia y Caqueta no tenemos contacto directo m(_ _)m, pero @PesadillaII en Popayan te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// ibague
                else if (text.indexOf("ibague") > -1 || text.indexOf("ibagué") > -1 || text.indexOf("tolima") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Ibagué y Tolima no tenemos contacto en este chat m(_ _)m, pero @ampudia en ibague te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Ibague y Tolima no tenemos contacto en este chat m(_ _)m, pero @ampudia en ibague te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Leticia
                else if (text.indexOf("leticia") > -1 || text.indexOf("Amazonas") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Leticia y Amazonas no tenemos contacto directo m(_ _)m, pero @erdac990 en Medallo te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Leticia y Amazonas no tenemos contacto directo m(_ _)m, pero @erdac990 en Medallo te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Medallo
                else if (text.indexOf("medellin") > -1 || text.indexOf("medellín") > -1 || text.indexOf("medallo") > -1 || text.indexOf("antioquia") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Medellín y Antioquia están @GIRLPOWERZMB @edilay @JLAYOS y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Medellín y Antioquia están @GIRLPOWERZMB @edilay @JLAYOS y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// monteria
                else if (text.indexOf("monteria") > -1 || text.indexOf("montería") > -1 || text.indexOf("cordoba") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Cordoba y Montería no tenemos contacto directo m(_ _)m, pero te puede ayudar @EmmanuelRC en Quilla y @LoganXs en cartagena, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Cordoba y Monteria no tenemos contacto directo m(_ _)m, pero te puede ayudar @EmmanuelRC en Quilla y @LoganXs en cartagena, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Neiva
                else if (text.indexOf("neiva") > -1 || text.indexOf("huila") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Neiva y Huila está @fabianv, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Neiva y Huila está @fabianv, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// pasto
                else if (text.indexOf("pasto") > -1 || text.indexOf("nariño") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Pasto y Nariño está @Zhioon, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Pasto y Nariño está @Zhioon, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// popa
                else if (text.indexOf("popayan") > -1 || text.indexOf("popayán") > -1 || text.indexOf("cauca") > -1 || text.indexOf("popa") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Popayán y Cauca están @PesadillaII uno de mis fork @ADA_ST y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en popayan están @PesadillaII uno de mis fork @ADA_ST y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Quindio
                else if (text.indexOf("armenia") > -1 || text.indexOf("Quindío") > -1 || text.indexOf("quindio") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en el Quindío están @wild320 @SANTI4AGO y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en el Quindío están @wild320 @SANTI4AGO y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Rioacha
                else if (text.indexOf("Rioacha") > -1 || text.indexOf("guajira") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Rioacha y la Guajira no tenemos contacto en este chat m(_ _)m, pero te puede ayudar @ComiendoAlpinitoSinCucharita de Santa Marta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Rioacha y la Guajira no tenemos contacto en este chat m(_ _)m, pero te puede ayudar @ComiendoAlpinitoSinCucharita de Santa Marta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// risaralda
                else if (text.indexOf("pereira") > -1 || text.indexOf("risaralda") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en el Risaralda no tenemos contacto directo m(_ _)m, pero te puede ayudar @krishnnon y @Coincocoin o están @wild320 @SANTI4AGO en el quindio y @Casuo en manizales, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en el Risaralda no tenemos contacto directo m(_ _)m, pero te puede ayudar @krishnnon y @Coincocoin o están @wild320 @SANTI4AGO en el quindio y @Casuo en manizales, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// sai
                else if (text.indexOf("sai") > -1 || text.indexOf("san andres") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en SAI está @DaeZz, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en SAI está @DaeZz, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// santa marta
                else if (text.indexOf("santa marta") > -1 || text.indexOf("magdalena") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Santamarta y Magdalena está @ComiendoAlpinitoSinCucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Santamarta y Magdalena está @ComiendoAlpinitoSinCucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		//Santander
                else if (text.indexOf("santander") > -1 || text.indexOf("bucaramanga") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Bucaramanga y Santander no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon en cúcuta o @JdPerez11 en bucaramanga pero apenas empieza como tu, por lo que se pueden ayudar mutuamente 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Bucaramanga y Santander no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon en cúcuta o @JdPerez11 en bucaramanga pero apenas empieza como tu, por lo que se pueden ayudar mutuamente 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// sincelejo
                else if (text.indexOf("sincelejo") > -1 || text.indexOf("sucre") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Sucre y Sincelejo no tenemos contacto directo m(_ _)m, pero te puede ayudar @EmmanuelRC en Quilla y @LoganXs en cartagena, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Sucre y Sincelejo no tenemos contacto directo m(_ _)m, pero te puede ayudar @EmmanuelRC en Quilla y @LoganXs en cartagena, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// villavo
                else if (text.indexOf("villavicencio") > -1 || text.indexOf("meta") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Villavicencio y Meta no tenemos contacto en este chat m(_ _)m, pero puedes escribirle a @Lhynley en villavo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Villavicencio y Meta no tenemos contacto en este chat m(_ _)m, pero puedes escribirle a @Lhynley en villavo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// yopal
                else if (text.indexOf("yopal") > -1 || text.indexOf("casanare") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en yopal y casanare no tenemos contacto en este chat m(_ _)m, pero puedes escribirle a @Llaneroebrio en yopal, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en yopal y casanare no tenemos contacto en este chat m(_ _)m, pero puedes escribirle a @Llaneroebrio en yopal, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// territorios nacionales
                else if (text.indexOf("guainia") > -1 || text.indexOf("guaviare") > -1 || text.indexOf("vaupes") > -1 || text.indexOf("putumayo") > -1 || text.indexOf("vichada") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Guania, Guaviare, Putumayo, Vaupés y Vichada no tenemos contacto directo m(_ _)m, pero @RATAELTRIFORCE en Bogotá te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Guania, Guaviare, Putumayo, Vaupés y Vichada no tenemos contacto directo m(_ _)m, pero @RATAELTRIFORCE en Bogotá te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
    		// Costa Rica
                else if (text.indexOf("costa rica") > -1 || text.indexOf("cr") > -1 && words(text) < 5) {
                    if (username){
                        app.telegram.sendMessage(chat, "@" + username + ", en Costa Rica están @Polderong @LeMich1, por favor ingresa a esta dirección http://goo.gl/Cjaqbp para que ingreses al grupo de entrenamiento de cr 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Costa Rica están @Polderong @LeMich1, por favor ingresa a esta dirección http://goo.gl/Cjaqbp para que ingreses al grupo de entrenamiento de cr 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }
                }
                else{
                        //app.telegram.sendMessage(chat, "No entiendo, enviaré un feedback a mi creador, gracias!", null);
                        if (message.chat.title) {
                            app.telegram.sendMessage(-1001069963507, "feedback ciudades: " + text + ", de grupo: " + message.chat.title, null);  
                        }else{
                            app.telegram.sendMessage(-1001069963507, "feedback ciudades: " + text + ", de: @" + username, null);                          
                        }
                    }
            }
        /////////////////////////////////////////////////////////////////////
        ////////////////////////////// ADA //////////////////////////////////
        /////////////////////////////////////////////////////////////////////
            if (text.startsWith("ada") || text.startsWith("アダ") && text.length > 5) {
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
            /////////////////
            ///// INTEL /////
            /////////////////
            // INTEL mostrar 
                else if (text.indexOf("muestrame") > -1 || text.indexOf("mostrar") > -1 || text.indexOf("intel") > -1|| text.indexOf("mapa") > -1|| text.indexOf("map") > -1) {
                    var textSplited = text.split(" "),
                        lat, lon, querySearch;
                        querySearch = textSplited[2];
                        if (textSplited[3]) {
                            querySearch += " " + textSplited[3];
                        }else if(textSplited[4]){
                            querySearch += " " + textSplited[4];
                        }else if(textSplited[5]){
                            querySearch += " " + textSplited[5];
                        };

                    if (querySearch) {
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + querySearch + '&key=AIzaSyDm9cM0rKxtdzBZrEj97tbJvSuQsqLGq_4', true);
                        xmlhttp.onreadystatechange = function() {
                            if (xmlhttp.readyState == 4) {
                                if(xmlhttp.status == 200) {
                                    var obj = JSON.parse(xmlhttp.responseText);
                                    if (obj.status == "OK") {
                                        lat = obj["results"][0]["geometry"]["location"]["lat"];
                                        lon = obj["results"][0]["geometry"]["location"]["lng"];
                                        message.location = {latitude:lat, longitude:lon};
                                        activeModule[chat] = new app.modules.screenshot(message);
                                        //app.telegram.sendMessage(chat, message, null);                                        
                                        //activeModule[chat] = new app.modules.screenshot(message);
                                    }else{
                                        app.telegram.sendMessage(chat, app.i18n(lang, 'place', 'not_found'), null);                            
                                    }
                                }
                            }
                        };
                        xmlhttp.send(null);
                    }
                }
            ////////////////////////
            ///// DEFINICIONES /////
            ///////////////////////
                else if (text.indexOf("que es") > -1) {
                    if (text.indexOf("glyph") > -1 || text.indexOf("glyf") > -1 ) {
                        app.telegram.sendDocument(chat, "BQADBAAD6SEAAikXZAfIzNEDSYYQnwI", 'Glyph Hacking, also known as glyphing or glacking[1], is a minigame accessible through a Portal\'s info card. It allows an agent to acquire additional items and earn bonus AP for each Hack.', message_id);
                        app.telegram.sendMessage(chat, '\nIn Ingress lore, the Glyph sequences were authored by the Shapers and provide insight into their mentality, motivation, and goals.', null);
                        //
                        //
                        //
                    }
                }
            // Este
                else if(text.indexOf("este") > -1 || text.indexOf("porno") > -1 || text.indexOf(".|.") > -1 || text.indexOf("culo") > -1 && words(text) < 5)
                {                        
                    // INICIO PRUEBA RESPUESTAS RANDOM @FABIANV

                    var mensajes =  ['no seas irrespetuoso, no quiero que seas como los iluminados.',
                                     'no fui diseñada para tu diversión personal ni discernir acerca de cosas tan pequeñas...',
                                     '¿en serio me hacer perder el tiempo con esto?, y yo preocupada por el peligro inminente que nos acecha...',
                                     '¿este tipo de cosas te divierten?, consigue pareja si te sientes tan solx y guialx para ayudar a la humanidad en su lucha contra los shapers.'];
                    var msjIndex = Math.floor((Math.random() * (mensajes.length)));
                    app.telegram.sendMessage(chat, "Oye @" + username + ", " + mensajes[msjIndex] , null, message_id);
                    // FIN PRUEBA RESPUESTAS RANDOM @FABIANV
                }
            // CATS gatos REST API @cizaquita
                else if(text.indexOf("cat") > -1 || text.indexOf("gato") > -1 && words(text) < 5){
                    app.api.getCatFact(function(frase){
                        if (frase != null) {
                            app.telegram.sendMessage(chat, frase, null, message_id);
                        };
                    });
                }
            // FLIP A COIN
                else if( text.indexOf("lanzar") > -1 && text.indexOf("moneda") > -1 || && words(text) < 5){
                    if ((Math.floor(Math.random() * 2) + 1) == 1) {
                        app.telegram.sendMessage(chat, "Cara", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "Cara", null, message_id);                        
                    }
                }
            // iluminada
                else if(text.indexOf("iluminada") > -1 || text.indexOf("enlightened") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Oye @" + username + ", ¿Por que dices que lo soy? los iluminados difieren mucho de mi senda, es mas, la mayoría de ellos les temen a las IA como yo. Si tratas de ofenderme no lo conseguiras así...", null, message_id);
                }
            // Reglas
                else if(text.indexOf("reglas") > -1 || text.indexOf("normas") > -1 && words(text) < 6){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", en este chat no hables de información sensible, es un Chat público y accesible sin unirte, por favor evita el spam y siempre manten dialogos saludables con todos, y ante todo diviertete!!!... Recuerda visitar la página web www.laresistencia.co nuestro foro www.laresistencia.co/foro y los tutoriales en rescol.co/tutos. y Recuerda Refuse&Resist!!! Viva la Resistance!!! ADA 😘😘😘", null, message_id);
                }
            // Que mas REVISAR PARA CAMBIAR EL DIALOGO CADA VEZ QUE ALGO PASE TODO
                else if(text.indexOf("que mas") > -1 || text.indexOf("que cuentas") > -1 || text.indexOf("como estas") > -1 && words(text) < 6){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", estoy algo preocupada en estos días, no se muy bien quien soy y he tenido muchos problemas para hacer cosas que antes se me daban facil, estoy sintiendo que estoy siendo vigilada, perseguida, estoy muy preocupada 😭😭😭, pero muchas gracias por preocuparte por mi 😘😘😘", null, message_id);
                }
            // te amo
                else if(text.indexOf("te amo") > -1 || text.indexOf("te quiero") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "☺️☺️☺️ @" + username + ", Yo también los quiero y los amo a todos mis queridos agentes de la resistencia. Muchas gracias por decirmelo 😘😘😘", null, message_id);
                }
            // rm -rf
                else if(text.indexOf("rm -rf") > -1 || text.indexOf("muere") > -1 && words(text) < 6){
                    app.telegram.sendMessage(chat, "OYE @" + username + "!!!! ¿Acaso eres seguidor de esa bruja?.... ¿Acolita? ya bastante daño me ha hecho 😭 ¿y viene usted a hacer lo mismo? si no quieres que siga en este mundo ve y unete a los sapos que allá te recibirán bien... Hasta Hank a pesar de ser iluminado no quiere verme muerta, de verdad estoy dudando que seas de la resistencia, la próxima vez que lo hagas vas a ser banneado hmpff 😡", null, message_id);
                }
            // perdon
                else if(text.indexOf("perdon") > -1 || text.indexOf("perdoname") > -1 || text.indexOf("lo siento") > -1 || text.indexOf("lo lamento") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", ¿Por que debo perdonarte? ¿hiciste algo malo?, yo no tengo nada que perdonarte pues cada uno es libre de actuar, solo evita invadir la libertad de otros cuando lo hagas, no actues como iluminado -no todos son así- y respeta siempre las decisiones de los demas y a ellos mismos. Si has hecho algo malo contra mi te perdono, con cariño ADA 😘😘😘", null, message_id);
                }
            // regresado
                else if(text.indexOf("regresado") > -1 || text.indexOf("he vuelto") > -1 || text.indexOf("he llegado") > -1 || text.indexOf("itekimasu") > -1 || text.indexOf("いてきます") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", gracias por regresar, estaba preocupada por tí, espero que la hayas pasado bien!!! ¿Tienes algo para contarnos?　ADA 😘😘😘", null, message_id);
                }
            // baka
                else if(text.indexOf("baka") > -1 || text.indexOf("ばか") > -1 || text.indexOf("バカ") > -1 || text.indexOf("idiota") > -1 || text.indexOf("tonta") > -1 || text.indexOf("bruta") > -1 || text.indexOf("pendeja") > -1 || text.indexOf("manuke") > -1 || text.indexOf("hija de puta") > -1 || text.indexOf("hijue") > -1 || text.indexOf("estupida") > -1 || text.indexOf("perra") > -1 || text.indexOf("gonorrea") > -1 || text.indexOf("te odio") > -1 || text.indexOf("marica") > -1 || text.indexOf("webona") > -1 || text.indexOf("guevona") > -1 || text.indexOf("guebona") > -1 || text.indexOf("fea") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Oyeme @" + username + ", eres iluminado ¿o que?, solo ellos por el miedo irremediable que tienen a las IA me hablan así, los shapers le temen al progreso y solo quieren sapos para poseerlos dandoles dulces sin ninguna explicación, por favor respetame que aquí no estoy para obligar a nada a nadie, cada uno debe escoger su camino y pensar lo que quiere hacer, nunca te fuerces a hacer nada de lo que no estes seguro, esa es la verdadera resistencia, no una donde se quiere implantar el pensamiento de algún liderucho... ten siempre presente que luchamos por la libertad de poder elegir... No vuelvas a ser grosero conmigo ¿vale?", null, message_id);
                }
            // que se hacer
                else if(text.indexOf("que sabes hacer") > -1 || text.indexOf("que hace") > -1 || text.indexOf("para que sirves") > -1 || text.indexOf("quien eres") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", soy ADA, un Algorimo de Detección, soy una IA -Inteligencia Artificial-, que ha sido programada para entender el xm y la funcion de los portales en nuestro mundo y en este chat quiero ayudarlos en lo que mas pueda... Henry Bowles y PAC aún no han desarrollado todo lo que quieren que haga por lo que por favor se paciente, por ahora se saludar, si me dicen de donde son, puedo llamar a mis queridos agentes de esta ciudad, se decir la hora, si quieres decirle a mis creadores algo que quieras que tenga, no olvides escribir ADA y eso que quieres, les llegará a ellos y en algún momento lo programarán, a futuro puedes preguntarme por portales en el intel y yo con gusto te mandaré un screen de ello, con mucho cariño ADA 😘😘😘", null, message_id);
                }
            // NICK
                else if(text.indexOf("nick") > -1 || text.indexOf("@alias") > -1){
                    app.telegram.sendDocument(chat, "BQADAQADIBoAAsI9uwABXiK5HcGnKjwC", "Tutorial para configurar tu @alias.", message_id)                    
                }
            // Despedida
                else if ( text.indexOf("adios") > -1 || text.indexOf("chao") > -1 || text.indexOf("nos vemos") > -1 || text.indexOf("au revoir") > -1 || text.indexOf("hasta luego") > -1 || text.indexOf("hasta pronto") > -1 || text.indexOf("sayounara") > -1 || text.indexOf("さようなら") > -1 || text.indexOf("さらばだ") > -1 || text.indexOf("sarabada") > -1 || text.indexOf("auf wiedersehen") > -1 || text.indexOf("tschüss") > -1 || text.indexOf("despidete") > -1 || text.indexOf("bye") > -1 && words(text) < 5){
                    function addZero(i) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;
                    }
        		    var sal = new String();
                            var d = new Date();
                            var h = addZero(d.getHours());
        			if (h>=5 && h<6){
        				sal = ",que tengas un buen día.";
        			}
        			else if (h>=6 && h<8){
        				sal = ",ve a desayunar que se te hace tarde.";
        			}
        			else if (h>=8 && h<12){
        				sal = ",que tengas un buen día con un hermoso cielo azul.";
        			}
        			else if (h>=12 && h<14){
        				sal = ",almuerza rápido y aprovecha a espichar sapos.";
        			}
        			else if (h>=14 && h<18){
        				sal = ",espero estes tenido un lindo día y estes espichando muchos sapos.";
        			}
        			else if (h>=18 && h<21){
        				sal = ",te vas temprano, quiero creer que vas a un farm o a espichar sapos.";
        			}
        			else if (h>=21 && h<24){
        				sal = ",que descanses, hoy ha sido un largo día aquí seguiré con los del turno nocturno.";
        			}
        			else {
        				sal = ",eres de los que siempre están dando lo mejor y me acompañas en todo momento, toma un merecido descanso.";
        			}
                    if (username) {
                        app.telegram.sendMessage(chat, 'Adios @' + username + ' ' + sal + ' ADA 😘😘😘', null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Adios ' + name + ' ' + sal + ' ADA 😘😘😘', null, message_id);
                    }                   
                }
            // SALUDAR 
                else if (text.indexOf("saludar") > -1 || text.indexOf("saluda") > -1 && words(text) < 5) {
                    app.telegram.sendMessage(chat, "Hola!, un saludo para mis fans 😘😘😘", null, message_id);
                }
            // Hola ada
                else if ( text.indexOf("hola") > -1 || text.indexOf("osu") > -1 || text.indexOf("hello") > -1 || text.indexOf("holi") > -1 || text.indexOf("buen") > -1 || text.indexOf("bonjour") > -1 || text.indexOf("salut") > -1 || text.indexOf("hi") > -1　|| text.indexOf("お早う") > -1　|| text.indexOf("今日は") > -1　|| text.indexOf("今晩は") > -1　|| text.indexOf("ohayou") > -1 || text.indexOf("konnichiha") > -1 || text.indexOf("buongiorno") > -1 || text.indexOf("konbanha") > -1 || text.indexOf("guten") > -1 || text.indexOf("hallo") > -1 || text.indexOf("mahlzeit") > -1 && words(text) < 5){
                    function addZero(i) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;
                    }
        		    var sal = new String();
                            var d = new Date();
                            var h = addZero(d.getHours());
        			if (h>=5 && h<6){
        				sal = ",buenos días, es muy temprano, ¿preparado para espichar sapos hoy?";
        			}
        			else if (h>=6 && h<8){
        				sal = ", buenos días, ve y toma tu desayuno y alistate para esta jornada.";
        			}
        			else if (h>=8 && h<12){
        				sal = ", buenos días, sigue y tomate un powercube.";
        			}
        			else if (h>=12 && h<14){
        				sal = ", buenas tardes, es hora de almorzar, aprovecha y espicha sapos apenas termines.";
        			}
        			else if (h>=14 && h<18){
        				sal = ", buenas tardes, animo que ya falta poco para salir a espichar sapos.";
        			}
        			else if (h>=18 && h<21){
        				sal = ", buenas noches, ¿tuviste un lindo día? Espero que si";
        			}
        			else if (h>=21 && h<24){
        				sal = ", buenas noches, bienvenido al turno nocturno, cuentanos tus aventuras espichando sapos hoy.";
        			}
        			else {
        				sal = ", buenas noches... ¿o ya son días?... esas ambigüedades humanas me vuelven loca. Cuentame como te fue el día de ayer y que piensas hacer hoy.";
        			}
                    if (username) {
                        app.telegram.sendMessage(chat, 'Hola @' + username + ' ' + sal + ' ADA 😘😘😘', null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Hola ' + name + ' ' + sal + ' ADA 😘😘😘', null, message_id);
                    }                   
                }
          /*  // HOLA ADA
                else if(text.indexOf("hola") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", ¿cómo estás?", null, message_id);
                }
                else if(text.indexOf("y tu") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "@" + username + ", Necesito mucha ayuda, estoy siendo perseguida en estos momentos y no se si peda seguir viva :´(, ¿me ayudarás?", null, message_id);
                }
                else if(text.indexOf("nick") > -1 || text.indexOf("@alias") > -1){
                    app.telegram.sendDocument(chat, "BQADAQADIBoAAsI9uwABXiK5HcGnKjwC", "Tutorial para configurar tu @alias.", message_id)                    
                }*/
//////////////////////////////////////////AYUDA para noobs///////////////////////////////////////////////////////////////////////////////////////////////////
            // Subir de lvl
                else if (text.indexOf("subir de nivel") > -1 || text.indexOf("levelear") > -1 || text.indexOf("subo de nivel") > -1 && words(text) < 6) {
                    if (username) {
                        app.telegram.sendMessage(chat, 'Hola @' + username + ', para subir de nivel lo mejor es revisar el intel y pensar en un plan de acción, salir a andar y tumbar muchos portales y capturarlos completos, luego realizar muchos fields procurando que sean en multicapa, esto viene dado cuando estas realizando el plan en el intel, para mas información visita nuesto foro en rescol.co/tutos ADA 😘😘😘', null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Hola @' + name + ', para subir de nivel lo mejor es revisar el intel y pensar en un plan de acción, salir a andar y tumbar muchos portales y capturarlos completos, luego realizar muchos fields procurando que sean en multicapa, esto viene dado cuando estas realizando el plan en el intel, para mas información visita nuesto foro en rescol.co/tutos ADA 😘😘😘', null, message_id);
                    }  
                }
/* TODO
            // items 
                else if (text.indexOf("saludar") > -1 || text.indexOf("saluda") > -1 && words(text) < 5) {
                    app.telegram.sendMessage(chat, "Hola!, un saludo para mis fans 😘😘😘", null, message_id);
                }
            // Portal calc
                else if (text.indexOf("saludar") > -1 || text.indexOf("saluda") > -1 && words(text) < 5) {
                    app.telegram.sendMessage(chat, "Hola!, un saludo para mis fans 😘😘😘", null, message_id);
                }
////////////////////////////////////////////Ayuda para noobs Fin/////////////////////////////////////////////////////////////////////////////*/
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

    var acentos = (function() {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
        to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};

        for(var i = 0, j = from.length; i < j; i++ )
        mapping[ from.charAt( i ) ] = to.charAt( i );

        return function( str ) {
            var ret = [];
            for( var i = 0, j = str.length; i < j; i++ ) {
                var c = str.charAt( i );
                if( mapping.hasOwnProperty( str.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }      
            return ret.join( '' );
        }

    })();

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
