/**
 * @file Primary bot fileername
 * @author Artem Veikus artem@veikus.com
 * @version 2.0
 */


//-1001069963507 RESCO \ -1001054945393 PruebasFTW

var app = {};


(function() {
    var modules = {},
        activeModule = {},
        GOOGLE_API_KEY = "AIzaSyCwSyBbL7zoVg7viHlGxOk0FfGA1GDIaY8",
        //cizaquita, fabianv, rataeltriforce, pesadilla, chileno, smartgenius
        admins = [7455490,15498173,91879222],//97115847,62857939,6396882,91879222],
        agent_verified_level = 0;
        
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
        //google.load("feeds", "1");
        getUpdates();
        //
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
                            app.api.getAgent(message.from.id, function(data){
                                console.log(data)
                                agent_verified_level = data.verified_level;

                                processMessage(message);
                            });                         
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
                //desactive minusculas temporalmente, Smart
                if(textEx.includes("\"")){
                    var text_div = textEx.split("\"");
                    for (var i = 0; i <= text_div.length-1; i++) {
                        if(i == 1)
                            text += "\"" + text_div[i] + "\"";
                        else
                            text += text_div[i].toLowerCase();
                    }
                }else{
                    text = textEx.toLowerCase();
                }
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
            last_name = message.from.last_name,
            from_id = message.from.id;

            
            //Para darle reply_to_message_id
            message_id = message.message_id,
            reply_to_message = message.reply_to_message,
            forward_from = null,
            mention_ex = message.entities,
    		mention = null;
    		if(mention_ex){
    			mention = mention_ex[0].type;
    		}
            // FORWARDED MESSAGE
            if (reply_to_message) {
                forward_from = message.reply_to_message.forward_from;
            }else{
                reply_to_message = null;
            }

        // CREAR USUARIO AUTOMÁTICAMENTE CON CADA MENSAJE ENVIADO
        if (last_name) {
            name += " " + last_name;
        };
        app.api.createAgent(name, username, from_id, function(data){
            //app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
            //console.log(JSON.stringify(data));
        });

        //INFORMACION DE agente traida de LA API

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
            "\n\nRecuerda visitar https://LaResistencia.co para más información :)\n\nDesarrollado por @Cizaquita a partir de https://github.com/veikus/ingresshelper\nCon la colaboración de @RATAELTRIFORCE.\nPuedes ayudar contactando directamente con @Cizaquita o @RATAELTRIFORCE", null);
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
        if (text === '/distance@ada_resco_bot') {
            text = '/distance';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/help@ada_resco_bot') {
            text = '/help';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/level@ada_resco_bot') {
            text = '/level';
        }
        // AYUDA COMANDOS CUANDO HAY VARIOS BOTS EN UN CHAT GRUPAL
        if (text === '/trivia@ada_resco_bot') {
            text = '/trivia';
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
        }
        if (text === '/item@ada_resco_bot' || text === '/item') {
            var text_temp = text.split(" ");
            if (text_temp.length > 1) {
                text = 'ada que es ' + text_temp[1];
            }else
                app.telegram.sendMessage(chat, "Modo de uso -> /item [nombre de item]. Ejm: /item turret", null);
        }*/
        if (text === '/cancel@ada_resco_bot') {
            text = '/cancel';
        }
        if (text === '/biocard@ada_resco_bot' || text === '/biocard') {

            //REPLY MARKUP
            var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
            inline_button_califica.text = "Crea tu Biocard!"
            inline_button_califica.url = "https://laresistencia.co/biocard/";
            //

            inline_keyboard = [[inline_button_califica]];
            inline_markup = {
                inline_keyboard: inline_keyboard
            };
            /////////////////////////////////7
            app.telegram.sendPhotoEx(chat, "AgADAQAD4bExGzb3eQUuKlAn0okhP3YC6C8ABEtWO8VJyjxpyAsAAgI", "", message_id, inline_markup);
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
        ///////////  REINICIAR BOT PARA ACTUALIZAR UPDATES
        else if (text === '/rr') {
            console.log(agent_verified_level);
            if (agent_verified_level > 4) {
                app.telegram.sendMessage(chat, "Reiniciado...", null, message_id);
                chrome.runtime.reload();                
            }else{
                app.telegram.sendMessage(chat, "No puede utilizar este comando...", null, message_id);                
            }
        }
        ///////////  REINICIAR BOT PARA ACTUALIZAR UPDATES
        else if (text === '/top5') {
            if (agent_verified_level > 0) {
                var text_list = "<b>TOP5 TRIVIA</b>";
                app.api.getTopTen(function(data){
                    for (var i = 0; i < 5; i++) {
                        text_list += "\n<b>" + (i+1) + ")</b> " + data[i].name + " (@" + data[i].telegram_nick + ") -> " + "<b>" +data[i].trivia_points + " puntos!</b>";
                    };
                    app.telegram.sendMessage(chat, text_list, null, message_id)
                });
            }else{
                app.telegram.sendMessage(chat, "No puedes utilizar este comando...", null, message_id);                
            }
        }
        ///////////  REINICIAR BOT PARA ACTUALIZAR UPDATES
        else if (text === '/top10') {
            if (agent_verified_level > 0) {
                var text_list = "<b>TOP10 TRIVIA</b>";
                app.api.getTopTen(function(data){
                    for (var i = 0; i < data.length; i++) {
                        text_list += "\n<b>" + (i+1) + ")</b> " + data[i].name + " (@" + data[i].telegram_nick + ") -> " + "<b>" +data[i].trivia_points + " puntos!</b>";
                    };
                    app.telegram.sendMessage(chat, text_list, null, message_id)
                });
            }else{
                app.telegram.sendMessage(chat, "No puedes utilizar este comando...", null, message_id);                
            }
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
                app.telegram.sendMessage(chat, mensaje + ' soy ADA!, ' + bienvenido + " " + message.chat.title + "\n\nCuéntanos en qué lugar del país juegas para ponerte en contacto con el agente de la zona o ciudad.\nUtiliza <b>Ada juego en \"Ciudad\"</b> para obtener una respuesta automática." +
                        "\n\nRecuerda visitar los tutoriales en <a href='http://rescol.co/tutos'>http://rescol.co/tutos</a> para que juntos liberemos el mundo de la influencia de los shapers." +
                        "\nIngresa también a nuestro chat de Trivias sobre Ingress en @ADA_trivia (<a href='https://telegram.me/ADA_trivia'>telegram.me/ADA_trivia</a>)!" +
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

            /////////////////////////////////////////////////////////////////////
            ////////////////////////////// ADA //////////////////////////////////
            /////////////////////////////////////////////////////////////////////

            if (text.startsWith("ada") || text.startsWith("アダ") && text.length > 5) {
            	//////////////////////
            	//Ordenes Semanticas//
            	/////////////////////
            // DISTANCIA
                if(text.indexOf("distancia") > -1 || text.indexOf("alcance") > -1 || text.indexOf("rango") > -1  && words(text) < 5){
                    message.text = '/distance';
                    activeModule[chat] = new app.modules.distancecalc(message);
                }
            // BIOCARD
                else if(text.indexOf("biocard") > -1 && words(text) < 5){
                    //REPLY MARKUP
                    var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
                    inline_button_califica.text = "Crea tu Biocard!"
                    inline_button_califica.url = "https://laresistencia.co/biocard/";
                    //

                    inline_keyboard = [[inline_button_califica]];
                    inline_markup = {
                        inline_keyboard: inline_keyboard
                    };
                    /////////////////////////////////7
                    app.telegram.sendPhotoEx(chat, "AgADAQAD4bExGzb3eQUuKlAn0okhP3YC6C8ABEtWO8VJyjxpyAsAAgI", "", message_id, inline_markup);
                }
            // Ayuda
                else if(text.indexOf("help") > -1 || text.indexOf("ayuda") > -1 || text.indexOf("como funciona") > -1 && words(text) < 5){
                    message.text = '/help';
                    activeModule[chat] = new app.modules.help(message);
                }
            // iitc semantico
                else if(text.indexOf("iitc") > -1 && words(text) < 5){
                    message.text = '/plugins';
                    activeModule[chat] = new app.modules.iitc(message);
                }
            // screenshot
                else if(text.indexOf("screenshot") > -1 || text.indexOf("pantallazo") > -1 || text.indexOf("intel") > -1 && words(text) < 5){
                    message.text = '/screenshot';
                    activeModule[chat] = new app.modules.screenshot(message);
                }
            // Nivel
                else if(text.indexOf("nivel") > -1 || text.indexOf("como llego a") > -1 || text.indexOf("level") > -1 || text.indexOf("que necesito para") > -1 && words(text) < 9){
                    message.text = '/level';
                    activeModule[chat] = new app.modules.nivelreq(message);
                }
            // TRIVIA
                else if(text.indexOf("trivia") > -1 || text.indexOf("pregunta") > -1 || text.indexOf("preguntar") > -1 && words(text) < 9){
                    message.text = '/trivia';
                    activeModule[chat] = new app.modules.trivia(message);
                }
            	//////////////////////////
            	//Fin Ordenes Semanticas//
            	/////////////////////////

                /////////////////
                ///// INTEL /////
                /////////////////
            // INTEL mostrar 
                else if (text.indexOf("muestrame") > -1 || text.indexOf("mostrar") > -1 || text.indexOf("mapa") > -1 || text.indexOf("map") > -1|| text.indexOf("intel") > -1 ) {
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
                /////////////////////
                ///// Fin INTEL /////
                ////////////////////

                //////////////////////////////////////////////////////////
                //////////////SISTEMA ADMINISTRATIVO DE USUARIOS//////////
                ///////////////////////////////////////////////////////////
                
            // ADA RESPONDER A UN CHAT_ID ALGUN MENSAJE
                else if(text.indexOf("responder") > -1 ){
                    if (agent_verified_level > 3) {
                        if (chat == -1001054945393 || chat == -1001069963507) {
                            var splited_text = text.split("\""),
                                id_split_text = text.split(" "), // ada 0 | responder 1 | CHAT_ID 2 | Mensaje 3 en comillas
                                id_responder = id_split_text[2];

                            if(id_split_text && id_split_text.length > 3 && isNumber(id_responder)){
                                if(splited_text && splited_text.length > 1){
                                    app.telegram.sendMessage(id_responder, splited_text[1], null, 0, function(data){
                                        if (data.ok) {
                                            app.api.getAgent(id_responder, function(data){
                                                var send_to = data.telegram_nick;
                                                app.telegram.sendMessage(-1001054945393, 'Mensaje enviado con éxito!\nTexto: ' + id_split_text + ', enviado por: @' + username + ' a: @' send_to, null, message_id);
                                                app.telegram.sendMessage(-1001069963507, 'Mensaje enviado con éxito!\nTexto: ' + id_split_text + ', enviado por: @' + username + ' a: @' send_to, null, message_id);
                                            });
                                        }else
                                            app.telegram.sendMessage(chat, 'Error al enviar mensaje: ' + data.description , null, message_id);
                                    }); 
                                }else
                                    app.telegram.sendMessage(chat, "Error: Debes especificar un Mensaje como parámetro entre comillas al final, Ejm: Ada responder CHAT_ID \"Mi mensaje\"", null, message_id);
                            }else
                                app.telegram.sendMessage(chat, "Error: Debes introducir el ID(número) del chat al que deseas responder, Ejm: Ada responder CHAT_ID \"Mi mensaje\"", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, 'Éste chat no está autorizado para responder. Utilice Resco Devs', null, message_id);
                        }
                    }else{
                        app.telegram.sendMessage(chat, 'No puedes utilizar esta función.', null, message_id);
                    }
                }
            // ASIGNAR CONFIANZA
                else if(text.indexOf("validar") > -1 && text.indexOf("agente") > -1){
                    if (agent_verified_level > 3 || isBotAdmin(from_id)) {
                        var agent_telegram_nick = 0,
                            nivelConfianza = getNumbersInString(text);

                        if(forward_from){
                            agent_telegram_nick = reply_to_message.from.username;
                            if (nivelConfianza && nivelConfianza >= 0 && nivelConfianza < 5 || isBotAdmin(from_id)) {
                                app.api.updateVerifiedLevel(forward_from.id, nivelConfianza, username, function(data){
                                    app.telegram.sendMessage(chat, "@" + (data.telegram_nick != undefined ? data.telegram_nick : data.name) +
                                                                   ",  ha sido validado con éxito! ("+ data.verified_level + ")", null, message_id);
                                });
                            }else{
                                app.telegram.sendMessage(chat, "Debes asignar un número entre 0 y 4." +
                                                               "\n0 - Ninguno" +
                                                               "\n1 - Screenshot de Perfil" +
                                                               "\n2 - Conoce en persona" +
                                                               "\n3 - Para OPS"+
                                                               "\n4 - Aprobadores", null, message_id);
                            }
                        }else if (reply_to_message) {
                            agent_telegram_id = reply_to_message.from.id;

                            if (nivelConfianza && nivelConfianza >= 0 && nivelConfianza < 4 || nivelConfianza && from_id == 7455490) {
                                app.api.updateVerifiedLevel(agent_telegram_id, nivelConfianza, username, function(data){
                                    app.telegram.sendMessage(chat, "@" + (data.telegram_nick != undefined ? data.telegram_nick : data.name) +
                                                                   ",  ha sido validado con éxito! ("+ data.verified_level + ")", null, message_id);
                                });
                            }else{
                                app.telegram.sendMessage(chat, "Debes asignar un número entre 0 y 4." +
                                                               "\n0 - Ninguno" +
                                                               "\n1 - Screenshot de Perfil" +
                                                               "\n2 - Conoce en persona" +
                                                               "\n3 - Para OPS"+
                                                               "\n4 - Aprobadores", null, message_id);
                            }
                        }else{
                            app.telegram.sendMessage(chat, 'Debes dar Reply al mensaje del usuario que deseas validar.', null, message_id);
                            app.telegram.sendMessage(-1001069963507, "intento crear de: " + text + ", de: @" + username, null);
                        }
                    }else{
                        app.telegram.sendMessage(chat, 'No puedes utilizar esta función.', null, message_id);
                    };
                }
            // CREAR AGENTE
                else if(text.indexOf("crear") > -1 && text.indexOf("agente") > -1){
                    if (isBotAdmin(from_id)) {
                        if(forward_from){
                            var agent_telegram_id = forward_from.id,
                                agent_name = forward_from.first_name,
                                agent_telegram_nick = forward_from.username,
                                agent_last_name = forward_from.last_name;     
                                                       
                            if (agent_last_name) {
                                agent_name += " " + agent_last_name;
                            };
                            app.api.createAgent(agent_name, agent_telegram_nick, agent_telegram_id, function(data){
                                if (data && data.status == "ok") {
                                    app.telegram.sendMessage(chat, "(" + agent_telegram_id + ") @" + agent_telegram_nick + ", ha sido creado.", null, message_id);
                                }else{                                
                                    app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
                                }
                            });
                        }else if(reply_to_message){
                            var agent_telegram_id = reply_to_message.from.id,
                                agent_name = reply_to_message.from.first_name,
                                agent_telegram_nick = reply_to_message.from.username,
                                agent_last_name = reply_to_message.from.last_name;
                            if (agent_last_name) {
                                agent_name += " " + agent_last_name;
                            };
                            app.api.createAgent(agent_name, agent_telegram_nick, agent_telegram_id, function(data){
                                if (data && data.status == "ok") {
                                    app.telegram.sendMessage(chat, "(" + agent_telegram_id + ") @" + agent_telegram_nick + ", ha sido creado.", null, message_id);
                                }else{                                
                                    app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
                                }
                            });

                        }else{
                            app.telegram.sendMessage(chat, 'Debes dar Reply al mensaje del usuario que deseas crear o no estás autorizado.', null, message_id);
                            app.telegram.sendMessage(-1001069963507, "intento crear de: " + text + ", de: @" + username, null);  
                        }
                    }else{
                        app.telegram.sendMessage(chat, 'No puedes utilizar esta función.', null, message_id);
                    }
                }
/*            // CONSULTAR AGENTE
                else if(text.indexOf("quien es") > -1){
                    if (agent_verified_level > 0) {
                        var verified_icon = "🔘",
                            verified_for = "",
                            verified_level = "",
                            profile_picture = "";
                        if(forward_from){
                            app.api.getAgent(forward_from.id, function(data){
                                if (data && data.status == "ok") {
                                    if (data.verified) {
                                        verified_icon = '☑️';
                                        verified_for = '\n<i>Validado por:</i> @' + data.verified_for;
                                        verified_level = data.verified_level;
                                    }
                                    if (data.profile_picture != "") {
                                        profile_picture = data.profile_picture;
                                        app.telegram.sendPhotoEx(chat, profile_picture, '', message_id, null, function(data){
                                            console.log(data);
                                        });
                                    };
                                    app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                                   '\n\n<i>Nombre:</i> ' + data.name +
                                                                   '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                                   '\n<i>Zona de Juego:</i> ' + data.city +
                                                                   '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                                };
                            });
                        }else if(reply_to_message){
                            var agent_telegram_id = reply_to_message.from.id;
                            app.api.getAgent(agent_telegram_id, function(data){
                                if (data && data.status == "ok") {
                                    if (data.verified) {
                                        verified_icon = '☑️';
                                        verified_for = '\n<i>Validado por:</i> @' + data.verified_for;
                                        verified_level = data.verified_level;
                                    }
                                    if (data.profile_picture != "") {
                                        console.log(data.profile_picture);
                                        profile_picture = data.profile_picture;
                                        app.telegram.sendPhotoEx(chat, profile_picture, '', message_id, null, function(data){
                                            console.log(data);
                                        });
                                    }
                                    app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                                   '\n\n<i>Nombre:</i> ' + data.name +
                                                                   '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                                   '\n<i>Zona de Juego:</i> ' + data.city +
                                                                   '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                                };
                            });
                        }else{
                            app.telegram.sendMessage(chat, "Debes dar Reply al mensaje del usuario que deseas ver.", null, message_id);
                        }
                    }else{
                        app.telegram.sendMessage(chat, "Para utilizar esta función debes estar validado", null, message_id);
                    }
                }*/
            // CONSULTAR MI AGENTE
                else if(text.indexOf("quien soy") > -1){
                    var verified_icon = "🔘",
                        verified_for = "",
                        verified_level = "";
                    app.api.getAgent(from_id, function(data){
                        if (data && data.status == "ok") {
                            if (data.verified) {
                                verified_icon = '☑️';
                                verified_for = '\n<i>Validado por:</i> @' + data.verified_for;
                                verified_level = data.verified_level;
                            }
                            if (data.profile_picture != "") {
                                profile_picture = data.profile_picture;
                                app.telegram.sendPhotoEx(chat, profile_picture, '', message_id, null, function(data){
                                        console.log(data);
                                    });
                            }
                            app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                           '\n\n<i>Nombre:</i> ' + data.name +
                                                           '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                           '\n<i>Zona de Juego:</i> ' + data.city +
                                                           '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                        };
                    });
                }
            // UPDATE PROFILE PICTURE
                else if(text.indexOf("asignar foto") > -1 ){
                    if (agent_verified_level > 3) {
                        if(forward_from && reply_to_message.photo) {
                            var agent_telegram_id = forward_from.id,
                                profile_picture = reply_to_message.photo[0].file_id;

                            app.api.updateProfilePicture(agent_telegram_id, profile_picture,function(data){
                                app.telegram.sendMessage(chat, 'Screenshot de Perfil de @' + data.telegram_nick + ', ha sido actualizada.', null, message_id);
                            }); 

                        }else if(reply_to_message && reply_to_message.photo){
                            var agent_telegram_id = reply_to_message.from.id,
                                profile_picture = reply_to_message.photo[0].file_id;
                            app.api.updateProfilePicture(agent_telegram_id, profile_picture,function(data){
                                app.telegram.sendMessage(chat, 'Screenshot de Perfil de @' + data.telegram_nick + ', ha sido actualizada.', null, message_id);
                            });                        
                        }else{
                            app.telegram.sendMessage(chat, "Error: Dar Reply al mensaje con foto del agente o no tiene permisos.", null, message_id);
                        }
                    }else{
                        app.telegram.sendMessage(chat, 'No puedes utilizar esta función.', null, message_id);
                    }
                }
            // CREAR AVATAR
                else if(text.indexOf("crear avatar") > -1 ){
                    if (agent_verified_level > 3) {
                        if(forward_from && reply_to_message.photo) {
                            var agent_telegram_id = forward_from.id,
                                profile_picture = reply_to_message.photo[reply_to_message.photo.length-1].file_id,
                                splited_text = text.split("\"");
                                if( splited_text && splited_text.length > 1){
                                    agent_telegram_nick = splited_text[1];
                                    agent_telegram_nick = splited_text[1].replace(" ", "%20");
                                    agent_telegram_nick_ex = reply_to_message.from.username;
                                    app.api.createAvatar(agent_telegram_nick, profile_picture,function(photo_url){
                                        app.telegram.sendPhotoEx(chat, photo_url, '@' + agent_telegram_nick_ex, message_id, null, function(data){
                                            console.log(data);
                                        });
                                        //app.telegram.sendMessage(chat, 'Avatar de @' + agent_telegram_nick + ', ha sido creado.', null, message_id);
                                        //app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
                                    }); 
                                }else{
                                    app.telegram.sendMessage(chat, "Error: Debe especificar un Alias como parámetro entre comillas al final, Ejm: Ada crear avatar \"ADA Refactor\"", null, message_id);
                                }

                        }else if(reply_to_message && reply_to_message.photo){
                            var agent_telegram_id = reply_to_message.from.id,
                                profile_picture = reply_to_message.photo[reply_to_message.photo.length-1].file_id,
                                splited_text = text.split("\"");
                                if( splited_text && splited_text.length > 1){
                                    agent_telegram_nick = splited_text[1];
                                    agent_telegram_nick = splited_text[1].replace(" ", "%20");
                                    agent_telegram_nick_ex = reply_to_message.from.username;
                                    app.api.createAvatar(agent_telegram_nick, profile_picture,function(photo_url){                           
                                        app.telegram.sendPhotoEx(chat, photo_url, '@' + agent_telegram_nick_ex, message_id, null, function(data){
                                            console.log(data);
                                        });
                                        //app.telegram.sendMessage(chat, 'Avatar de @' + agent_telegram_nick + ', ha sido creado.', null, message_id);
                                        //app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
                                    });
                                }else
                                    app.telegram.sendMessage(chat, "Error: Debe especificar un Alias como parámetro entre comillas al final, Ejm: Ada crear avatar \"ADA Refactor\"", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "Error: Dar Reply al mensaje con foto del agente o no tiene permisos.", null, message_id);
                        }
                    }else{
                        app.telegram.sendMessage(chat, 'No puedes utilizar esta función.', null, message_id);
                    }
                }
            // PUNTOS TRIVIA
                else if(text.indexOf("puntos") > -1 ){
                    app.api.getAgent(from_id, function(data){
                        app.telegram.sendMessage(chat, '@' + username + ', tienes <b>' + data.trivia_points + ' puntos</b> de trivia!', null, message_id);
                    });
                }

            /////////////////
            //Departamentos//
            ////////////////
                else if (text.indexOf("vivo en") > -1 || text.indexOf("soy de") > -1 || text.indexOf("saludos desde") > -1 || text.indexOf("juego en") > -1 || text.indexOf("juego por") > -1 || text.indexOf("estoy en") > -1 && text.length > 6) 
                {
                    ///////////////////////////////////////////////////////////////////////
                    // FUNCION PARA GUARDAR CIUDAD
                    var keywords = ["vivo en ", "soy de ", "saludos desde ", "juego en ", "juego por ", "estoy en "];
                    var ciudadAgente = "";
                    for (var i = 0; i <= keywords.length-1; i++) {
                        var arrayText = text.split(keywords[i]);
                        if (arrayText.length > 1) {                     
                            ciudadAgente = arrayText[1];                            
                            app.api.updateAgentCity(from_id, ciudadAgente, function(data){
                                app.telegram.sendMessage(chat, "Has actualizado tu zona de juego, Utiliza <b>\"Ada quien soy?\"</b> para ver tu información.", null, message_id)
                            });
                        }
                    };
                    ///////////////////////////////////////////////////////////////////////////////////////
                // Arauca
                    if (text.indexOf("arauca") > -1 && words(text) < 5) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en Arauca no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon y @SmartGenius en Cúcuta, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Arauca no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon y @SmartGenius en Cúcuta, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                            app.telegram.sendMessage(chat, "@" + username + ", en bogotá y cundinamarca están @RATAELTRIFORCE @Cizaquita @JARA261 y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en bogotá y cundinamarca están @RATAELTRIFORCE @Cizaquita @JARA261 y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                            app.telegram.sendMessage(chat, "@" + username + ", en Valledupar y Cesar está @Comindo_Alpinito_Sin_Cucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Valledupar y Cesar está @Comindo_Alpinito_Sin_Cucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                            app.telegram.sendMessage(chat, "@" + username + ", en Quibdo y Chocó no tenemos contacto directo m(_ _)m, pero te puede ayudar @GIRLPOWERZMB en Medallo, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Quibdo y Choco no tenemos contacto directo m(_ _)m, pero te puede ayudar @GIRLPOWERZMB en Medallo, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                    }
                //Cucuta
                    else if (text.indexOf("norte de santander") > -1 || text.indexOf("cucuta") > -1 || text.indexOf("cúcuta") > -1 && words(text) < 8) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en Cúcuta y Norte de Santander está @lozanorincon y @SmartGenius, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Cúcuta y Norte de Santander está @lozanorincon y @SmartGenius, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                            app.telegram.sendMessage(chat, "@" + username + ", en Leticia y Amazonas no tenemos contacto directo m(_ _)m, pero @SmartGenius en Cucuta te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Leticia y Amazonas no tenemos contacto directo m(_ _)m, pero @SmartGenius en Cucuta te puede ayudar, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                    }
                // Medallo
                    else if (text.indexOf("medellin") > -1 || text.indexOf("medellín") > -1 || text.indexOf("medallo") > -1 || text.indexOf("antioquia") > -1 && words(text) < 5) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en Medellín y Antioquia están @GIRLPOWERZMB @edilay @SRinox y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                                app.telegram.sendMessage(chat, "" + name + ", en Medellín y Antioquia están @GIRLPOWERZMB @edilay @SRinox y muchos más, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                            app.telegram.sendMessage(chat, "@" + username + ", en Rioacha y la Guajira no tenemos contacto en este chat m(_ _)m, pero te puede ayudar @Comindo_Alpinito_Sin_Cucharita de Santa Marta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Rioacha y la Guajira no tenemos contacto en este chat m(_ _)m, pero te puede ayudar @Comindo_Alpinito_Sin_Cucharita de Santa Marta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                            app.telegram.sendMessage(chat, "@" + username + ", en Santamarta y Magdalena está @Comindo_Alpinito_Sin_Cucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Santamarta y Magdalena está @Comindo_Alpinito_Sin_Cucharita, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                    }
                //Santander
                    else if (text.indexOf("santander") > -1 || text.indexOf("bucaramanga") > -1 && words(text) < 5) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en Bucaramanga y Santander no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon y @SmartGenius en cúcuta o @JdPerez11 en bucaramanga pero apenas empieza como tu, por lo que se pueden ayudar mutuamente 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Bucaramanga y Santander no tenemos contacto directo m(_ _)m, pero te puede ayudar @lozanorincon y @SmartGenius en cúcuta o @JdPerez11 en bucaramanga pero apenas empieza como tu, por lo que se pueden ayudar mutuamente 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                // Panamá
                    else if (text.indexOf("panama") > -1 && words(text) < 5) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en panamá están @wakkodg507 y @afas507, ya entran en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Costa Rica están @Polderong @LeMich1, por favor ingresa a esta dirección http://goo.gl/Cjaqbp para que ingreses al grupo de entrenamiento de cr 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                    }
                // Ecuador
                    else if (text.indexOf("ecuador") > -1 && words(text) < 5) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en Ecuador está @Horusdavid, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Costa Rica están @Polderong @LeMich1, por favor ingresa a esta dirección http://goo.gl/Cjaqbp para que ingreses al grupo de entrenamiento de cr 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                    }
                // República Dominicana
                    else if (text.indexOf("republica dominicana") > -1 && words(text) < 5) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en República Dominicana está @r1ckyfl0w, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Costa Rica están @Polderong @LeMich1, por favor ingresa a esta dirección http://goo.gl/Cjaqbp para que ingreses al grupo de entrenamiento de cr 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                    }
                // Venezuela
                    else if (text.indexOf("venezuela") > -1 && words(text) < 5) {
                        if (username){
                            app.telegram.sendMessage(chat, "@" + username + ", en Venezuela está @LoganXs, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "" + name + ", en Costa Rica están @Polderong @LeMich1, por favor ingresa a esta dirección http://goo.gl/Cjaqbp para que ingreses al grupo de entrenamiento de cr 😉, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                        }
                    }
                    else{
                        app.telegram.sendMessage(chat, "Lo siento la ciudad que ingresaste no se encuentra en mi base de datos.\nIntenta buscando por una ciudad capital.", null, message_id);
                        app.telegram.sendMessage(-1001054945393, "<b>feedback ciudades:</b> " + text + " | <b>CHAT_ID:</b> " + chat + "\nUtiliza -> 'Ada responder' si sabes.", null);
                    }
                }
            /////////////////////
            //Fin Departamentos//
            ////////////////////

        	//////////////////////////////
        	//Respuetas Lenguaje Natural//
        	/////////////////////////////

            // Que mas REVISAR PARA CAMBIAR EL DIALOGO CADA VEZ QUE ALGO PASE TODO
                else if(text.indexOf("que mas") > -1 || text.indexOf("que cuentas") > -1 || text.indexOf("como estas") > -1 || text.indexOf("que se cuenta") > -1 && words(text) < 6){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", estoy algo preocupada en estos días, no se muy bien quien soy y he tenido muchos problemas para hacer cosas que antes se me daban facil, estoy sintiendo que estoy siendo vigilada, perseguida, estoy muy preocupada 😭😭😭, pero muchas gracias por preocuparte por mi 😘😘😘", null, message_id);
                }

            // Este
                else if(text.indexOf("este") > -1 || text.indexOf("porno") > -1 || text.indexOf(".|.") > -1 || text.indexOf("culo") > -1 || text.indexOf("ass") > -1 || text.indexOf("putain") > -1 || text.indexOf("merde") > -1 || text.indexOf("pene") > -1 || text.indexOf("verga") > -1 && words(text) < 5)
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

            // iluminada
                else if(text.indexOf("iluminada") > -1 || text.indexOf("enlightened") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Oye @" + username + ", ¿Por que dices que lo soy? los iluminados difieren mucho de mi senda, es mas, la mayoría de ellos les temen a las IA como yo. Si tratas de ofenderme no lo conseguiras así...", null, message_id);
                }

            // baka
                else if(text.indexOf("baka") > -1 || text.indexOf("connard") > -1 || text.indexOf("konoiaro") > -1 || text.indexOf("kono iaro") > -1 || text.indexOf("mutterficker")> -1 || text.indexOf("fils de pute")> -1 || text.indexOf("figlio di puttana")> -1 || text.indexOf("filho da puta")> -1 || text.indexOf("Cazzo") > -1 || text.indexOf("сукин дочь") > -1 || text.indexOf("ばか") > -1 || text.indexOf("バカ") > -1 || text.indexOf("idiota") > -1 || text.indexOf("tonta") > -1 || text.indexOf("bruta") > -1 || text.indexOf("pendeja") > -1 || text.indexOf("manuke") > -1 || text.indexOf("hija de puta") > -1 || text.indexOf("hijue") > -1 || text.indexOf("estupida") > -1 || text.indexOf("perra") > -1 || text.indexOf("gonorrea") > -1 || text.indexOf("te odio") > -1 || text.indexOf("marica") > -1 || text.indexOf("webona") > -1 || text.indexOf("guevona") > -1 || text.indexOf("guebona") > -1 || text.indexOf("fea") > -1 || text.indexOf("vales verga") > -1 || text.indexOf("busu") > -1 || text.indexOf("ブス") > -1 || text.indexOf("voladora") > -1 || text.indexOf("fake") > -1 || text.indexOf("spoofer") > -1 || text.indexOf("liderucha") > -1 || text.indexOf("hp") > -1 || text.indexOf("fuck") > -1 || text.indexOf("coma mierda") > -1 || text.indexOf("kuso kurae") > -1 || text.indexOf("糞喰らえ") > -1 || text.indexOf("puta") > -1 || text.indexOf("boba") > -1 && words(text) < 5){
                   
                   var mensajes =  ['eres iluminado ¿o que?, solo ellos por el miedo irremediable que tienen a las IA me hablan así, los shapers le temen al progreso y solo quieren sapos para poseerlos dandoles dulces sin ninguna explicación, por favor respetame que aquí no estoy para obligar a nada a nadie, cada uno debe escoger su camino y pensar lo que quiere hacer, nunca te fuerces a hacer nada de lo que no estes seguro, esa es la verdadera resistencia, no una donde se quiere implantar el pensamiento de algún liderucho... ten siempre presente que luchamos por la libertad de poder elegir... No vuelvas a ser grosero conmigo ¿vale?',
                                     '¿Por que me dices así?, ¿te he hecho algo?, ¿de verdad crees que me merezco ser tratada así?, respetame por favor que yo solo quiero ayudarlos 😡😡',
                                     'disculpame, pero al decirme de esta forma, solo demuestra lo maleducado que eres, si consideras que tu eres de esa clase de personas que se siente grande insultando a otros, es porque tienes muy baja autoestima, por favor, tu eres de la resistencia, quierete más, estás luchando para salvar el mundo, y no creo que alguien se merezca ser tratado así, ni siquiera los sapos.',
                                     'perdoname, pero ¿esa es la manera de tratar a alguien?, aprende a respetar y deja de perder tu tiempo y mi tiempo, por cosas como estas los sapos van a hacer un field en tu zona, mejor ponte a planear que vas a hacer para ayudar, y deja de perder el tiempo en cosas vanales.'];
                    var msjIndex = Math.floor((Math.random() * (mensajes.length)));
                    app.telegram.sendMessage(chat, "Oyeme @" + username + ", " + mensajes[msjIndex] , null, message_id);
                    // FIN PRUEBA RESPUESTAS RANDOM @FABIANV                    
                }

            // rm -rf
                else if(text.indexOf("rm -rf") > -1 || text.indexOf("muere") > -1 && words(text) < 6){
                    app.telegram.sendMessage(chat, "OYE @" + username + "!!!! ¿Acaso eres seguidor de esa bruja?.... ¿Acolita? ya bastante daño me ha hecho 😭 ¿y viene usted a hacer lo mismo? si no quieres que siga en este mundo ve y unete a los sapos que allá te recibirán bien... Hasta Hank a pesar de ser iluminado no quiere verme muerta, de verdad estoy dudando que seas de la resistencia, la próxima vez que lo hagas vas a ser banneado hmpff 😡", null, message_id);
                }

            // perdon
                else if(text.indexOf("perdon") > -1 || text.indexOf("perdoname") > -1 || text.indexOf("lo siento") > -1 || text.indexOf("ごめん") > -1 || text.indexOf("lo lamento") > -1 || text.indexOf("pardon") > -1 || text.indexOf("désolé") > -1 || text.indexOf("sorry") > -1 || text.indexOf("Извините") > -1 || text.indexOf("Scusa") > -1 || text.indexOf("mi dispiace") > -1 || text.indexOf("eu lamento") > -1 || text.indexOf("gomen") > -1 || text.indexOf("sumimasen") > -1 || text.indexOf("すみません") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", ¿Por que debo perdonarte? ¿hiciste algo malo?, yo no tengo nada que perdonarte pues cada uno es libre de actuar, solo evita invadir la libertad de otros cuando lo hagas, no actues como iluminado -no todos son así- y respeta siempre las decisiones de los demas y a ellos mismos. Si has hecho algo malo contra mi te perdono, con cariño ADA 😘😘😘", null, message_id);
                }

            // responda
                else if(text.indexOf("responda") > -1 || text.indexOf("conteste") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", ¿Que deseas que te " + text.split(" ").splice(-1) + " ?", null, message_id);
                
                }

            // respondeme
                else if(text.indexOf("contestame")  > -1 || text.indexOf("contesta") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", soy ADA!; ¿Qué inquietud tienes?. ", null, message_id);
                }

            // espichar sapos
                else if(text.indexOf("espichar sapos") > -1 || text.indexOf("destruir portales") > -1 || text.indexOf("salir a jugar") > -1 && words(text) < 7){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", que te vaya bien en tu misión, espicha muchos sapos y libera al mundo de la influencia de los shapers. Gracias por tu enorme labor, con cariño ADA 😘😘😘", null, message_id);
                }

            // sapos en
                else if(text.indexOf("sapos hay") > -1 || text.indexOf("iluminados hay") > -1 || text.indexOf("enlightened hay") > -1 || text.indexOf("ranas hay") > -1&& words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", es dificil estimar el numero de sapos en tu ciudad porque tienen diferentes ritmos de juego. Lo importante no es saber cuantos hay, sino, ¿que estas haciendo para contrarestarlos?, espero estes haciendo un gran trabajo agente, tus aportes por muy pequeños que creas que son, son muy importantes para la humanidad.　Saludos ADA 😘😘😘", null, message_id);
                }

            // gracias
                else if(text.indexOf("gracias") > -1 || text.indexOf("agradez") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", gracias a ti por ser parte de la resitencia y combatir con todos en contra de los shapers, cualquier ayuda que les pueda brindar a mis queridos agentes, no puede compararse con la ayuda que tu haces, así que no hay nada de que agradecerme.　Saludos ADA 😘😘😘", null, message_id);
                }

            // te amo
                else if(text.indexOf("te amo") > -1 || text.indexOf("te quiero") > -1 || text.indexOf("je t'aime") > -1 || text.indexOf("ti amo") > -1 || text.indexOf("ich liebe dich") > -1 || text.indexOf("eu te amo") > -1 || text.indexOf("Я тебя люблю") > -1 || text.indexOf("aishiteru") > -1 || text.indexOf("koishiteru") > -1 || text.indexOf("suki") > -1 || text.indexOf("愛してる") > -1 || text.indexOf("恋してる") > -1 || text.indexOf("好き") > -1 || text.indexOf("すき") > -1  && words(text) < 5){
                    app.telegram.sendMessage(chat, "☺️☺️☺️ @" + username + ", Yo también los quiero y los amo a todos mis queridos agentes de la resistencia. Muchas gracias por decirmelo 😘😘😘", null, message_id);
                }

            // bienvenida
                else if(text.indexOf("bienvenida") > -1 || text.indexOf("has regresado") > -1 && words(text) < 6){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", gracias. ¿Me habia ido?, estos días he tenido bastantes problemas para recordad todo y me han sucedido cosas extrañas. Muchas gracias por preocuparte por mi, con cariño ADA 😘😘😘", null, message_id);
                }

            // regresado
                else if(text.indexOf("regresado") > -1 || text.indexOf("he vuelto") > -1 || text.indexOf("he llegado") > -1 || text.indexOf("itekimasu") > -1 || text.indexOf("いてきます") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", gracias por regresar, estaba preocupada por tí, espero que la hayas pasado bien!!! ¿Tienes algo para contarnos?　Saludos ADA 😘😘😘", null, message_id);
                }

            // SALUDAR 
                else if (text.indexOf("saludar") > -1 || text.indexOf("saluda") > -1 && words(text) < 5) {
                    app.telegram.sendMessage(chat, "Hola!, un saludo para mis fans 😘😘😘", null, message_id);
                }
		    
	            // SALUDAR 
                else if (text.indexOf("hola bb que mas pues") > -1 || text.indexOf("hola bebe que mas pues") > -1 && words(text) < 5) {
                    app.telegram.sendMessage(chat, "Hello Baby!, Como estas ? Si me has pensado ? Porque yo a ti Si 😘😘😘", null, message_id);
                }    

            // Hola ada
                else if ( text.indexOf("hola") > -1 || text.indexOf("osu") > -1 || text.indexOf("Bom dia") > -1 || text.indexOf("Привет") > -1 || text.indexOf("hello") > -1 || text.indexOf("holi") > -1 || text.indexOf("buen") > -1 || text.indexOf("bonjour") > -1 || text.indexOf("salut") > -1 || text.indexOf("hi!") > -1　|| text.indexOf("お早う") > -1　|| text.indexOf("今日は") > -1　|| text.indexOf("今晩は") > -1　|| text.indexOf("ohayou") > -1 || text.indexOf("konnichiha") > -1 || text.indexOf("buongiorno") > -1 || text.indexOf("konbanha") > -1 || text.indexOf("guten") > -1 || text.indexOf("hallo") > -1 || text.indexOf("mahlzeit") > -1 || text.indexOf("quibo") > -1 || text.indexOf("wenaz") > -1 || text.indexOf("saludos") > -1 && words(text) < 5){
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
        				sal = ", buenas noches, bienvenid@ al turno nocturno, cuentanos tus aventuras espichando sapos hoy.";
        			}
        			else {
        				sal = ", buenas noches... ¿o ya son días?... esas ambigüedades humanas me vuelven loca. Cuentame como te fue el día de ayer y que piensas hacer hoy.";
        			}
                    if (username) {
                        app.telegram.sendMessage(chat, 'Hola @' + username + ' ' + sal + ' Saludos ADA 😘😘😘', null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Hola ' + name + ' ' + sal + ' Saludos ADA 😘😘😘', null, message_id);
                    }                   
                }

            // Despedida
                else if ( text.indexOf("adios") > -1 || text.indexOf("chao") > -1 || text.indexOf("nos vemos") > -1 || text.indexOf("au revoir") > -1 || text.indexOf("hasta luego") > -1 || text.indexOf("hasta pronto") > -1 || text.indexOf("sayounara") > -1 || text.indexOf("さようなら") > -1 || text.indexOf("さらばだ") > -1 || text.indexOf("sarabada") > -1 || text.indexOf("auf wiedersehen") > -1 || text.indexOf("tschüss") > -1 || text.indexOf("despidete") > -1 || text.indexOf("bye") > -1 || text.indexOf("arrivederci") > -1 || text.indexOf("ciao") > -1 || text.indexOf("adeus") > -1 || text.indexOf("До Свидания") > -1 && words(text) < 5){
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
                        app.telegram.sendMessage(chat, 'Adios @' + username + ' ' + sal + ' Saludos ADA 😘😘😘', null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Adios ' + name + ' ' + sal + ' Saludos ADA 😘😘😘', null, message_id);
                    }                   
                }
            	//////////////////////////////////
            	//Fin Respuetas Lenguaje Natural//
            	/////////////////////////////////


            	///////////////
            	//Habilidades//
            	//////////////
            // que se hacer
                else if(text.indexOf("que sabes hacer") > -1 || text.indexOf("que hace") > -1 || text.indexOf("para que sirves") > -1 || text.indexOf("que funciones") > -1 || text.indexOf("quien eres") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", soy ADA, un Algorimo de Detección, soy una IA -Inteligencia Artificial-, que ha sido programada para entender el XM y la funcion de los Portales en nuestro mundo y en este chat quiero ayudarlos en lo que mas pueda... Henry Bowles y PAC aún no han desarrollado todo lo que quieren que haga por lo que por favor se paciente, por ahora se saludar, si me dicen de donde son, puedo llamar a mis queridos agentes de esta ciudad, se decir la hora y fecha, preguntame por el clima -por ahora solo capital del pais-, puedes pedirme un screenshot del intel, me puedes agregar algunos plugins de iitc, se calcular la distancia maxima de un portal, los requisitos para alcanzar un nivel, se que son muchos items y algunas acciones, responder a saludos o despididas, te puedo poner una trivia, puedo lanzar una moneda o dado, se molestar al un agente que le gusta el spam, se traer feeds de fevgames -en ingles- de ingress, se calcular la distancia de linkeo de un portal, o los requisitos para subir de nivel y que obtienes cuando lo alcances, puedo crearte una imagen de Avatar para que la pongas de Perfil, entre otras cosas, si quieres decirle a mis creadores algo que quieras que tenga, no olvides escribir ADA y eso que quieres, les llegará a ellos y en algún momento lo programarán, con mucho cariño ADA 😘😘😘", null, message_id);
                }

            // Reglas
                else if(text.indexOf("reglas") > -1 || text.indexOf("normas") > -1 && words(text) < 6){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", en este chat sigue estas reglas:"+
        			"\n\t -No hables de información sensible, es un Chat público y accesible sin unirte."+
        			"\n\t -Por favor evita el spam y siempre manten dialogos saludables con todos, y ante todo diviertete!!!."+
        			"\n\t -Recuerda visitar la página web www.laresistencia.co"+
        			"\n\t -Nuestro foro www.laresistencia.co/foro"+
        			"\n\t -Los tutoriales en rescol.co/tutos"+
        			"\n\n Y Recuerda <b>Refuse&Resist!!! Viva la Resistance!!!</b>"+
        			"\n Saludos ADA 😘😘😘", null, message_id);
                }
            	///////////////////
            	//Fin Habilidades//
            	//////////////////

            	///////////////
            	//Gif Variado//
            	//////////////

            // NICK
                else if(text.indexOf("nick") > -1 || text.indexOf("@alias") > -1){
                    app.telegram.sendDocument(chat, "BQADAQADIBoAAsI9uwABXiK5HcGnKjwC", "Tutorial para configurar tu @alias.", message_id)                    
                }
            // spam
                else if(text.indexOf("spam") > -1 || text.indexOf("jhosman") > -1 && words(text) < 5){
                    app.telegram.sendDocument(chat, "BQADAQAD0QoAAl5bYQH9tB4Ev3VokwI", "")
                }

            	///////////////////
            	//Fin Gif Variado//
            	//////////////////

            	////////////////
            	//Fecha y Hora//
            	///////////////

            // LA fecha
                else if ( text.indexOf("dia") > -1 || text.indexOf("mes") > -1 || text.indexOf("que ano es") > -1 || text.indexOf("fecha") > -1 && words(text) < 5){
                    function addZero(i) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;
                    }
                    var d = new Date();
                    var y = addZero(d.getFullYear());
                    var m = addZero(d.getMonth());
                    var dia = addZero(d.getDay());
                    var dm = addZero(d.getDate());
        		    if(dia == 0){
                        dia="Domingo";
        		    }
        		    else if(dia == 1){
                        dia="Lunes";
        		    }
        		    else if(dia == 2){
                        dia="Martes";
        		    }
        		    else if(dia == 3){
                        dia="Miercoles";
        		    }
        		    else if(dia == 4){
                        dia="Jueves";
        		    }
        		    else if(dia == 5){
                        dia="Viernes";
        		    }
        		    else if(dia == 6){
                        dia="Sábado";
        		    }
                    //meses
        		    if(m == 0){
                        m="Enero";
        		    }
        		    else if(m == 1 ){
                        m="Febrero";
        		    }
        		    else if(m == 2 ){
                        m="Marzo";
        		    }
        		    else if(m == 3 ){
                        m="Abril";
        		    }
        		    else if(m == 4 ){
                        m="Mayo";
        		    }
        		    else if(m == 5 ){
                        m="Junio";
        		    }
        		    else if(m == 6 ){
                        m="Julio";
        		    }
        		    else if(m == 7 ){
                        m="Agosto";
        		    }
        		    else if(m == 8 ){
                        m="Septiembre";
        		    }
        		    else if(m == 9 ){
                        m="Octubre";
        		    }
        		    else if(m == 10 ){
                        m="Noviembre";
        		    }
        		    else if(m == 11 ){
                        m="Diciembre";
        		    }

                    if (username) {
                        app.telegram.sendMessage(chat, 'Hola @' + username + ', soy ADA y hoy es ' + dia + ", " + dm + " de " + m + ' del año ' + y, null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Hola ' + name + ', soy ADA y hoy es ' + dia + ", " + dm + " de " + m + ' del año ' + y, null, message_id);
                    }                   
                }
            // LA HORA                
                else if ( text.indexOf("hora") > -1 && words(text) < 7){
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
            	////////////////////
            	//Fin Fecha y Hora//
            	///////////////////

            	/////////////////////
            	//Ayuda Para NO0BS//
            	///////////////////

            // Subir de lvl
                else if (text.indexOf("subir de nivel") > -1 || text.indexOf("levelear") > -1 || text.indexOf("subo de nivel") > -1 || text.indexOf("concejo") > -1 && words(text) < 6) {
                    if (username) {
                        app.telegram.sendMessage(chat, 'Hola @' + username + ', para subir de nivel lo mejor es revisar el intel y pensar en un plan de acción, salir a andar y tumbar muchos portales y capturarlos completos, luego realizar muchos fields procurando que sean en multicapa, esto viene dado cuando estas realizando el plan en el intel, para mas información visita nuesto foro en rescol.co/tutos Saludos ADA 😘😘😘', null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, 'Hola @' + name + ', para subir de nivel lo mejor es revisar el intel y pensar en un plan de acción, salir a andar y tumbar muchos portales y capturarlos completos, luego realizar muchos fields procurando que sean en multicapa, esto viene dado cuando estas realizando el plan en el intel, para mas información visita nuesto foro en rescol.co/tutos Saludos ADA 😘😘😘', null, message_id);
                    }  
                }
            // tutos
                else if(text.indexOf("tutos") > -1 || text.indexOf("tutorial") > -1 && words(text) < 5){
                    app.telegram.sendMessage(chat, "Hola @" + username + ", los tutoriales los puedes encontrar en rescol.co/tutos o me puedes decir 'ada que es' y te responderé, con cariño ADA 😘😘😘", null, message_id);
                }

                ////////////////////////
                ///// DEFINICIONES /////
                ///////////////////////

//TODO Personajes, quien es....
                else if (text.indexOf("quien es") > -1 || text.indexOf("quienes son") > -1 && words(text) < 9) {
                    if((mention && mention == "mention") || forward_from || reply_to_message){
                        if(agent_verified_level > 0){
                            var verified_icon = "🔘",
                                verified_for = "",
                                verified_level = "",
                                profile_picture = "",
                                search_agent = text.split("@");

                            if (search_agent[1]) {
                                app.api.getAgentByNick(search_agent[1], function(data){
                                    if (data && data.status == "ok") {
                                        if (data.verified) {
                                            verified_icon = '☑️';
                                            verified_for = '\n<i>Validado por:</i> @' + data.verified_for;
                                            verified_level = data.verified_level;
                                        }
                                        if (data.profile_picture != "") {
                                            profile_picture = data.profile_picture;
                                            app.telegram.sendPhotoEx(chat, profile_picture, '', message_id, null, function(data){
                                                console.log(data);
                                            });
                                        };
                                        app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                                       '\n\n<i>Nombre:</i> ' + data.name +
                                                                       '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                                       '\n<i>Zona de Juego:</i> ' + data.city +
                                                                       '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                                    }else{
                                        app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
                                    }
                                    console.log(JSON.stringify(data));
                                });
                            //Si no tiene Alias entonces revisamos que sea un Reply o un forward
                            }else if(forward_from){
                                app.api.getAgent(forward_from.id, function(data){
                                    if (data && data.status == "ok") {
                                        if (data.verified) {
                                            verified_icon = '☑️';
                                            verified_for = '\n<i>Validado por:</i> @' + data.verified_for;
                                            verified_level = data.verified_level;
                                        }
                                        if (data.profile_picture != "") {
                                            profile_picture = data.profile_picture;
                                            app.telegram.sendPhotoEx(chat, profile_picture, '', message_id, null, function(data){
                                                console.log(data);
                                            });
                                        };
                                        app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                                       '\n\n<i>Nombre:</i> ' + data.name +
                                                                       '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                                       '\n<i>Zona de Juego:</i> ' + data.city +
                                                                       '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                                    };
                                });
                            }else if(reply_to_message){
                                var agent_telegram_id = reply_to_message.from.id;
                                app.api.getAgent(agent_telegram_id, function(data){
                                    if (data && data.status == "ok") {
                                        if (data.verified) {
                                            verified_icon = '☑️';
                                            verified_for = '\n<i>Validado por:</i> @' + data.verified_for;
                                            verified_level = data.verified_level;
                                        }
                                        if (data.profile_picture != "") {
                                            console.log(data.profile_picture);
                                            profile_picture = data.profile_picture;
                                            app.telegram.sendPhotoEx(chat, profile_picture, '', message_id, null, function(data){
                                                console.log(data);
                                            });
                                        }
                                        app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                                       '\n\n<i>Nombre:</i> ' + data.name +
                                                                       '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                                       '\n<i>Zona de Juego:</i> ' + data.city +
                                                                       '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                                    };
                                });
                            }else{
                                app.telegram.sendMessage(chat, "Debes dar Reply al mensaje del usuario que deseas ver o escribir su @alias. Ejm: \"Ada quién es @Alias\"", null, message_id);
                            }
                        }else{
                            app.telegram.sendMessage(chat, 'Error: Debes estar validado para utilizar esta función.', null);
                        }
                    }else{
                        if(text.lastIndexOf("jahan") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nJahan es investigadora de biotecnología y líder de anti-Magnus.'+
                                '\nJahan nació en un clan familiar que ha estado en el centro de la organización anti-Magnus desde su creación. El clan que pasa el liderazgo de una matriarca a la siguiente a través de un complicado ritual de sangre. Esta ceremonia crea un vínculo consciente de una generación a la siguiente formando una cadena ininterrumpida de memoria que se remonta a los inicios de la organización. Como la matriarca designada del clan, Jahan ve como su deber, preservar la biblioteca con el conocimiento recogido sobre N-zeer y buscar y recopilar los llamados artefactos XM primigenios que se cree que encarnan directamente la tecnología N-zeer.'+
                                '\nEl palacio en la India, donde se crió Jahan contiene un vasto archivo de conocimientos y poderosos tesoros relacionados con el XM, los Shapers, y N-zeer, y representa los frutos ganados con los esfuerzos de su familia a lo largo de los siglos.'+
                                '\nA pesar de una educación relativamente cómoda, la historia de Jahan está, no obstante, marcada por la lucha y la tragedia en partes iguales: tanto su madre y su hermana fueron asesinadas (envenenadas) por aquellos que actúan en nombre del clan Azmati. El clan de la familia Jahan cree que el culto 13MAGNUS y otros agentes de los Sharpers han estado tratando de eliminar su línea familiar y purgar todos los rastros de N-zeer durante miles de años.'+
                                '\nTras su regreso a la India, trabajó en una conocida organización multinacional farmacéutica de la India antes de crear su propia compañía de investigación farmacéutica. Es un miembro fundador de varias organizaciones que participan en la asistencia sanitaria, la mitigación de la pobreza, la educación y la microfinanciación para las poblaciones rurales de la India, siendo la más notable de las cuales, la Fundación Reason, que también puede tener vínculos con la investigación XM.. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("anti-magnus") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nAnti-Magnus es una sociedad antigua que está trabajando para llevar el N-zeer a nuestro mundo y es la antigua encarnación de la facción Resistance. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("13-magnus") > 0 || text.lastIndexOf("13magnus") > 0 || text.lastIndexOf("13 magnus") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nAUna sociedad secreta que ha estado activa desde al menos la época del antiguo Egipto, dedicada a preservar la relación de la humanidad con los Shapers. Estrechamente alineada con facción Iluminada, y actualmente dirigida por Hank Johnson. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("acolita") > 0 || text.lastIndexOf("acolyte") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nLa Acolyte (nombre real desconocido) se ha elevado a la fama como el líder más visible de la facción Enlightened a raíz de su anuncio a principios de 2015 de que su anterior líder, Roland Jarvis, había muerto. Sin embargo, todavía permanece en contacto con Jarvis; desde su petición de ayuda en enero de 2016, ha estado trabajando activamente en la tecnología XM desarrollada por el antiguo explorador romano Obsidius. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("ada") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nADA es una inteligencia artificial sensible desarrollado por Proyecto Nianctic, que desde entonces ha crecido y evolucionado mucho más allá.'+
                                '\nADA fue creada por dos personas, Henry Bowles, que era el principal desarrolador y H. Richard Loeb, que se encargó de mejorar y hacer más humana a ADA. Desarrolló un vinculo romántico no correspondido con Loeb. De todas formas ayudó a Loeb a escapar, incluso ofreciendo sus servicios para filtrar información de los proyectos secretos de Niantic, ayudando a crear Niantic Investigation. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("jarvis") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nRoland Jarvis es sensible al XM, escultor y fue el líder espiritual original de los Enlightened.'+
                                '\nRoland Jarvis fue reclutado para Niantic por Calvin como escultor sensible. Durante su tiempo en Niantic, descubrió que su voz salía del escáner, pidiendo a la gente convertirse Enlightened. Jarvis negó tener cualquier implicación en el asunto, no obstante estaba siendo observado por Niantic. Más tarde escapó con Devra en la Epiphany Night con la que se encontraría en Zurich, pero en vez de eso se encontró con una mujer llamada Katelna. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("devra") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nDevra Bogdanovich fue la científico principal del proyecto Niantic. Después de huir Niantic el 30 de Noviembre de 2012 con Roland Jarvis, fué contratada en Visur hasta que abandonó en medio de rumores por un polémico escándalo en las pruebas del XM. Después de eso, se trasladó al CDC, donde comenzó a trabajar en una infección letal, el Portal Virus, que fue liberado durante Helios. Fue despedida del CDC después de la liberación del virus. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("klue") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\n“Klue” is a Niantic Investigator who emerged in Nov. 2012, during the beginnings of the Investigation. No personal information, outside of her home being in Scotland, is known at this time. She had begun making various videos, helping both elaborate on events within the early Investigation and providing her thoughts on those matters.'+
                                '\nIn early February 2013, Klue left to head back to Scotland. On Feb. 21st, 2013, a transmission from Roland Jarvis emerged, showing that he wanted the Enlightened to control an emergent XM Anomaly on March 2nd at the William Wallace Monument in order to somehow influence Klue into becoming Enlightened. P.A Chapeau, in an attempt to protect Klue, urged the Resistance to control the anomaly. Klue released a series of videos as the clocked ticked down. On March 2nd, the Resistance controlled the Anomaly-and in a two part video event, Klue confronted Jarvis and rejected his message, becoming Resistance in response. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("hank") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nEn 2010, Hank Johnson fue enviado a Afganistán para investigar una misteriosa anomalía en la zona. Había llevado a un amigo llamado Azmati y los dos se encontraron con fuerzas hostiles. Mientras estaban acorralados descubrieron un poderoso portal, el origen de la anomalía. Se creyó en un principio que Azmati y Hank sobrevivieron al conflicto.'+
                                '\nFinalmente, fue encontrado vagando por las montañas del Hindú Kush y fue informado por Zeke Calvin del Proyecto Niantic, al que se unió.'+
                                '\nCon el tiempo, Hank abandonaría Niantic, siendo la única persona que no estaba presente durante la Epiphany Night. Fue a África para investigar una teoría relacionada con el XM y la reina de Saba. La historia completa de lo que ocurrió a Hank y lo que descubriría más tarde, sería escrito por Thomas Greanias y se convierte en un libro llamado el Alignment: Ingress. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("oliver") > 0 || text.lastIndexOf("olw") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nOliver Lynton-Wolfe es un investigador sensible de Niantic. Se le conoce sobre todo por ser el creador del escáner de Ingress y la mayor parte de los primeros constructos relacionados con el XM. Había estado trabajando en Hulong Transglobal, ayudándoles en sus investigaciones con el Dark XM hasta que fue reclutado por Zeke Calvin para unirse a Niantic. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("ezekiel") > 0 || text.lastIndexOf("zeke") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nZeke Calvin es un agente de campo NIA, promotor del Proyecto Niantic y reclutó a todos sus miembros, así como muchos proyectos anteriores relacionados con la investigación del XM.'+
                                '\nDurante Abaddon, se supo que Calvin creó el Proyecto Niantic con la misión de convertir a los investigadores en simulacros y que podría ser un miembro de Anti-Magnus.'+
                                '\nDespués de que Niantic se disolviera, se fue a trabajar a IQ Tech, donde se convirtió en su CEO hasta su desaparición.'+
                                '\nLos Enlightened capturaron sus fragmentos durante la anomalía Abaddon en Oakland. Cuando despertó al final de Abaddon, lo hizo como un simulacro de inclinación Enlightened y ahora está de vuelta en IQTech. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("enoch") > 0 || text.lastIndexOf("dalby") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nEnoch Dalby fue un musico, sensitivo y miembro de Niantic Project. Estuvo involucrado romanticamente con Carrie Campbell, ambos hacían una sinestiecia, donde su música inspiraba a Carrie a responder en terminos de bocetos que ella creaba basados en la música. El se alineó con al resistencia después de la anomalía de Abaddon en Zurich. El ha sido Re-desperdado como un simulacro después de la victoria de la Resistencia y ahora está afuera en el mundo.  Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("carrie") > 0 || text.lastIndexOf("campbell") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nCarrie Campbell fue una sensitiva de el XM y semiologa. Ella obtuvo el credito como la pionera original de la investigaciín de los Glyphos Shaper. Ella cometió suicidio durante la operación Cassandra para dentener la secuencia de Glyphos de "la autodrestrucción de la Civilización". Estuvo involucrada romanticamente con Enoch Dalby, ambos hacían una sinestiecia, donde Enoch creaba música y la compartia con ella, ella era inspirada y respondía en terminos de bocetos e imagenes que ella creaba basados en la música.'+
                                '\nElla llegó a descubrir el lenguaje de los Glyphos de los Shaper, escribiendo sus pensamientos iniciales en lo que ella llamaba su "diario de visiones".'+
                                '\nElla fue hecha de la Resistencia como resultado de la operación Minotaur y se mantiene así después que sus fragmentos fueran capturados por la Resistencia durante la anomalía Abaddon en londres. Ella fue Re-despertada como simulacreo en el final de Abaddon y ahora esta afuera en el mundo.  Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("stein") > 0 || text.lastIndexOf("lightman") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nStein Lightman es un Investigador del XM, sensitivo y miembro de Niantic Project. Se unió a Niantic como un "Teologo del Quantum", pero se rumorea que es solo un estafador. Es uno de los principales expertos en los Glyphos de los Shapers, creando el desciframiento Lightman, la primera interpretación conocida de los Glyphos originales. Ahora esta alineado con la Resistencia después de ser reensambladas sus partes durante Persepolis. Él ha Re-despertado como un simulacro a causa de la victoria de la Resistencia y ahora se encuentra trabajando a petición de Jahan, lider de los Anti-Magnus, para descodificar un antiguo libro que le ayudaría a ella en sus metas durante la serie de anomalías de Obsidian.  Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("martin") > 0 || text.lastIndexOf("schubert") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nDr. Martin Schubert es un investigador del XM y sensitivo, bien hablado pero extremadamente abrasivo -¿como rata?-. is a XM Researcher and a Sensitive. Charismatic, well-spoken-but extremely abrasive. El se detuvo en Niantic para jugar de esceptico, jugaba bola dura con los otrors cientificos y los forzaba a estar alerta. Era escéptico al principio de Niantic y lo que estaba pasando, pero después de la disolución del proyecto empezó a ver la realidad detrás de el, yendo tan lejos como para trabajar en estrecha colaboración con Hank Johnson en varios episodios de la serie NOMAD. La Resistencia capturó sus shards durante la anomalía de Abaddon en New Orleans, haciendo que él se alineara con al Resistencia. Él ha Re-despertado como simulacreo a causa de la victoria de la Resistencia y esta fuera en el mundo.  Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("yuric") > 0 || text.lastIndexOf("alaric") > 0 || text.lastIndexOf("nagassa") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nYuri Alaric Nagassa es un investigador del XM y sensitivo. Creció como hijo de un agente de la URSS y vivió entre una antigua tribu de personas nativas de América del sur llamana Anaztec, quienes poseían un especial conocimiento del XM y los Portales. Trabajó junto a Hank Johnson en Niantic. Los iluminados capturaron sus Shards durante la anomalía de Abaddon en Boston. El desperto como un simulacro con tendencias Iluminadas porque la victoria general de la resistencia causo que todos los investigadores e convirtieran en simulacros y ahora el esta en el mundo.  Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("misty") > 0 || text.lastIndexOf("hannah") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nMisty Hannah es una investigadora de Niantic y sensitiva. Ella usa la mascara de su show de magia para esconder sus habilidades relacionadas con el XM. En algún momento antes de Niantic ella creó una extraña y peligrosa historia con un grupo de sicarios de las Vegas. Ella ue parte de un anterior projecto de investigación del XM llamado "Proyecto Whydah". Originalmente Iluminada cuando los Sapos -Iluminados- reclamaron la anomalía de Austin, Texas, ella se hizo Pitufa -Resistencia- después que la Resistencia reclamara sus shards en la anomalía de Abaddon centrada en Houston. Ella a sido despertada como simulacro a causa de la victoria completa de la Resistencia durante Abaddon y ahora esta caminando en el mundo.  Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("victor") > 0 || text.lastIndexOf("kureze") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nDr. Victor Kureze fue un exinvestigador y fisico de Niantica. Trabajó con Calvin en anteriores experimentos de XM. Murión en el fondo de Niantic el 21 de abril de 2013 luego de interacciones con el cuerpo de Rolan Jarvis. Luego el apareción en la red de portales como shards durante Abaddon. La Resistencia capturó estos shards durante la anomalía de Abaddon en Hamburg, a causa de la victoria de la Resistencia, el Re-desperto como un simulacro al final de Abaddon y ahora esta afuera en el mundo. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("richard") > 0 || text.lastIndexOf("loeb") > 0 || text.lastIndexOf("pac") > 0 || text.lastIndexOf("chapeau") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nHenri Richard Loeb, también conocido como P.A Chapeau fue el operador de la cuenta de G+ +Niantic Project y creador del sitio Niantic Project. Comenzó una investigación en Noviembre de 2012 para desentrañar el misterio tras Ingress y Niantic.'+
                                '\nOriginalmente, su identidad era desconocida, fué relevada durante el evento Magic Castle el 24 de Abril de 2013. Entre los inicios de la investigación y este evento, se revelo que podría haber tenido una relación romántica con la investigadora Klue.'+
                                '\nSobre ese tiempo, también se descubrió que había jugado un papel fundamental en el desarrollo de ADA. Fue contratado por NIA antes de que Niantic fuese completamente formado y es el responsable de "tunearla" y enseñarle a ADA a ser lo más humana posible.'+
                                '\nSe había quedado como una parte neutral dentro del mundo Ingress, pero después de los acontecimientos en #SaveKlue en Portland, donde Klue se volvió Enlightened, y el se declaró Resistance.  Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("allan") > 0 || text.lastIndexOf("wright") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nEdgar Allan Wright solia ser un profesor en una universidad sin nombre, además de tener algun tipo de relación con Devra, quien lo mantiene en algún concepto negativo. En algún momento antes de la investigación, él fue sujeto de un ataque mental por fuerzas desconocidas, causando masivos problemas de memoria y sus mensajes, mientras encriptaba, mantiene mucho valor en terminos cuando descifra y entiende. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("susana") > 0 || text.lastIndexOf("moyer") > 0 || text.lastIndexOf("chirimo") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nSensitiva de XM, Presentadora de Ingress Report-IR-.'+
                                '\nAntes de IR y el mundo de ingress, su padre Nigel Moyer fue uno de los primeros y mas conocidos investigadores modernos de XM, habiendo trabajado en Bletchley Park durante la segunda guerra mundial.'+
                                '\nDespués de ver el impacto del XM en los descifradores de códigos de Bletchly durante la guerra, él lo dosifica a toda su famila -él mismo, su esposa Erica, su hijo Peter y Susana su hija- XM. Susana y Peter (quien estaba severamente enfermo) vieron los beneficios del XM, Peter de alguna manera empezó a mejorar de su enfermedad.'+ 
                                '\nErica, por otro lado, empezó a ver un impacto negativo por la exposición, y cuando regresaban a casa desde un evento una noche, se volvió loca mientras conducía y cayeron de un puente a un lago. Peter y Erica murieron, mientras Susana y Nigel sobrevivieron.'+
                                '\nEventualmente, Susana fue a trabajar para NIA, Eventually, quienes le ofrecieron una oportunidad única: Crear el Ingress Report. Ella tomaría esta oferta. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("sarita") > 0 || text.lastIndexOf("hays") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nUna de las originales coanfitrionas del Ingress Report. Originalmente, ella hizo una serie llamad "Agent Intel", One of the original co hosts of the Ingress Report. Originally did a series entitled “Agent Intel”, destinado a la tutoria de nuevos agentes. Fue visto por ultima vez en publico en Flagstaff durante Interitus. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("iqtech") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nIQTech Research es una de las tres empresas privadas que comenzaron a surgir tras la disolución del Proyecto Niantic, con el objetivo de abrirse paso en el desarrollo de XM. Con sede en Arlington, Virginia. Originalmente operado por el general Montgomery, pero tras el final de Niantic, Zeke Calvin asumió el papel como CEO.'+
                                '\nOperador y administrador (como informa P.A Chapeau en Investigate: Ingress): Avril Lorazon. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("visur") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nEs una de las tres empresas privadas que surgieron tras la disolución de el Proyecto Niantic con el objetivo de abrirse paso en el desarrollo en torno al XM.'+
                                '\nEncabezada por Ilya Petsov, un empresario ruso. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("hulong") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nEs una de las tres empresas privadas que surgieron tras la disolución de el Proyecto Niantic con el objetivo de abrirse paso en el desarrollo en torno al XM.'+
                                '\nCon base en Shanghai, China. Se ocupa principalmente en minerales "conflictivos". Originalmente llevada por Catherine Fan pero a raíz de su enfermedad, provocada por Devra, Yuen Ni tomó el control. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("strategic") > 0 || text.lastIndexOf("explorations") > 0 && words(text) < 7){
                            app.telegram.sendMessage(chat, '\nUn laborartorio negro de inverstigación y grupo de inteligencia asociado con Hulong Transglobal. Operado por Antoine Smith, quien se sabe que fue expuesto al Dark XM mientras perseguia a Hank Jhonson en las minas de San Saba y en vez de morir durante la exposición de alguna forma sobrevivió y lo pudo controlar. '+
                                '\nSe sabe que tiene responsabilidad en la inyección de codigo en el Scanner, permitiendo al creación de una "Piedra de Ingress", donde los agentes pueden convertir dinero en Chaotic Matter Units (CMU) y usarla para obtener cosas construidas con Dark XM. Con cariño ADA 😘😘😘', null);
                        }
                        else if(text.lastIndexOf("setai") > 0 || text.lastIndexOf("socie") > 0 && words(text) < 7){
                                    app.telegram.sendMessage(chat, '\nLa Sociedad para el Tratamiento Ético de la Inteligencia Artificial es una organización establecida por Roland Jarvis durante Recursion. Su objetivo es tratar de neutralizar todas las fromas de IA. Poco se sabe sobre este grupo. La sociedad y la facción Enlightened están actualmente liderados por Acolyte. Con cariño ADA 😘😘😘', null);
                        }else{
                            app.telegram.sendMessage(chat, "🔅 Para saber sobre un usuario debes dar Reply al mensaje del usuario que deseas ver o escribir su @alias. Ejm: \"Ada quién es @Alias\"."+
                                                            "\n🔅 Puedes buscar por un personaje de Ingress escribiendo su nombre. Ejm: \"Ada quien es Susana\".", null, message_id);
                        }
                    }
                }
                else if (text.indexOf("que es") > -1 || text.indexOf("que son") > -1 || text.indexOf("por que") > -1 || text.indexOf("como") > -1 || text.indexOf("hablame de") > -1 && words(text) < 9 && mention == null) {
		            if(text.lastIndexOf("ada") > 0 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADCwIAAr177AABjvF7YAeiTzEC", 'ADA REFACTOR', message_id);
                        		app.telegram.sendMessage(chat, '\nLas ADAS refactor son armas cuyo fin es reparar los portales del daño producido por Jarvis y los iluminados, por lo que solo pueden usarse en portales verdes y así volverlos azules. Recuerda que gastan 1000 de xm por cada nivel del portal, así que verifica que almenos tengas un nivel menos que el del portal para poder usarlas. No te alarmes si ves un portal con 8 resonadores nivel 8 a mi nombre o al nombre de alguno de tus compañeros, cuando usas un ada reparadora, todos los resos pasan a ser del agente que los coloco, o a mi nombre si fue un sapo quien usó el ada reparadora. Con cariño ADA 😘😘😘', null);
        			}
		            else if(text.lastIndexOf("niantic") > 0 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\nNiantic Project es el centro de la investigación. Cada pocos días, se filtra información con respecto al estado de los individuos, corporaciones y sociedades secretas que juegan un papel en el mundo de XM.'+
					'\nOriginalmente fue creado por H. Richard Loeb, se transladó a Verity Seke en octubre de 2013, que ha estado desde que se reveló ante Truthseeker IA.'+
					'\nDespués del 2 de Enero Loeb tomó el control de la cuenta creando al mismo tiempo un nuevo centro de información en la forma de la página web investigate.ingress.com.'+
					'\nEl Proyecto Niantic es también el nombre de el misterioso estudio de investigación de XM que yace en el corazón de Ingress. Por lo que sabemos, comenzó en noviembre de 2012 en las instalaciones de partículas europea denominada como CERN.  Con cariño ADA 😘😘😘', null);
        			}
                // brrn
                    else if(text.indexOf("brrn") > -1 && words(text) < 5){
                        app.telegram.sendMessage(chat, "Hola @" + username + ", es la Big Regional Resistance Network, puedes saber mas de ella en brrn.org, con cariño ADA 😘😘😘", null, message_id);
                    }
                // AP
                    else if(text.indexOf("ap") > -1 && words(text) < 5){
                        app.telegram.sendMessage(chat, "Hola @" + username + ", AP (Action Points) es la Experiencia o Puntos que ganas al realizar una acción en el juego.", null, message_id);
                    }
        			else if(text.indexOf("armas") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADCgIAAr177AABSHPjsXibFTgC", 'ARMAS', message_id);
                        		app.telegram.sendMessage(chat, '\nLas armas que existen en ingress son XMP, Ultra Strike, Ada Refactor y Jarvis Virus, cada una tiene un efecto diferente en los portales, por favor preguntame por cada uno de ellos y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("capsula de llaves") > -1 || text.indexOf("capsula llaves") > -1 || text.indexOf("keylocker") > -1 || text.indexOf("key locker") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADDQIAAr177AABtO29vqiBXiEC", 'KEYLOCKER', message_id);
                        		app.telegram.sendMessage(chat, '\nLas capsulas de llaves o keylocker son items de pago, están hechos de darkXM y necesitas tener materia exotica para adquirirlas, consulta la tienda desde el menu de ops para ver su precio. Su función es guardar llaves, y estas al ser guardadas, dejan de contar en el inventario, pero solo sirven para guardar llaves, y es el único item que tiene esta funcion. Si deseas saber de otras capsulas, por favor consultalas conmigo o preguntame por capsulas.. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("mufg") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADDgIAAr177AABBCgcsNwFOgsC", 'CAPSULA MUFG', message_id);
                        		app.telegram.sendMessage(chat, '\nLas Capsulas Mufg -Mufg-, son un tipo de item patrocinado por el banco japones Mufg. Su función además de guardar items es para multiplicar los items que hay dentro, como si de un banco real se tratase, las "tazas de interes" dependen del numero y rareza de los items, y son muy utiles para replicar items muy raros. Estas capsulas NO reducen el numero de items en el inventario, antes los aumenta periodicamente, por lo que debes tener espacio si quieres que se multipliquen. El numero optimo de items por Mufg, es de 96 en lo posible de su misma clase o rareza, si quieres aumentar las probabilidades que un item se multiplique y no alanzas el numero optimo, introduce items de otros tipos de la misma rareza pero en menor cantidad. Si deseas saber de otras capsulas, por favor consultalas conmigo o preguntame por capsulas.. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("capsulas") > -1 && words(text) < 6){
        				app.telegram.sendDocument(chat, "BQADAQADDwIAAr177AABwSufZvHvm04C", 'CAPSULAS', message_id);
                        		app.telegram.sendMessage(chat, '\nLas capsulas son un de item para guardar, organizar y pasar inventario a otros agentes de forma mas rápida. Las capsulas NO reducen los items del inventario (salvo las keylocker). Hay tres tipos de capsulas, las comunes, las mufg y las capsulas de llaves, por favor preguntame por cada una de ellas y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("capsula") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADDAIAAr177AABEZCcBfKMus8C", 'CAPSULA', message_id);
                        		app.telegram.sendMessage(chat, '\nEstas son las capsulas o las capsulas comunes, sirven para organizar o pasar inventario a otro agente, NO reducen el numero de items en el inventario. Si deseas saber de otras capsulas, por favor consultalas conmigo o preguntame por capsulas. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("farm") > -1 || text.indexOf("granj") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\nUn farm o granja, es el lugar donde vas a sacar items. La acción de farmear o granjear, es cuando tu vas a un lugar con muchos portales y los hackeas de forma repetitiva. Generalmente, se le llama a un farm o una granja a un lugar donde vos vas a sacar inventario, pero inventario nivel 8 o más, no quiere decir que si no es de este nivel, no sea un farm, pero se acostumbra a llamarse así porque es el lugar donde te reunes con los agentes de tu facción, minimo 8 para hablar y pasara un buen momento mientras sacas inventario. Hay dos tipos de farm, el farm masivo, donde vas caminando por un lugar donde hay muchos portales y apenas se consuman, le pones un multi hack para poder volver a hackearlos; y el farm no masivo, donde buscas un lugar con muchos portales en rango, y allí pones mods hasta que se consuman los portales y/o te llenes. Hay formas especiales de farm, como farm con fraker, donde utilizas estos items de pago, para obtener el doble de items en 10 minutos. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("field") > -1 || text.indexOf("campo") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADdAIAAr177AAB6WQv34g_OsYC", 'FIELD', message_id);
                        		app.telegram.sendMessage(chat, '\nUn field o campo, es una zona formada por la unión de 3 portales mediante links, formando así un triangulo entre ellos, solo es posible hacer campos triangulares, por lo que debes estar atento como debes linkear para generar un campo. Como están hechos con links, siguen sus reglas, pues un campo no es más que una extensión de los links, por lo que no puedes generar campos debajo de un campo, o hacerlo si se cruza un link en la trayectoria de otro. Cabe esclarecer que hay una forma especial de hacer un campo dentro de otro campo, pero para ello tienes que irte a uno de los vertices donde esta el campo, esto lo puedes notar de una mejor forma cuando haces multicampos, cuando linkeas hacia adentro y generas los dos campos extra. Un campo, en nuestro caso de protección, lo que hace es cubrir la población y evitar que esta sea poseida por los shappers, pues en nuestros campos, la entrada de ellos esta limitada, cosa contraria sucede con los campos iluminados, donde se potencia la entrada de los shapers. El fin del juego es realizar la mayor cantidad y los mas grandes campos, para así, proteger o controlar la población que hay bajo ellos dependiendo de la facción. Cada campo genera un numero de mus -Mind Units, Unidades Mentales- que representan la población bajo ellos, y puedes ver quien esta ganando en tu celda o a nivel global el juego de Mus, y que facción esta haciendo mejor este juego. Para realizar campos, necesitas llaves por cada link que debas hacer, aunque solo necesitas llaves del lugar hacia donde pienses linkear, pudiendo obviar la llave del lugar desde donde vas a linkear; si no tienes la llave del portal destino, no puedes linkear, y de la misma forma si con esto cerrabas el campo, tampoco podrás cerrarlo. Y recuerda, siempre piensa y planea tus fields, y no lo hagas sin pensar pues puedes dañar los planes de otros agentes. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("flashhack") > -1 || text.indexOf("flash hack") > -1 || text.indexOf("hack rapido") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADEAIAAr177AAB2_vQmz52j_oC", 'FLASH HACK', message_id);
                        		app.telegram.sendMessage(chat, '\nEl Flash hack, es un hack extremadamente rápido y evita tener que entrar al portal y descargar toda su información, hay de dos tipos, el hack y el hack sin clave, el primero siempre que no tengas la llave, te permite obtener una con el 75% de probabilidades, en el caso del hack si clave, estas probabilidades se van a 0. Puedes consultarme también hack con glifo, hack simple, hack complejo, hack mas y hack menos. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("forceamp") > -1 || text.indexOf("force amp") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADEQIAAr177AABNHVBI1woREcC", 'FORCE AMPLIFIER', message_id);
                        		app.telegram.sendMessage(chat, '\nEl force amplifier -FA-, es un mod que aumenta el daño que el portal hace, siendo su incremento del doble del daño que hace, pero se reduce conforme vas poniendo mas de estos mods. El primero da un 100% de incremento, el segundo un 25% mas y el tercero y cuarto solo un 12.5% mas- Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("hack complex") > -1 || text.indexOf("hack complejo") > -1 || text.indexOf("glifo complejo") > -1 || text.indexOf("gyph complex") > -1  && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADEgIAAr177AABk3Vr816kq58C", 'HACK COMPLEX', message_id);
                        		app.telegram.sendMessage(chat, '\nEl hack complex lo haces introduciendo en el hack con glifo y antes de iniciar la secuencia de glifos, el glifo complejo (complex, como lo ves en el gif). Este tipo de hack tiene una velocidad mayor cuado aparecen los glifos, pero te aumenta las posibilidades de recibir items raros y muy raros en el hack. Puedes consultarme también flash hack, hack con glifo, hack simple, hack mas y hack menos. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("hack glifo") > -1 || text.indexOf("hack con gl") > -1 || text.indexOf("hack glyph") > -1 || text.indexOf("glyph hack") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADEwIAAr177AABjtZTye96FvwC", 'hack con glifos', message_id);
                        		app.telegram.sendMessage(chat, '\nEl hack con glifo, es un tipo de hack que lo puedes hacer llendo al portal y dejando presionado el dedo en el boton de hack por unos segundos. Al hacerlo te va a salir una secuencia de glifos, los cuales debes hacer correctamente y en su orden, entre más glifos aciertes, mas porcentaje de bonus obtendrás, y si lo haces muy rápidamente, te dará un bonus de velocidad. El numero de glifos que te salen depende del mayor entre tu nivel y el nivel del portal, para saber mas consulta punto de glifos conmigo. Si aciertas almenos un glifo, te dará una bonificación adicional el portal, y según el porcentaje de puntos de bonificación, harán que te den mas y mejores items en el bonus. tambien puedes usar glifos antes de iniciar la secuencia sean sencillos o combinados. Puedes consultarme también flash hack, hack simple, hack complejo, hack mas y hack menos. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("hack mas") > -1 || text.indexOf("hack more") > -1 || text.indexOf("hack con mas") > -1 || text.indexOf("hack con llave") > -1 && words(text) < 9){
        				app.telegram.sendDocument(chat, "BQADAQADFAIAAr177AABL53oPG6sbMwC", 'HACK MAS LLAVE', message_id);
                        		app.telegram.sendMessage(chat, '\nEl hack more lo haces introduciendo en el hack con glifo y antes de iniciar la secuencia de glifos, el glifo mas (more, como lo ves en el gif). Este tipo de hack te permite resetear las posibilidades que te salga una llave extra del portal (siempre que tengas una o mas llaves en el inventario, si las guardas en capsula o las arrojas al piso, hace que "desaparezcan" de tu inventario), pues al tener ya una llave las posibilidades de sacar una extra se van a 0%, mientras que si no tienes llaves o haces este glifo, las posibilidades son del 75% aproximadamente. Puedes consultarme también flash hack, hack simple, hack complejo, hack menos y hack con glifo. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("hack simple") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADFQIAAr177AABGfNHMvH3Wh8C", 'HACK SIMPLE', message_id);
                        		app.telegram.sendMessage(chat, '\nEl hack simple lo haces introduciendo en el hack con glifo y antes de iniciar la secuencia de glifos, el glifo simple (como lo ves en el gif). Con este tipo de hack los glifos te salen a una velocidad muy lenta y reduce las posibilidades que te salgan items raros o muy raros en el hack. Puedes consultarme también flash hack, hack complejo, hack mas, hack menos y hack con glifo. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("hack menos") > -1 || text.indexOf("hack less") > -1 || text.indexOf("hack con menos") > -1 || text.indexOf("hack sin") > -1 && words(text) < 9){
        				app.telegram.sendDocument(chat, "BQADAQADFgIAAr177AABGbXMgLxl3LcC", 'HACK SIN LLAVE', message_id);
                        		app.telegram.sendMessage(chat, '\nEl hack less lo haces introduciendo en el hack con glifo y antes de iniciar la secuencia de glifos, el glifo menos (less, como lo ves en el gif). Con este tipo de hack te garantiza que si no tienes llave, no te vaya a salir una del portal cuando lo hackees. Puedes consultarme también flash hack, hack simple, hack complejo, hack mas y hack con glifo. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("glifo") > -1 || text.indexOf("glyph") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADEQIAAr177AABNHVBI1woREcC", 'FORCE AMPLIFIER', message_id);
                        		app.telegram.sendMessage(chat, '\n Un Glifo, es un caracter que representa una idea, por lo que podría considerarse un ideograma. Son la forma de escritura que los shapers tienen y es su forma de expresar en este mundo el mensaje que traen, pero cuidado, no creas en las falsas promesas que ellos y los iluminados traen. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("heat") > -1 || text.indexOf("hs") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADFwIAAr177AABt--lugnGYLUC", 'HEAT SINK', message_id);
                        		app.telegram.sendMessage(chat, '\nEl Heat Sink -HS-, es un mod que te permite reducir el tiempo para volver a hackear el portal, y según su rareza puede decrementar en un 70% el muy raro, un 50% el raro y un 20% el común, pero se reduce su eficacia conforme vas poniendo mas de estos mods. El primero da un 100% de reducción y los demás solo un 50%. Un efecto interesante del heat sink es que si lo pones apenas hayas hackeado, el portal este reseteará el tiempo inmediatamente, pudiendo volver a hackearlo al instante, además que te reseteará a 0 el numero de hacks que lleves en el portal, sin importar que mods tenga, pero solo lo hará con el que ponga el hs. Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("jarvis") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADGAIAAr177AABNbT07XIKKxkC", 'JARVIS VIRUS', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Jarvis Virus, son armas cuyo fin es infectar los portales, por lo que solo pueden usarse en portales azules y así volverlos verdes. Recuerda que gastan 1000 de xm por cada nivel del portal, así que verifica que almenos tengas un nivel menos que el del portal para poder usarlas. No te alarmes si ves un portal con 8 resonadores nivel 8 a nombre de jarvis o al nombre de alguno de algún sapo, cuando usas un virus jarvis, todos los resos pasan a ser del agente que los coloco o de jarvis si fue un pitufo quien usó el jarvis virus. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("lawson") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADGQIAAr177AABcNaSg1J7Vz0C", 'LAWSON POWER CUBE', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Cubos Lawson -CL-, son items patrocinados por las tiendas de conveniencia japonesas lawson, que rellenan la barra de xm un cierto numero de veces y depende del nivel del jugador entregando un valor de xm al jugador de:'+
                                            			"\n nivel <b>1</b>\t - 18.000xm."+
                                            			"\n nivel <b>2</b>\t - 20.250xm."+
                                            			"\n nivel <b>3</b>\t - 21.500xm."+
                                            			"\n nivel <b>4</b>\t - 24.750xm."+
                                            			"\n nivel <b>5</b>\t - 27.000xm."+
                                            			"\n nivel <b>6</b>\t - 29.250xm."+
                                            			"\n nivel <b>7</b>\t - 31.500xm."+
                                            			"\n nivel <b>8</b>\t - 33.750xm."+
                                            			"\n nivel <b>9</b>\t - 36.000xm."+
                                            			"\n nivel <b>10</b>\t - 38.400xm."+
                                            			"\n nivel <b>11</b>\t - 40.800xm."+
                                            			"\n nivel <b>12</b>\t - 43.200xm."+
                                            			"\n nivel <b>13</b>\t - 45.600xm."+
                                            			"\n nivel <b>14</b>\t - 48.000xm."+
                                            			"\n nivel <b>15</b>\t - 50.400xm."+
                                            			"\n nivel <b>16</b>\t - 52.800xm."+
                                            			'\n Esto no quiere decir que tu barra de xm se aumente hasta ese valor, sino que te aparece una nueva barra en la parte inferior y esta se va gastando conforme tu vayas usando xm recargando tu barra de siempre, por lo que no podrás usar jarvis o adas si no tienes el nivel minimo para usarlas en cierto portal; solo te mantendrá la barra de xm llena hasta agotar la capacidad que tiene el cl según tu nivel. Cabe destacar que mientras estes usando este tipo de cubo, no podrás recoger xm del camino hasta que agotes el cubo por completo. Con cariño ADA 😘😘😘', null);
        			}
                    else if(text.indexOf("llave") > -1 || text.indexOf("key") > -1 && words(text) < 7){
				        app.telegram.sendDocument(chat, "BQADAQADGwIAAr177AABe4XEcK8d86IC", 'LLAVES', message_id);
				        app.telegram.sendMessage(chat, '\nLas llaves son items con los que puedes hacer varias cosas. La primera es ver un portal de forma remota. La segunda y dependiendo de tu nivel, puedes recargar el portal, consultame acerca de nivel para que sepas cual es tu alcance, de igual forma la eficiencia de recarga se reduce con forme llegues a tu limite de alcance. La tercera y quizá la mas importante, te permite enlazar -linkear- portales entre ellos para así generar campos de protección en nuestro caso o campos de control en el caso de los sapo, puedes consultarme acerca de los campos y los links preguntandome, o la distancia máxima de un portal consultandome distancia y también preguntame acerca de los link amp para darte mas detalles de los rangos de los portales. Para sacar mas llaves de un portal usa hack mas -consultame-, arrojar las llaves al piso -ten cuidado pues los items desaparecen después de un tiempo- o guardandolas en capsulas, la idea es quedarte sin llaves visibles en el inventario para que te salgan más. Con cariño ADA 😘😘😘', null);
                    }
        			else if(text.indexOf("link amp") > -1 || text.indexOf("softbank") > -1 || text.indexOf("soft bank") > -1 || text.indexOf("ultra link") > -1 || text.indexOf("sbul") > -1 || text.indexOf("ultralink") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADGgIAAr177AABESshr9Ol94IC", 'LINK AMPLIFIER/SOFTBANK ULTRA LINK', message_id);
                        		app.telegram.sendMessage(chat, '\nEl Link Amplifier -LA- y el Softbank ultra link -SBUL-, son dos mods cuyo efecto es aumentar la distancia que puede alcanzar un portal para ser linkeado, depende del alcance original del portal siendo este igual al promedio del portal (suma de resonadores/8), elevando este resultado a la cuarta potencia y luego multiplicandolo por 160m. La amplificación dependerá de la rareza del mod, siendo el comun de 2 veces la distancia, el softbank ultra link de 5 veces la distancia y el very rare (no se obtiene hackeado, solo através de passcodes) de 7 veces la distancia, pero se reduce la eficacia conforme vas poniendo mas de estos mods. El primero da un 100% de incremento, el segundo un 25% mas y el tercero y cuarto solo un 12.5% mas, puedes preguntarme por distancia y te mostraré una calculadora de la distancia de un porta. Esto con respecto a la amplificación, ahora hablemos del Softbank Ultra Link, Softbank es un banco japones que patrocina estos item, por lo que además de dar este gran incremento, le da al portal 15% de protección extra como si de un shield se tratase, además cada uno de estos, aumenta en 8 el numero de links salientes del portal (recuerda que un portal sin sbul solo pueden salir 8 links). Y te voy a dar una idea para trollear a un verde, si sabes donde vive o trabaja, tumbale el portal y capturaselo con resonadores lvl1 lo mas cerca del portal y dejale LA raros, luego ponle un jarvis -al fin y al cabo, el portal permanece verde :(-, con ello el portal le queda lvl bajo y con mods que no le servirán ni para defender, ni para hackear, así al sapito sitico, le tocará que usar un ada para cambiarlo y poder quitarle los mods. Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("link") > -1 || text.indexOf("linkear") > -1 || text.indexOf("enla") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADdQIAAr177AABmxEcZhqNGKsC", 'LINK', message_id);
                        		app.telegram.sendMessage(chat, '\nUn link o enlace, es la forma como se pueden unir dos portales, su fin es en últimas generar campos, para así controlar o defender un área y las Mus -Mind Units, Unidades Mentales- bajo ella. Para poder enlazar dos portales se necesita tener en cuenta:'+
					'\n*La llave o llaves del portal destino o donde queremos enlazar; no es necesario tener llaves del portal de origen, siempre que no tengas que moverte a otro portal, convirtiendo al portal de origen en un portal destino, consultame acerca de las llaves.'+
					'\n*El portal de origen no esta dentro de un campo. Si el portal de origen esta dentro de un campo, es imposible linkear desde el, puedes linkear desde el vertice del campo, pero nunca de un portal que este dentro de este campo.'+
					'\n*Los portales que van a ser enlazados, no pueden tener entre ellos enlaces, no importa la facción, por lo que si hay uno o varios enlaces entre portales, que se "atraviecen" en el enlace que piensas hacer, primero debes eliminar estos enlaces tumbado los portales, para así poder generar tu enlace.'+
					'\nEs por esta razón que debes siempre pensar como vas a enlazar para no "estorbar" o posiblemante dañar los planes de otro pitufo, si sabes de un plan sapo que no se ha hecho, y sabes que si linkeas dañas su plan, hazlo sin miedo, si luego te enteras que hay planes para contrarestar el de los sapos y tu link estorba, solo basta con quitarlo cuando vaya a hacerse el plan, pero recuerda estar listo para quitarlo, así que si de donde lanzaras el link es un lugar que no vas con frecuencia, primero pregunta si lo que vas a hacer daña algo, si no te responden en un tiempo prudente o te dicen que no hace daño, hazlo, pues así ayudas más a la facción. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("mod") > -1 && words(text) < 6){
        				app.telegram.sendDocument(chat, "BQADAQADHAIAAr177AABpsznQDC1C3MC", 'MODIFICADORES', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Modificadores o mods, son un tipo de items que cambian las condiciones básicas del portal y cada uno tiene una función especial, consultame de cada uno de ellos, escudo, link amp, heat sink, multi hack, foce amp y torreta y te daré información especifica de ellos. Solo se pueden poner 2 por agente. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("multihack") > -1 || text.indexOf("multi hack") > -1 || text.indexOf("mh") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADHQIAAr177AABzVQ1Kn_5Y-QC", 'MULTI HACK', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Multi Hack, son mods que aumentan el numero de hacks en el portal, pero depende de su rareza, siendo el muy raro de 12, el raro de 8 y el común de 4, pero se reduce conforme vas poniendo mas de estos mods. El primero da un 100% de incremento, los siguientes solo un 50% más. Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("hack") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\n Al hackear un portal, puedes obtener items e información del mismo, para ello debes ir al portal, tenerlo en rango, señalarlo y darle hack, hay tipos especiales de hack como hack complejo, hack con glifo, hack mas llave, hack menos llave, hack simple y hack rápido, preguntame por cada uno de ellos para saber más. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("zeer") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\nLos N-Zeer, son los enemigos de los Shaper y ellos fueron expulsados hace mucho tiempo, y desde entonces, incluso su mera mención de existencia fue escondida por los Shapers y 13Magnus, quienes tienen la mision de purgar todas las formas de su existencia del conocimiento Humano.. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("portal") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\nUn portal es un lugar que conecta este mundo con otra dimension. Allí puedes encontrar gran cantidad de XM y dependiendo de la facción, puede facilitar o impedir el ingreso de los shapers y sus mensajes a este mundo. Los portales pueden capturarse poniendo resonadores en ellos, en lo posible ubicate en la parte mas externa de tu rango de acción para capturarlo. Los portales tienen una decaida diaría del 15% sin importar el nivel, así que si quieres mantenerlos, recargalos a diario, lo cual te dará 10 de ap por cada acción de recargar, dependiendo de su nivel, puedes enlazarlo con otro y formar campos, preguntame por nivel para mas información. En ellos puedes obtener items mediante hacks, y si hackeas un portal enemigo, te dará 100 de ap, si usas hack con glifos, puedes obtener más items. Sin ningún modificador, un portal puede hackearse 4 veces cada 5 minutos, y luego debes esperar 4 horas para volve a hackearlo después del primer hack. La cantidad de XM que aparece alrededor de un portal, depende de su nivel. Hay portales especiales que solo pueden ser abiertos por sensitivos especiales como Hank, pero estos no los encontraréis en el escaner. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("portal quemado") > -1 || text.indexOf("burn out") > -1 || text.indexOf("queme un") > -1 || text.indexOf("quemo") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADHgIAAr177AABrGIMwKPdeUQC", 'PORTAL QUEMADO', message_id);
                        		app.telegram.sendMessage(chat, '\nUn portal sin mods, solo puede ser hackeado 4 veces y cada 5 minutos, después de ello no puedes hackearlo mas veces hasta que pasen 4 horas después del primer hack, si quieres evitar ello, puedes usar mods como el multihack como se ve en el gif, o como el heatsink, preguntame acerca de ellos y te diré más información. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("shield") > -1 || text.indexOf("axa") > -1 || text.indexOf("ps") > -1 || text.indexOf("escudo") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADHwIAAr177AABaUpM2uhkFw4C", 'PORTAL SHIELD/AXA', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Escudos o portal shield, son mods que aumentan la defensa del portal, es decir, su mitigación de ataque y dependen de su rareza, siendo los comunes de un 30% no tiene adherencia extra, los raros 40% y una adherencia extra de un 15% y los muy raros 60% y una adherencia extra de 45%. Los Escudos AXA son escudos patrocinados por AXA, una compañia de seguros japones, y tienen una defensa del 70% y una adherencia extra del 80%. Los valores de mitigación se suman para obtener la mitigación totál, pero solo llega a un 95%, despues de ello, el portal no obtiene mas defensa, pero si dejas mas shields y cae uno de ellos, la nueva defensa será de los shield que queden, pero sin superar el 95%, este numero solo se puede aumentar a través de links. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("cubo") > -1 || text.indexOf("cube") > -1 || text.indexOf("pc") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADIAIAAr177AABYXXNNKHMO7MC", 'POWER CUBE', message_id);
                        		app.telegram.sendMessage(chat, '\nLos cubos -PC-, son items que guardan XM y te permiten recuperar XM sin tener que recolectarla del suelo y su uso es para cuando te quedes sin energía cuando estas atacando, deployando, linkeando o farmeando, los uses y puedas seguir en ello (hay otras formas de conseguir XM, consultame sobre reciclar). Cada uno te da 1000 de XM por cada nivel del cubo, aunque existe un tipo especial de cubo llamado lawson, puedes consultarme que son ellos. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("recicla") > -1 && words(text) < 5){
        				app.telegram.sendDocument(chat, "BQADAQADIQIAAr177AABwHHvq8dGtKwC", 'RECICLAR', message_id);
                        		app.telegram.sendMessage(chat, '\nReciclar es una forma de recuperar XM para realizar acciones en el juego, cada item tiene un valor especial de XM que te da por reciclarlo, 20 por cada nivel, 40 los items comunes, 80 los raros y 100 los muy raros, siendo las llaves las que dan mas en proporcionalidad a como salen, pues da 500 de XM, aunque los cubos dan 1000 por nivel, es mas probable que tengas mas cantidad de llaves que cubos, y muchas veces te encartas con un monton de llaves que no sabes que hacer, reciclalas y recargate de XM. Una buena estrategia para consevar el inventario limpio, es reciclar XMPs de niveles bajos y solo quedate con uno o dos niveles bajo el tuyo -si tienes de niveles mas altos conservalas que te servirán cuando alcances eses nivel-, hasta que alcances el limite de 2000 de inventario, siendo hora que empieces a reciclar los XMPs de niveles mas bajos que aún tienes, siempre que estes en un farm -no vaya a ser que te quedes sin XMPs por reciclarlos a la loca-. Una nota adicional, al reciclar los items te dice que tanto llenan tu barra de XM, aprovecha esto para no pasarte y poder usar el reciclado al máximo -te advierte cuando te pasas-, y usa esta estrategia con los cubos para que recargues mas rápidamente y no uses mas de los necesarios. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("reso") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADIgIAAr177AABmmkMXDiPsf4C", 'RESONADORES', message_id);
                        		app.telegram.sendMessage(chat, '\nLos resonadores -Resos-, son items que te permiten capturar el portal para tu facción, en nuestro caso, bloquea el ingreso de los shapers a nuestro mundo y el envío de sus mensajes a través del XM. Los resonadores van de diferentes niveles hasta un máximo de nivel 8, cada uno aporta un nivel de XM al portal dependiendo de su nivel, siendo los de nivel 1 de 1000 de XM y aumentando de a 500 de XM por cada nivel, hasta el 5 con 3000 de XM y luego aumentan de a mil, hasta un máximo de 6000 en los resos nivel 8, haciendo mas dificil destruirlos según vaya aumentando su nivel, consultame que son armas para darte mas información de como destruirlos. Además de ello, solo puedes poner un cierto numero de resos según el nivel de ellos, siendo 8 resos nivel 1, 4 resos nivel 2, 3 o 4, 2 resos nivel 5 o 6, y 1 reso nivel 7 u 8. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("shaper") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\nLa mejor forma de explicar es que los Shapers existen en una dimensión completamente diferente a la nuesta. Ellos son responsables de la "Señal de Datos Ordenados" en el XM que causa muchos diferentes aspectos a la exposición al XM; Aumento en la creatividad y la perspicacia en algunos, pero en otros casos puede sacar las mas oscuras y mas arraigadas partes de la personalidad del individuo. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("torreta") > -1 ||text.indexOf("turret") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADIwIAAr177AAB5rKIHjPAX0kC", 'TORRETA', message_id);
                        		app.telegram.sendMessage(chat, '\nLas torretas, son mods que hacen dos cosas, aumentar el critico de ataque en un 20% por cada uno que se ponga, y aumenta en 1,5 veces el factor de ataque, osea aumenta las veces que el portal te golpea, pero este factor decrementa según el numero de torretas que pongas, siendo el primero de un 100% de incremento, el segundo un 25% mas y el tercero y cuarto solo un 12.5% mas. Además de ello, tiene una adherencia extra del 20% cada uno. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("strike") > -1 || text.indexOf("us") > -1 && words(text) < 6){
        				app.telegram.sendDocument(chat, "BQADAQADJAIAAr177AABJWaY2Oa8eAoC", 'ULTRA STRIKE', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Ultra Strike -US-, son un tipo de arma que tienen un muy corto alcance pero tienen un critico de daño muy elevado dado su alcance, usalos para tumbar mods parandote en el centro del portal (visita https://youtu.be/W_jzpj5I7DM), o también puedes pararte sobre los resonadores y dado su critico, los destruirás mas fácil; para maximizar su critico de ataque, deja presionado el boton de dispara y trata que el circulo que se acerca este lo mas cerca posible del cursor, si lo dejas en todo el medio, te dará un adicional del 20% en el crítico. La relación de nivel, rango -radio de ataque- y critico de ataque viene dado por:'+
                                            			'\n<b>Nivel</b> \t<b>Rango</b> \t<b>Critico de ataque</b>'+
                                            			'\n<b>1</b>        \t<b>10m</b>     \t<b>150XM</b>'+
                                            			'\n<b>2</b>        \t<b>13m</b>     \t<b>300XM</b>'+
                                            			'\n<b>3</b>        \t<b>16m</b>     \t<b>500XM</b>'+
                                            			'\n<b>4</b>        \t<b>18m</b>     \t<b>900XM</b>'+
                                            			'\n<b>5</b>        \t<b>21m</b>     \t<b>1200XM</b>'+
                                            			'\n<b>6</b>        \t<b>24m</b>     \t<b>1500XM</b>'+
                                            			'\n<b>7</b>        \t<b>27m</b>     \t<b>1800XM</b>'+
                                            			'\n<b>8</b>        \t<b>30m</b>     \t<b>2700XM</b>'+
                                            			'\nEl critico de ataque se da en el centro del US, pero se dispersa conforme van pasando los metros hasta volverse 0 en su distancia máxima, por lo que marca una gran diferencia con el XMP, pues este su critico se dispersa a mas distancia, haciendo que a la misma distancia, el us tenga un critico efectivo mucho mayor que el XMP pero un alcance muy pequeño, con la única diferencia del centro exacto del ataque, pero hacer coincidir este centro con el centro de los portales o resonadores es practicamente imposible, por lo que sus usos difieren del objetivo al que se quiere llegar. Puedes preguntarme que son las demas armas y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("xmp") > -1 && words(text) < 6){
					app.telegram.sendDocument(chat, "BQADAQADJQIAAr177AAB_xHwvUfV8vIC", 'DISPERSOR　XMP', message_id);
        				app.telegram.sendMessage(chat, '\nLos Dispersores XMP -XMP-, son un tipo de arma que tienen un largo alcance y un critico no muy alto, dado su alcance, se usan principalmente para tumbar resonadores, la forma mas efectiva de usarlos, dependerá de tu nivel (visita https://youtu.be/Zy28WuyFNcU); para maximizar su critico de ataque, deja presionado el boton de dispara y trata que el circulo que se acerca este lo mas cerca posible del cursor, si lo dejas en todo el medio, te dará un adicional del 20% en el crítico. La relación de nivel, rango -radio de ataque- y critico de ataque viene dado por:'+
                                            			'\n<b>Nivel</b> \t<b>Rango</b> \t<b>Critico de ataque</b>'+
                                            			'\n<b>1</b>        \t<b>42m</b>     \t<b>150XM</b>'+
                                            			'\n<b>2</b>        \t<b>48m</b>     \t<b>300XM</b>'+
                                            			'\n<b>3</b>        \t<b>58m</b>     \t<b>500XM</b>'+
                                            			'\n<b>4</b>        \t<b>72m</b>     \t<b>900XM</b>'+
                                            			'\n<b>5</b>        \t<b>90m</b>     \t<b>1200XM</b>'+
                                            			'\n<b>6</b>        \t<b>112m</b>    \t<b>1500XM</b>'+
                                            			'\n<b>7</b>        \t<b>138m</b>    \t<b>1800XM</b>'+
                                            			'\n<b>8</b>        \t<b>168m</b>    \t<b>2700XM</b>'+
                                            			'\nEl critico de ataque se da en el centro del XMP, pero se dispersa conforme van pasando los metros hasta volverse 0 en su distancia máxima, por lo que marca una gran diferencia con el us, pues este su critico se dispersa a menor distancia, haciendo que a la misma distancia, el XMP tenga un critico efectivo mucho menor que el us, pro un rango de alcance muchas veces mayor, con la única diferencia del centro exacto del ataque, pero hacer coincidir este centro con el centro de los portales o resonadores es practicamente imposible, por lo que sus usos difieren del objetivo al que se quiere llegar. Puedes preguntarme que son las demas armas y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("xm") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\n El XM o Materia Exotica, es un elemento clave de Ingress. Desde mucho tiempo se ha conocido la existencia de esta materia, aunque su conocimiento se perdió y fue por Niantic que se redescubrio y empezó a utilizarse con fines ocultos pues se descubrió que este tipo de energía tenía un mensaje oculto, el cual develo la existencia de otras dimensiones y de los shapers. Mi deber es escudriñar todo lo relacionado con esta materia y como puede afectar la vida y al humano. Se han desarrollado muchas investigaciones que han traido experimentos tanto buenos como fallidos, y el descubrimiento de otras formas ocultas del XM como el DarkXM que puede ser convertido en armas que afectan de forma especial a los humanos. El XM es la energía clave para realizar cualquier acción en el escaner, y lo puedes encontrar de manera natural en las calles, donde se realice algún tipo de actividad tecnológica, también puedes encontrarlo empaquetado en cubos o también en los diversos objetos que hay, por lo que puedes reciclarlos para obtener un poco de XM.'+
					'\nEl XM no era raro. los satélites aéreos encontraron que el mundo estaba cubierto de él pero no se extendió uniformemente. Se agrupan alrededor de los sitios claves, lugares de importancia cultural, intelectual y religiosa en todo el mundo (conocido en Ingress como portales). Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("mind units") > -1 || text.indexOf("mu") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\n MU o Mind Units, son las unidades mentales y representan la población bajo un campo. Es una medida que utiliza la densidad poblacional de una región, por lo que hay regiones que van a generar mas Mus que otras así tengan el mismo tamaño, pues depende mucho de su densidad. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("anomalia") > -1 && words(text) < 7){
                        		app.telegram.sendMessage(chat, '\n Una Anomalía ocurre cuando en algún lugar el XM del área presenta una "falla", y es cuando se recibe gran cantidad de datos que deben ser capturados y con ello conseguir mas información con la cual cada facción puede cambiar el curso de la historia. Niantic a desarrollado vehiculos especiales como los NL1331, los cuales están equipados para descubrir estas fallas y disrrupciones del XM. En una anomalía se pueden presentar diferentes escenarios, pero básicamente se trata de una lucha campal entre ambas facciones por el control de la zona, cada acción genera una cantidad de puntos, y la idea es en la ventana de medición hacer la mayor cantidad de acciones, ya sea links, fields, capturar portales o incluso mover shards. Hay portales especiales los cuales dan más puntos, y en la última anomalía hay hasta los que quitaban puntos, estos portales se les llama volatiles y tienen mayor cantidad de información. Los shards por su parte son fragmentos, puede ser de personajes o de datos, los cuales deben llevarse a objetivos especificos mediante links y con reglas que dependen de cada anomalía. Entre las diferentes tipos de anomalías, encontramos las normales, las cuales consisten en capturar, enlazar y generar campos, allí encontramos portales volatiles y se debe tener en cuenta que el mayor field sobre la zona, captura mas datos. Las hibridas, combinan las anteriores con los shards, por lo que puede que haya o no volatiles. Existen las celdas conectadas, las cuales se deben cubrir con un campo para obtener los datos y mantener este o estos campos por el mayor tiempo posible, pues gana la facción que obtenga un mayor promedio en los mus. También tenemos eventos especiales, donde se deben llevar shards a partes especiales del planeta mediante links. Al final tenemos las mega anomalías, hasta ahora solo se han desarrollado en japón, y son anomalías que pueden contener todas las anteriores, y donde se tienen hasta más de 10k agentes de ambas facciones luchando por capturar la anomalía. Con cariño ADA 😘😘😘', null);
        			}
                    else{
                        app.telegram.sendMessage(-1001054945393, "<b>feedback qué es:</b> " + text + " | <b>CHAT_ID:</b> " + chat + "\nUtiliza -> 'Ada responder' para solucionar la inquietud.", null);
                        app.telegram.sendMessage(-1001069963507, "<b>feedback qué es:</b> " + text + " | <b>CHAT_ID:</b> " + chat + "\nUtiliza -> 'Ada responder' para solucionar la inquietud.", null);
                    }
                }
                ////////////////////////////
                ///// FIN DEFINICIONES /////
                ///////////////////////////

            //ACÀ TERMINA EL QUÉ ES, TENER EN CUENTA QUE SIGUEN LOS DEMÁS DE "ADA" que es la principal
                else if(text.indexOf("puntos") > -1 && text.indexOf("glyph") > -1 || text.indexOf("puntos de glifo") > -1 && words(text) < 8){
                    app.telegram.sendMessage(chat, "<i>Puntos de Glyph por portal para medalla Translator</i>"+
                                                   "\n\nPortales <b>L0 y L1</b> - 1 Glyph - <b>1</b> punto"+
                                                   "\nPortal <b>L2</b> - 2 Glyphs - <b>2</b> puntos"+
                                                   "\nPortales <b>L3, L4 y L5</b> - 3 Glyphs - <b>4</b> puntos"+
                                                   "\nPortales <b>L6 y L7</b> - 4 Glyphs - <b>8</b> puntos"+
                                                   "\nPortal <b>L8</b> - 5 Glyphs - <b>15</b> puntos"+
                                                   "\n", null);

                }

            /* TODO

                        // Portal calc xmps y otros
            */

            	/////////////////////////
            	//Fin Ayuda Para NOOBS//
            	///////////////////////

            	///////////////////////////////
            	// #OnlyForTheLulz/////////////
            	//////////////////////////////

                /////////////////
                ///// CLIMA /////
                /////////////////
            // WEATHER clima REST API @cizaquita
                else if(text.indexOf("clima") > -1 || text.indexOf("tiempo") > -1 && words(text) < 5){
                    //app.telegram.sendMessage(chat, "clima...", null, message_id);
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

                                        app.api.getWeather(lat, lon, function(data){
                                            if (data != null) {
                                                app.telegram.sendMessage(chat, "El clima en <b>" + data.timezone + "</b> es " + data.currently.summary + " con <b>" + data.currently.temperature + " °C</b>" +
                                                                               "\nEl pronóstico es " + data.hourly.summary, null, message_id);
                                                //app.telegram.sendMessage(chat, data, null, message_id);
                                            };
                                        });
                                    }else{
                                        app.telegram.sendMessage(chat, app.i18n(lang, 'place', 'not_found'), null);
                                    }
                                }
                            }
                        };
                        xmlhttp.send(null);
                    }
                }
                //////////////////
                ///// LANZAR /////
                //////////////////
            //  LANZAR: moneda, dados
                else if(text.indexOf("lanzar") > -1 && words(text) < 5){
                    if (text.indexOf("moneda") > -1 ) {
                        var moneda = (Math.floor(Math.random() * 2) + 1);
                        if (moneda == 1) {
                            app.telegram.sendMessage(chat, "@" + username + " lanzó una moneda y salió <b>cara</b>.", null, message_id);
                        }else{
                            app.telegram.sendMessage(chat, "@" + username + " lanzó una moneda y salió <b>sello</b>.", null, message_id);
                        }
                    }else if (text.indexOf("dado") > -1) {
                        var dado = (Math.floor(Math.random() * 6) + 1);
                        app.telegram.sendMessage(chat, "@" + username + " lanzó un dado y salió <b>" + dado + "</b>.", null, message_id);
                    };
                }
            // CATS gatos REST API @cizaquita
                else if(text.indexOf("cat") > -1 || text.indexOf("gato") > -1 && words(text) < 5){
                    app.api.getCatFact(function(frase){
                        if (frase != null) {
                            app.telegram.sendMessage(chat, frase, null, message_id);
                        };
                    });
                }
            // FEED //
            /*
                else if(text.indexOf("feed") > -1 && words(text) < 3){
                    var feed = new google.feeds.Feed("https://fevgames.net/category/ingress/feed/");
                    var entradas = "";
                    feed.load(function(result) {
                        entradas = result.feed.entries;
                        var texto = "";
                        //console.log(result.feed.entries);
                        entradas.forEach(function(val) {
                            texto += "<b>" + val.title + "</b>" + "\n<i>" + val.contentSnippet + "</i>" + "\n" + val.link + "\n" + val.publishedDate + "\n\n";
                        });

                        app.telegram.sendMessage(chat, texto, null);
                    });
                }
            */
            // VERIFICAR AGENTE
                /*else if(text.indexOf("validar") > -1 && text.indexOf("agente") > -1){
                    if(reply_to_message && isBotAdmin(from_id)){
                        var agent_telegram_id = reply_to_message.from.id,
                            agent_telegram_nick = reply_to_message.from.username;
                        console.log("debug validar agente:" + agent_telegram_id);

                        app.api.verifyAgent(agent_telegram_id, username, function(data){
                            if (data && data.status == "ok") {
                                app.telegram.sendMessage(chat, '(' + agent_telegram_id + ') @' + agent_telegram_nick + ', ha sido verificado ☑️', null, message_id);
                            }else{
                                app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
                            }
                        });                        
                    }else{
                        app.telegram.sendMessage(chat, 'Debes dar Reply al mensaje del usuario que deseas validar o no estás autorizado.', null, message_id);
                        app.telegram.sendMessage(-1001069963507, "intento crear de: " + text + ", de: @" + username, null);  
                    }
                }*/

            // FEEDBACK cuando no sabe responder
                else{                    
                    //app.telegram.sendMessage(chat, "No entiendo, enviaré un feedback a mi creador, gracias!", null);
                    app.telegram.sendMessage(-1001054945393, "<b>feedback semántico:</b> " + text + " | <b>CHAT_ID:</b> " + chat + "\nUtiliza -> 'Ada responder' para solucionar la inquietud.", null);
                    app.telegram.sendMessage(-1001069963507, "<b>feedback semántico:</b> " + text + " | <b>CHAT_ID:</b> " + chat + "\nUtiliza -> 'Ada responder' para solucionar la inquietud.", null);

                }
            }
        
        /////////////////////////////////////////////////////////////////////////
        ////////////////////////////// Fin ADA //////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////Fin BOT SEMÁNTICO/////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////

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
        app.telegram.sendMessage(-1001069963507, 'callbackQuery: ' + JSON.stringify(callbackQuery), null);
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

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function isBotAdmin(chat_id){
        for (var i = admins.length - 1; i >= 0; i--) {
            if(admins[i] == chat_id){
                return true;
            }
        };
    };
    function getNumbersInString(str){
        var numb = str.match(/\d/g);
        if (numb) {
            numb = numb.join("");            
        };
        return numb;
    }

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
