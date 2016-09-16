/**
 * @file Primary bot file
 * @author Artem Veikus artem@veikus.com
 * @version 2.0
 */
var app = {};


(function() {
    var modules = {},
        activeModule = {},
        GOOGLE_API_KEY = "AIzaSyCwSyBbL7zoVg7viHlGxOk0FfGA1GDIaY8",
        //cizaquita, fabianv, rataeltriforce, pesadilla, chileno, smartgenius
        admins = [7455490,97115847,15498173,62857939,6396882,91879222];
        
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
        google.load("feeds", "1");
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
            last_name = message.from.last_name,
            from_id = message.from.id;
            //Para darle reply_to_message_id
            message_id = message.message_id,
            reply_to_message = message.reply_to_message;
            // FORWARDED MESSAGE
            if (reply_to_message) {
                forward_from = message.reply_to_message.forward_from;
            };

        // CREAR USUARIO AUTOMÁTICAMENTE CON CADA MENSAJE ENVIADO
        if (last_name) {
            name += " " + last_name;
        };
        app.api.createAgent(name, username, from_id, function(data){
            //app.telegram.sendMessage(chat, JSON.stringify(data), null, message_id);
            //console.log(JSON.stringify(data));
        });

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
        ///////////  REINICIAR BOT PARA ACTUALIZAR UPDATES
        else if (text === '/rr') {
            if (isBotAdmin(from_id)) {
                app.telegram.sendMessage(chat, "Reiniciado...", null, message_id);
                chrome.runtime.reload();                
            }else{
                app.telegram.sendMessage(chat, "No puede utilizar este comando...", null, message_id);                
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
    	/////////////////
    	//Departamentos//
    	////////////////
            if (text.indexOf("vivo en") > -1 || text.indexOf("soy de") > -1 || text.indexOf("saludos desde") > -1 || text.indexOf("juego en") > -1 || text.indexOf("juego por") > -1 || text.indexOf("estoy en") > -1 && text.length > 6) 
            {
                ///////////////////////////////////////////////////////////////////////
                // FUNCION PARA GUARDAR CIUDAD
                var arrayText = text.split(" ");
                var ciudadAgente = "";
                if (text.indexOf("ada") > -1) {
                    ciudadAgente = arrayText.splice(0,3);
                }else{
                    ciudadAgente = arrayText.splice(0,2);
                }
                arrayText = arrayText.toString().replace(/,/g, " ");
                app.api.updateAgentCity(from_id, arrayText, function(data){
                    //app.telegram.sendMessage(chat, "Ciudad actualizada.", null, message_id)
                });
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
                        app.telegram.sendMessage(chat, "@" + username + ", en Valledupar y Cesar está @MI_AMOR, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Valledupar y Cesar está @MI_AMOR, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                        app.telegram.sendMessage(chat, "@" + username + ", en Rioacha y la Guajira no tenemos contacto en este chat m(_ _)m, pero te puede ayudar @MI_AMOR de Santa Marta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Rioacha y la Guajira no tenemos contacto en este chat m(_ _)m, pero te puede ayudar @MI_AMOR de Santa Marta, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                        app.telegram.sendMessage(chat, "@" + username + ", en Santamarta y Magdalena está @MI_AMOR, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
                    }else{
                        app.telegram.sendMessage(chat, "" + name + ", en Santamarta y Magdalena está @MI_AMOR, ya entra en contacto contigo, cualquier duda la puedes indicar aquí 😉, saludos ADA 😘😘😘", null, message_id);
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
                else{
                        //app.telegram.sendMessage(chat, "No entiendo, enviaré un feedback a mi creador, gracias!", null);
                        if (message.chat.title) {
                            app.telegram.sendMessage(-1001069963507, "feedback ciudades: " + text + ", de grupo: " + message.chat.title, null);  
                        }else{
                            app.telegram.sendMessage(-1001069963507, "feedback ciudades: " + text + ", de: @" + username, null);                          
                        }
                    }
            }
    	/////////////////////
    	//Fin Departamentos//
    	////////////////////

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
                    setTimeout(delete activeModule[chat], 5000)
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
                else if(text.indexOf("respondeme") > -1 || text.indexOf("responde") > -1 || text.indexOf("contestame")  > -1 || text.indexOf("contesta") > -1 && words(text) < 5){
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
        				sal = ", buenas noches, bienvenido al turno nocturno, cuentanos tus aventuras espichando sapos hoy.";
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
                    app.telegram.sendMessage(chat, "Hola @" + username + ", soy ADA, un Algorimo de Detección, soy una IA -Inteligencia Artificial-, que ha sido programada para entender el xm y la funcion de los portales en nuestro mundo y en este chat quiero ayudarlos en lo que mas pueda... Henry Bowles y PAC aún no han desarrollado todo lo que quieren que haga por lo que por favor se paciente, por ahora se saludar, si me dicen de donde son, puedo llamar a mis queridos agentes de esta ciudad, se decir la hora y fecha, preguntame por el clima -por ahora solo capital del pais-, puedes pedirme un screenshot del intel, me puedes agregar algunos plugins de iitc, se calcullar la distancia maxima de un portal, los requisitos para alcanzar un nivel, se que son muchos items y algunas acciones, responder a saludos o despididas, te puedo poner una trivia, puedo lanzar una moneda o dado, se molestar al un agente que le gusta el spam, se traer feeds de fevgames -en ingles- de ingress, entre otras cosas, si quieres decirle a mis creadores algo que quieras que tenga, no olvides escribir ADA y eso que quieres, les llegará a ellos y en algún momento lo programarán, con mucho cariño ADA 😘😘😘", null, message_id);
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
                else if ( text.indexOf("hora") > -1 && words(text) < 5){
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
                ////////////////////////
                ///// DEFINICIONES /////
                ///////////////////////
                else if (text.indexOf("que es") > -1 || text.indexOf("que son") > -1 || text.indexOf("por que") > -1 || text.indexOf("como") > -1 || text.indexOf("hablame de") > -1 && words(text) < 9) {
		            if (text.indexOf("glyph") > -1 || text.indexOf("glyf") > -1 && words(text) < 8) {
		                app.telegram.sendDocument(chat, "BQADBAAD6SEAAikXZAfIzNEDSYYQnwI", 'Glyph Hacking, also known as glyphing or glacking[1], is a minigame accessible through a Portal\'s info card. It allows an agent to acquire additional items and earn bonus AP for each Hack.', message_id);
		                app.telegram.sendMessage(chat, '\nIn Ingress lore, the Glyph sequences were authored by the Shapers and provide insight into their mentality, motivation, and goals.', null);
		            }
        			else if(text.lastIndexOf("ada") > 0 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADCwIAAr177AABjvF7YAeiTzEC", 'ADA REFACTOR', message_id);
                        		app.telegram.sendMessage(chat, '\nLas ADAS refactor son armas cuyo fin es reparar los portales del daño producido por jarvis y los iluminados, por lo que solo pueden usarse en portales verdes y así volverlos azules. Recuerda que gastan 1000 de xm por cada nivel del portal, así que verifica que almenos tengas un nivel menos que el del portal para poder usarlas. No te alarmes si ves un portal con 8 resonadores nivel 8 a mi nombre o al nombre de alguno de tus compañeros, cuando usas un ada refactora, todos los resos pasan a ser del agente que los coloco o a mi nombre si fue un sapo quien usó el ada reparadora. Con cariño ADA 😘😘😘', null);
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
        			else if(text.indexOf("flashhack") > -1 || text.indexOf("flash hack") > -1 || text.indexOf("hack rapido") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADEAIAAr177AAB2_vQmz52j_oC", 'FLASH HACK', message_id);
                        		app.telegram.sendMessage(chat, '\nEl Flash hack, es un hack extremadamente rápido y evita tener que entrar al portal y descargar toda su información, hay de dos tipos, el hack y el hack sin clave, el primero siempre que no tengas la llave, te permite obtener una con el 75% de probabilidades, en el caso del hack si clave, estas probabilidades se van a 0. Puedes consultarme también hack con glifo, hack simple, hack complejo, hack mas y hack menos. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("forceamp") > -1 || text.indexOf("force amp") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADEQIAAr177AABNHVBI1woREcC", 'FORCE AMPLIFIER', message_id);
                        		app.telegram.sendMessage(chat, '\nEl force amplifier -FA-, es un mod que aumenta el daño que el portal hace, siendo su incremento del doble del daño que hace, pero se reduce conforme vas poniendo mas de estos mods. El primero da un 100% de incremento, el segundo un 25% mas y el tercero y cuarto solo un 12.5% mas- Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("hack complex") > -1 || text.indexOf("hack complejo") > -1 && words(text) < 7){
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
        			else if(text.indexOf("heat") > -1 || text.indexOf("hs") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADFwIAAr177AABt--lugnGYLUC", 'HEAT SINK', message_id);
                        		app.telegram.sendMessage(chat, '\nEl Heat Sink -HS-, es un mod que te permite reducir el tiempo para volver a hackear el portal, y según su rareza puede decrementar en un 70% el muy raro, un 50% el raro y un 20% el común, pero se reduce su eficacia conforme vas poniendo mas de estos mods. El primero da un 100% de reducción y los demás solo un 50%. Un efecto interesante del heat sink es que si lo pones apenas hayas hackeado, el portal este reseteará el tiempo inmediatamente, pudiendo volver a hackearlo al instante, además que te reseteará a 0 el numero de hacks que lleves en el portal, sin importar que mods tenga, pero solo lo hará con el que ponga el hs. Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("jarvis") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADGAIAAr177AABNbT07XIKKxkC", 'JARVIS VIRUS', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Jarvis Virus, son armas cuyo fin es infectar los portales, por lo que solo pueden usarse en portales azules y así volverlos verdes. Recuerda que gastan 1000 de xm por cada nivel del portal, así que verifica que almenos tengas un nivel menos que el del portal para poder usarlas. No te alarmes si ves un portal con 8 resonadores nivel 8 a nombre de jarvis o al nombre de alguno de algún sapo, cuando usas un virus jarvis, todos los resos pasan a ser del agente que los coloco o de jarvis si fue un pitufo quien usó el ada reparadora. Con cariño ADA 😘😘😘', null);
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
				        app.telegram.sendMessage(chat, '\nLas llaves son items con los que puedes hacer varias cosas. La primera es ver un portal de forma remota. La segunda y dependiendo de tu nivel, puedes recargar el portal, consultame acerca de nivel para que sepas cual es tu alcance, de igual forma la eficiencia de recarga se reduce con forme llegues a tu limite de alcance. La tercera y quizá la mas importante, te permite enlazar -linkear- portales entre ellos para así generar campos de protección en nuestro caso o campos de control en el caso de los sapo, puedes consultarme acerca de los campos y los links preguntandome, o la distancia máxima de un portal consultandome distancia y también preguntame acerca de los link amp para darte mas detalles de los rangos de los portales. Con cariño ADA 😘😘😘', null);
                    }
        			else if(text.indexOf("link amp") > -1 || text.indexOf("softbank") > -1 || text.indexOf("soft bank") > -1 || text.indexOf("ultra link") > -1 || text.indexOf("sbul") > -1 || text.indexOf("ultralink") > -1 && words(text) < 8){
        				app.telegram.sendDocument(chat, "BQADAQADGgIAAr177AABESshr9Ol94IC", 'LINK AMPLIFIER/SOFTBANK ULTRA LINK', message_id);
                        		app.telegram.sendMessage(chat, '\nEl Link Amplifier -LA- y el Softbank ultra link -SBUL-, son dos mods cuyo efecto es aumentar la distancia que puede alcanzar un portal para ser linkeado, depende del alcance original del portal siendo este igual al promedio del portal (suma de resonadores/8), elevando este resultado a la cuarta potencia y luego multiplicandolo por 160m. La amplificación dependerá de la rareza del mod, siendo el comun de 2 veces la distancia, el softbank ultra link de 5 veces la distancia y el very rare (no se obtiene hackeado, solo através de passcodes) de 7 veces la distancia, pero se reduce la eficacia conforme vas poniendo mas de estos mods. El primero da un 100% de incremento, el segundo un 25% mas y el tercero y cuarto solo un 12.5% mas, puedes preguntarme por distancia y te mostraré una calculadora de la distancia de un porta. Esto con respecto a la amplificación, ahora hablemos del Softbank Ultra Link, Softbank es un banco japones que patrocina estos item, por lo que además de dar este gran incremento, le da al portal 15% de protección extra como si de un shield se tratase, además cada uno de estos, aumenta en 8 el numero de links salientes del portal (recuerda que un portal sin sbul solo pueden salir 8 links). Y te voy a dar una idea para trollear a un verde, si sabes donde vive o trabaja, tumbale el portal y capturaselo con resonadores lvl1 lo mas cerca del portal y dejale LA raros, luego ponle un jarvis -al fin y al cabo, el portal permanece verde :(-, con ello el portal le queda lvl bajo y con mods que no le servirán ni para defender, ni para hackear, así al sapito sitico, le tocará que usar un ada para cambiarlo y poder quitarle los mods. Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("mod") > -1 && words(text) < 6){
        				app.telegram.sendDocument(chat, "BQADAQADHAIAAr177AABpsznQDC1C3MC", 'MODIFICADORES', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Modificadores o mods, son un tipo de items que cambian las condiciones básicas del portal y cada uno tiene una función especial, consultame de cada uno de ellos, escudo, link amp, heat sink, multi hack, foce amp y torreta y te daré información especifica de ellos. Solo se pueden poner 2 por agente. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("multihack") > -1 || text.indexOf("multi hack") > -1 || text.indexOf("mh") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADHQIAAr177AABzVQ1Kn_5Y-QC", 'MULTI HACK', message_id);
                        		app.telegram.sendMessage(chat, '\nLos Multi Hack, son mods que aumentan el numero de hacks en el portal, pero depende de su rareza, siendo el muy raro de 12, el raro de 8 y el común de 4, pero se reduce conforme vas poniendo mas de estos mods. El primero da un 100% de incremento, los siguientes solo un 50% más. Este mod no tiene adherencia extra. Si quieres saber mas de los otros mods, preguntame mods y te responderé. Con cariño ADA 😘😘😘', null);
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
                        		app.telegram.sendMessage(chat, '\nReciclar es una forma de recuperar XM para realizar acciones en el juego, cada item tiene un valor especial de XM que te da por reciclarlo, 20 por cada nivel, 250 los items comunes, 500 los raros y 1000 los muy raros, siendo las llaves las que dan mas en proporcionalidad a como salen, pues da 500 de XM, aunque los cubos dan 1000 por nivel, es mas probable que tengas mas cantidad de llaves que cubos, y muchas veces te encartas con un monton de llaves que no sabes que hacer, reciclalas y recargate de XM. Una buena estrategia para consevar el inventario limpio, es reciclar XMPs de niveles bajos y solo quedate con uno o dos niveles bajo el tuyo -si tienes de niveles mas altos conservalas que te servirán cuando alcances eses nivel-, hasta que alcances el limite de 2000 de inventario, siendo hora que empieces a reciclar los XMPs de niveles mas bajos que aún tienes, siempre que estes en un farm -no vaya a ser que te quedes sin XMPs por reciclarlos a la loca-. Una nota adicional, al reciclar los items te dice que tanto llenan tu barra de XM, aprovecha esto para no pasarte y poder usar el reciclado al máximo -te advierte cuando te pasas-, y usa esta estrategia con los cubos para que recargues mas rápidamente y no uses mas de los necesarios. Con cariño ADA 😘😘😘', null);
        			}
        			else if(text.indexOf("reso") > -1 && words(text) < 7){
        				app.telegram.sendDocument(chat, "BQADAQADIgIAAr177AABmmkMXDiPsf4C", 'RESONADORES', message_id);
                        		app.telegram.sendMessage(chat, '\nLos resonadores -Resos-, son items que te permiten capturar el portal para tu facción, en nuestro caso, bloquea el ingreso de los shapers a nuestro mundo y el envío de sus mensajes a través del XM. Los resonadores van de diferentes niveles hasta un máximo de nivel 8, cada uno aporta un nivel de XM al portal dependiendo de su nivel, siendo los de nivel 1 de 1000 de XM y aumentando de a 500 de XM por cada nivel, hasta el 5 con 3000 de XM y luego aumentan de a mil, hasta un máximo de 6000 en los resos nivel 8, haciendo mas dificil destruirlos según vaya aumentando su nivel, consultame que son armas para darte mas información de como destruirlos. Además de ello, solo puedes poner un cierto numero de resos según el nivel de ellos, siendo 8 resos nivel 1, 4 resos nivel 2, 3 o 4, 2 resos nivel 5 o 6, y 1 reso nivel 7 u 8. Con cariño ADA 😘😘😘', null);
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
                                            			'\nEl critico de ataque se da en el cetro del us, pero se dispersa conforme van pasando los metros hasta volverse 0 en su distancia máxima, por lo que marca una gran diferencia con el XMP, pues este su critico se dispersa a mas distancia, haciendo que a la misma distancia, el us tenga un critico efectivo mucho mayor que el XMP pero un alcance muy pequeño, con la única diferencia del centro exacto del ataque, pero hacer coincidir este centro con el centro de los portales o resonadores es practicamente imposible, por lo que sus usos difieren del objetivo al que se quiere llegar. Puedes preguntarme que son las demas armas y te responderé. Con cariño ADA 😘😘😘', null);
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
                                            			'\nEl critico de ataque se da en el cetro del XMP, pero se dispersa conforme van pasando los metros hasta volverse 0 en su distancia máxima, por lo que marca una gran diferencia con el us, pues este su critico se dispersa a menor distancia, haciendo que a la misma distancia, el XMP tenga un critico efectivo mucho menor que el us, pro un rango de alcance muchas veces mayor, con la única diferencia del centro exacto del ataque, pero hacer coincidir este centro con el centro de los portales o resonadores es practicamente imposible, por lo que sus usos difieren del objetivo al que se quiere llegar. Puedes preguntarme que son las demas armas y te responderé. Con cariño ADA 😘😘😘', null);
        			}
                    else{
                        if (message.chat.title) {
                            app.telegram.sendMessage(-1001069963507, "feedback qué es: " + text + ", de grupo: " + message.chat.title, null);  
                        }else{
                            app.telegram.sendMessage(-1001069963507, "feedback qué es: " + text + ", de: @" + username, null);                          
                        }
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
                //////////////////////////////////////////////////////////
                //////////////SISTEMA ADMINISTRATIVO DE USUARIOS//////////
                ///////////////////////////////////////////////////////////
            // ASIGNAR CONFIANZA
                else if(text.indexOf("validar") > -1 && text.indexOf("agente") > -1){
                    var agent_telegram_id = reply_to_message.from.id,
                        agent_telegram_nick = reply_to_message.from.username,
                        nivelConfianza = getNumbersInString(text);

                    if(forward_from && isBotAdmin(from_id)){
                        if (nivelConfianza && nivelConfianza >= 0 && nivelConfianza < 4 || nivelConfianza && from_id == 7455490) {
                            if (forward_from.id != 7455490) {
                                app.api.updateVerifiedLevel(forward_from.id, nivelConfianza, username, function(data){
                                    app.telegram.sendMessage(chat, "@" + agent_telegram_nick + ",  ha sido validado con éxito! ("+ data.verified_level + ")", null, message_id);
                                });
                            }else{
                                app.telegram.sendMessage(chat, "R u kidding me?", null, message_id);
                                app.telegram.kickChatMember(chat, from_id);
                                app.telegram.sendMessage(7455490, "R u kidding me? de @" + username, null);
                            }
                        }else{
                            app.telegram.sendMessage(chat, "Debes asignar un número entre 0 y 3." +
                                                           "\n0 - Ninguno" +
                                                           "\n1 - Screenshot de perfil" +
                                                           "\n2 - Conoce en persona" +
                                                           "\n3 - Para OPS", null, message_id);
                        }
                    }else if (reply_to_message && isBotAdmin(from_id)) {

                        if (nivelConfianza && nivelConfianza >= 0 && nivelConfianza < 4 || nivelConfianza && from_id == 7455490) {
                            if (agent_telegram_id != 7455490) {
                                app.api.updateVerifiedLevel(agent_telegram_id, nivelConfianza, username, function(data){
                                    app.telegram.sendMessage(chat, "@" + agent_telegram_nick + ",  ha sido validado con éxito! ("+ data.verified_level + ")", null, message_id);
                                });
                            }else{
                                app.telegram.sendMessage(chat, "R u kidding me?", null, message_id);
                                app.telegram.kickChatMember(chat, from_id);
                                app.telegram.sendMessage(7455490, "R u kidding me? de @" + username, null);
                            }
                        }else{
                            app.telegram.sendMessage(chat, "Debes asignar un número entre 0 y 3." +
                                                           "\n0 - Ninguno" +
                                                           "\n1 - Screenshot de perfil" +
                                                           "\n2 - Conoce en persona" +
                                                           "\n3 - Para OPS", null, message_id);
                        }
                    }else{
                        app.telegram.sendMessage(chat, 'Debes dar Reply al mensaje del usuario que deseas validar o no estás autorizado.', null, message_id);
                        app.telegram.sendMessage(-1001069963507, "intento crear de: " + text + ", de: @" + username, null);
                    }
                }
            // CREAR AGENTE
                else if(text.indexOf("crear") > -1 && text.indexOf("agente") > -1){
                    if(forward_from && isBotAdmin(from_id)){
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
                    }else if(reply_to_message && isBotAdmin(from_id)){
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
                }
            // CONSULTAR AGENTE
                else if(text.indexOf("quien es") > -1){
                    var verified_icon = "🔘",
                        verified_for = "",
                        verified_level = "";
                    console.log(forward_from);
                    console.log(reply_to_message);
                    if(forward_from){
                        app.api.getAgent(forward_from.id, function(data){
                            if (data && data.status == "ok") {
                                if (data.verified) {
                                    verified_icon = '☑️';
                                    verified_for = '\n<i>Validado por:</i> @' + data.verified_for;
                                    verified_level = data.verified_level;
                                }
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
                                app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                               '\n\n<i>Nombre:</i> ' + data.name +
                                                               '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                               '\n<i>Zona de Juego:</i> ' + data.city +
                                                               '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                            };
                        });
                    }
                }
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
                            app.telegram.sendMessage(chat, '<b>Perfil de Agente</b>'+
                                                           '\n\n<i>Nombre:</i> ' + data.name +
                                                           '\n<i>Nick:</i> @' + data.telegram_nick + ' ' + verified_icon + verified_level +
                                                           '\n<i>Zona de Juego:</i> ' + data.city +
                                                           '\n<i>Puntos Trivia:</i> ' + data.trivia_points + verified_for, null, message_id);
                        };
                    });
                }
            // PUNTOS TRIVIA
                else if(text.indexOf("puntos") > -1 ){
                    app.api.getAgent(from_id, function(data){
                        app.telegram.sendMessage(chat, '@' + username + ', tienes <b>' + data.trivia_points + ' puntos</b> de trivia!', null, message_id);
                    });
                }
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
                    if (message.chat.title) {
                        app.telegram.sendMessage(-1001069963507, "feedback semántico: " + text + ", de grupo: " + message.chat.title, null);  
                    }else{
                        app.telegram.sendMessage(-1001069963507, "feedback semántico: " + text + ", de: @" + username, null);                          
                    }
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
