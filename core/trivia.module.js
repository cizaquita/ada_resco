/**
 * @file Distance
 * @author Cris @Cizaquita - Rata @RATAELTRIFORCE
 */
(function() {
    app.modules = app.modules || {};
    app.modules.trivia = Trivia;

    Trivia.initMessage = '/trivia';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Trivia(message) {
        this.message_id_bot;
        this.chat = message.chat.id;
        this.creator_username = "";
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Trivia.prototype.onMessage = function (message) {
        var chat = message.chat.id,
            preg = this.preg;
        var textEx = message.text,
            text = "",
            from_id = message.from.id,
            username = message.from.username,
            message_id = message.message_id,
            reply_to_message = message.reply_to_message,
            reply_to_message_id;
            if (textEx) {
                text = textEx.toLowerCase();
                text = acentos(text);
            };
            if (reply_to_message) {
                reply_to_message_id = reply_to_message.message_id;
            };
        console.log(message);
        //REPLY MARKUP
        var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Seleccionar chat grupal"
        inline_button_califica.url = "https://telegram.me/ADA_ResCo_bot?startgroup=new";
        //
        inline_keyboard = [[inline_button_califica]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };
        /////////////////////////////////
        //TIEMPO
        //setTimeout(Trivia.terminar(this.chat, from_id, username, message_id), 5000);

        if (chat > 0 || chat == -1001061150661) {
            app.telegram.sendMessage(chat, "<i>Utiliza esta funionalidad solo en grupos o acá no está permitido!</i>", inline_markup);
            this.complete = true;
        }else{
            if (text == "/trivia") {
                // TIEMPO
                preg = pregunta();
                this.preg = preg;
                app.telegram.sendMessage(chat, "<b>Pregunta:</b> " + preg[0] + "\n<b>Vale:</b> " + preg[3] + " puntos!" +
                                                "\nPara <b>RESPONDER</b> o pedir una <b>PISTA</b> a ésta pregunta dale \"reply\" o \"responder\" a éste mensaje."+
                                                "\n\nPuedes pedir una <b>\"pista\"</b> si no sabes la respuesta."+
                                                "\nSi aún así no la sabes me puedes preguntar que es, y el item relacionado a la pregunta."+
                                                "\nUtiliza /cancel para terminar ¡la trivia!", null, message_id, 
                                                function(data){
                                                    console.log(JSON.stringify(data));
                                                    this.message_id_bot = data.result.message_id;
                                                });

            }else if(text == acentos(this.preg[1].toLowerCase()) && reply_to_message_id == message_id_bot){
                app.api.updateTriviaPoints(from_id, "sumar", preg[3], function(data){
                    app.telegram.sendMessage(chat, "Felicidades @" + username + ", has respondido <b>correctamente!</b> :D" +
                                                    "\n\nAhora tienes <b>" + data.trivia_points + " puntos!</b>" +
                                                        "\nPuedes consultar tu puntaje preguntando \"Ada quien soy?\" o \"Ada mis puntos\" "+
                                                        "\n\n<b>Trivia resuelta!</b>", null, message_id);
                });
                this.complete = true;
            }else if (text == "pista" && reply_to_message_id == message_id_bot) {
                app.telegram.sendMessage(chat, "<b>Pista:</b> " + this.preg[2], null, message_id);
            }else if(text == "/cancel" || text == "/cancel@adarefacto_bot" || text == "/cancel@ada_resco_bot"){
		   /*console.log("terminarTrivia");
		    app.api.updateTriviaPoints(from_id, "restar", function(data){
                    app.telegram.sendMessage(chat, "Lo lamento @" + username + ", has cancelado :(" +
                                                        "\n\nAhora tienes <b>" + data.trivia_points + " puntos!</b>" +
                                                        "\nPuedes consultar tu puntaje preguntando \"Ada quien soy?\" o \"Ada mis puntos\" ", null, message_id);
                    });*/
                app.telegram.sendMessage(chat, "<b>Trivia cancelada!</b>", null, message_id);
                this.complete = true;
            }
            else if (reply_to_message_id == message_id_bot){
                console.log(reply_to_message_id + " reply y bot ID " + message_id_bot)
                app.api.updateTriviaPoints(from_id, "restar", preg[3], function(data){
                    app.telegram.sendMessage(chat, "Lo lamento @" + username + ", has respondido <b>erróneamente!</b> :(" +
                                                        "\n\nAhora tienes <b>" + data.trivia_points + " puntos!</b>" +
                                                        "\nPuedes consultar tu puntaje preguntando \"Ada quien soy?\" o \"Ada mis puntos\" ", null, message_id);
                });
            }

        }
    };



    Trivia.terminar = function(chat_id, from_id, username, message_id) {
        app.api.updateTriviaPoints(from_id, "restar", preg[3], function(data){
            console.log("terminarTrivia");
            app.telegram.sendMessage(chat_id, "Lo lamento @" + username + ", iniciaste una trivia que <b>nadie</b> respondió..." +
                                                "\n\nAhora tienes <b>" + data.trivia_points + " puntos!</b>" +
                                                "\nPuedes consultar tu puntaje preguntando \"Ada quien soy?\" o \"Ada mis puntos\" ", null, message_id);
        });
        this.complete = true;
    };

    function pregunta(){
        // FORMATO: [pregunta, respuesta, pista]
        // Ejemplo: pregunta[0][0] es pregunta para la pregunta 1 (indice 0)
        // Ejemplo: pregunta[0][1] es respuesta  para la pregunta 1 (indice 0)
        // Ejemplo: pregunta[0][2] es pista  para la pregunta 1 (indice 0)
        var pregunta =  
                    [
                        ['¿Que capacidad de XM tiene un Agente nivel 1?',"3000","x000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 2?',"4000","x000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 3?',"5000","x000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 4?',"6000","x000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 5?',"7000","x000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 6?',"8000","x000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 7?',"9000","x000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 8?',"10000","xx000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 9?',"11500","xx500",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 10?',"13000","xx000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 11?',"14500","xx500",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 12?',"16000","xx000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 13?',"17500","xx500",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 14?',"19000","xx000",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 15?',"20500","xx500",1],
                        ['¿Que capacidad de XM tiene un Agente nivel 16?',"22000","xx000",1],
			['¿Que es un XMP?',"un tipo de arma que tienen un largo alcance y un critico no muy alto","ux tixx xx arxx xxx tixxxx xx laxxx alxxxxx x xx crxxxxx xx xxx alxx",3],
                        ['¿Para que son los XMP?',"se usan principalmente para tumbar resonadores","Sx usxx prinxxxxxxxxxe xxxx tumxxx rexxxxxxxxx",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 1?',"42","4x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 1?',"150","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 2?',"48","4x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 2?',"300","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 3?',"58","5x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 3?',"500","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 4?',"72","7x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 4?',"900","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 5?',"90","9x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 5?',"1200","xxx0",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 6?',"112","1xx",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 6?',"1500","xxx0",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 7?',"138","1xx",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 7?',"1800","xxx0",2],
                        ['¿Cual es el rango de ataque en metros de un XMP 8?',"168","1xx",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un XMP 8?',"2700","xxx0",2],
                        ['¿Que es un Ultra Strike?',"un tipo de arma que tienen un muy corto alcance pero tienen un critico de dano muy elevado","Ux tixx xx arxx xxx tixxx xx xxx cxxxx alxxxxx pxxx tixxx xx crixxxx xx dxxx xxx elexxxx",3],
                        ['¿Como uso mejor los Ultra Strike?',"parandote en el centro del portal","Parandote xx xx Cenxxx xxx poxxxx",2],
                        ['¿Cual es el rango de ataque en metros de un US 1?',"10","1x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 1?',"150","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un US 2?',"13","1x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 2?',"300","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un US 3?',"16","1x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 3?',"500","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un US 4?',"18","1x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 4?',"900","xx0",2],
                        ['¿Cual es el rango de ataque en metros de un US 5?',"21","2x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 5?',"1200","xxx0",2],
                        ['¿Cual es el rango de ataque en metros de un US 6?',"24","2x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 6?',"1500","xxx0",2],
                        ['¿Cual es el rango de ataque en metros de un US 7?',"27","2x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 7?',"1800","xxx0",2],
                        ['¿Cual es el rango de ataque en metros de un US 8?',"30","3x",2],
                        ['¿De cuanto es el critico de ataque en unidades de xm de un US 8?',"2700","xxx0",2],
                        ['¿Que es un ADA Refactor?',"son armas cuyo fin es reparar los portales del dano producido por jarvis y los iluminados","Sxx Armas cuxx xxx xx rexxxxx xxx poxxxxxx xxx daxx proxxxxxx xxx jaxxxx x xxx ilxxxxxxxx",5],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor?',"1000 de xm por cada nivel del portal","1xxx xx xM xxx xxxx nixxx xxx poxxxx",2],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 1?',"1000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 2?',"2000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 3?',"3000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 4?',"4000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 5?',"5000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 6?',"6000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 7?',"7000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 8?',"8000","xxx0",1],
                        ['¿Por qué hay portales con 8 resonadores 8 a nombre de un pitufo?',"porque un pitufo uso un ada refactor y los resos pasan a su nombre","porque ux pixxxx xsx xn axx rxxxcxxx y lxx rxxox pxxxn a xu nxxxrx",3],
                        ['¿Por qué hay portales con 8 resonadores a nombre de __ADA__?',"porque fue un sapo quien usó un ada","porque fxx xx saxx quxxx uxx xx xxx",3],
                        ['¿Que es un Jarvis Virus?',"son armas cuyo fin es infectar los portales","Sxx axmxx cxyx xix xs inxxxtxx xxs pxxtaxxx",3],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus?',"1000 de xm por cada nivel del portal","1xxx xx xM xxx xxxx nixxx xxx xxxxxx",3],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 1?',"1000","1xxx",1],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 2?',"2000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 3?',"3000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 4?',"4000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 5?',"5000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 6?',"6000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 7?',"7000","xxx0",1],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 8?',"8000","xxx0",1],
                        ['¿Por qué hay portales con 8 resonadores a nombre de un Sapo?',"porque un sapo uso un jarvis virus y los resos pasan a su nombre","porque ux sxxo uxx xn jxxxxs vxxxx y xox xexxs pxxxx a xu nxxxrx",3],
                        ['¿Por qué hay portales con 8 resonadores a nombre de __Jarvis__?',"porque fue un pitufo quien uso un jarvis","porque Fxx xx pixxxx qxxxx uxx xn xxxxxx",3],
                        ['¿Que es un Resonador?',"son items que te permiten capturar el portal para tu faccion","Sxx ixxxx xxx xx perxxxxx caxxxxxx xx poxxxx pxxx xx faxxxxx",3],
                        ['¿Cuanto XM tiene un resonador 1?',"1000","1xxx",1],
                        ['¿Cuanto XM tiene un resonador 2?',"1500","xxx0",1],
                        ['¿Cuanto XM tiene un resonador 3?',"2000","xxx0",1],
                        ['¿Cuanto XM tiene un resonador 4?',"2500","xxx0",1],
                        ['¿Cuanto XM tiene un resonador 5?',"3000","xxx0",1],
                        ['¿Cuanto XM tiene un resonador 6?',"4000","xxx0",1],
                        ['¿Cuanto XM tiene un resonador 7?',"5000","xxx0",1],
                        ['¿Cuanto XM tiene un resonador 8?',"6000","xxx0",1],
                        ['¿Cuantos resonadores 1 puede poner un agente?',"8","x",1],
                        ['¿Cuantos resonadores 2 puede poner un agente?',"4","x",1],
                        ['¿Cuantos resonadores 3 puede poner un agente?',"4","x",1],
                        ['¿Cuantos resonadores 4 puede poner un agente?',"4","x",1],
                        ['¿Cuantos resonadores 5 puede poner un agente?',"2","x",1],
                        ['¿Cuantos resonadores 6 puede poner un agente?',"2","x",1],
                        ['¿Cuantos resonadores 7 puede poner un agente?',"1","x",1],
                        ['¿Cuantos resonadores 8 puede poner un agente?',"1","x",1],
                        ['¿Cual es la adherencia extra de un Resonador?',"0%","x%",1],
                        ['¿Como debo poner los resonadores para maximizar defensa?',"lejos del portal","lexxx xxx poxxxx",1],
                        ['¿Cuanto XM tiene un portal 1?',"8000","xx00",2],
                        ['¿Cuanto XM tiene un portal 2?',"12000","xxx00",2],
                        ['¿Cuanto XM tiene un portal 3?',"16000","xxx00",2],
                        ['¿Cuanto XM tiene un portal 4?',"20000","xxx00",2],
                        ['¿Cuanto XM tiene un portal 5?',"24000","xxx00",2],
                        ['¿Cuanto XM tiene un portal 6?',"32000","xxx00",2],
                        ['¿Cuanto XM tiene un portal 7?',"40000","xxx00",2],
                        ['¿Cuanto XM tiene un portal 8?',"48000","xxx00",2],
                        ['¿Que es el XM?',"materia exotica","maxxxxx exoxxxx",2],
                        ['¿Cuales son los nuevos lideres de ambas facciones?',"jahan y acolita","Jxxxn y axxxxxa",2],
                        ['¿Que es un Power Cube?',"son items que guardan xm","Sxx itxxx xxx guaxxxx Xx",1],
                        ['¿Para que son los Power Cube?',"recuperar xm","rexxxxxxx Xx",1],
			['¿Cuanto XM puede un Cubo nivel 1 almacenar?',"1000","xxxx",1],
			['¿Cuanto XM puede un Cubo nivel 2 almacenar?',"2000","xxxx",1],
			['¿Cuanto XM puede un Cubo nivel 3 almacenar?',"3000","xxxx",1],
			['¿Cuanto XM puede un Cubo nivel 4 almacenar?',"4000","xxxx",1],
			['¿Cuanto XM puede un Cubo nivel 5 almacenar?',"5000","xxxx",1],
			['¿Cuanto XM puede un Cubo nivel 6 almacenar?',"6000","xxxx",1],
			['¿Cuanto XM puede un Cubo nivel 7 almacenar?',"7000","xxxx",1],
			['¿Cuanto XM puede un Cubo nivel 8 almacenar?',"8000","xxxx",1],
                        ['¿Que es un Cubo Lawson?',"son items patrocinados","Sxx itxxx paxxxcixxxxs",2],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 1?',"18000","1xx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 2?',"20250","2xxx0",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 3?',"21500","2xxx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 4?',"24750","2xxx0",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 5?',"27000","2xx000",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 6?',"29250","2xxxx0",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 7?',"31500","3xx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 8?',"33750","3xxx0",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 9?',"36000","3x000",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 10?',"38400","3xx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 11?',"40800","4xx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 12?',"43200","4xx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 13?',"45600","4xx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 14?',"48000","4x000",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 15?',"50400","5xx00",3],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 16?',"52800","5xx00",3],
                        ['¿Para que son las llaves?',"recargar, enlazar y ver portales","rexxxxxx, enlxxxx y vxx porxxxxx",2],
                        ['¿Que debo reciclar cuando no tengo XM ni Cubos?',"llaves y xmp de nivel bajo","llxxxx y Xxx xx nixxx baxx",2],
                        ['¿Cuanto XM me da un item al reciclarlo?',"cada item tiene un valor especial de XM","caxx itxx txxxx un vaxxx espxxxxx xx Xx",3],
                        ['¿Cuanto XM me da un item nivel 1 al reciclarlo?',"20","x0",1],
                        ['¿Cuanto XM me da un item nivel 2 al reciclarlo?',"40","x0",1],
                        ['¿Cuanto XM me da un item nivel 3 al reciclarlo?',"60","x0",1],
                        ['¿Cuanto XM me da un item nivel 4 al reciclarlo?',"80","x0",1],
                        ['¿Cuanto XM me da un item nivel 5 al reciclarlo?',"100","xx0",1],
                        ['¿Cuanto XM me da un item nivel 6 al reciclarlo?',"120","xx0",1],
                        ['¿Cuanto XM me da un item nivel 7 al reciclarlo?',"140","xx0",1],
                        ['¿Cuanto XM me da un item nivel 8 al reciclarlo?',"160","xx0",1],
                        ['¿Cuanto XM me da un item común al reciclarlo?',"40","x0",1],
                        ['¿Cuanto XM me da un item raro al reciclarlo?',"80","x0",1],
                        ['¿Cuanto XM me da un item muy raro al reciclarlo?',"100","x00",1],
                        ['¿Cuanto XM me da una llave al reciclarla?',"500","x00",1],
                        ['¿Que es un Mod?',"son un tipo de items que cambian las condiciones basicas del portal","Sxx xx tixx xx itxxx xxx caxbxxx xxx conxxcxxxxx baxxxxx dxx poxxxx",3],
                        ['¿Que items tienen adherencia extra?',"escudos y turret","Escxxxx y tuxxxx",3], 
                        ['¿Cuantos mods puede poner un Agente?',"dos","xxx",1],
                        ['¿Que es un Escudo?',"son mods que aumentan la defensa del portal","Sxx mxxx xxx auxxxxxx xx defxxxx xxx poxxxx",2],
                        ['¿Cual es la adherencia extra de un Escudo Común?',"0%","x%",2],
                        ['¿Cual es la adherencia extra de un Escudo Raro?',"15%","x5%",2],
                        ['¿Cual es la adherencia extra de un Escudo Muy Raro?',"45%","4x%",2],
                        ['¿Cual es la adherencia extra de un AXA?',"80%","x0%",1],
                        ['¿Cual es la mitigación de ataque de un Escudo Común?',"30%","x0%",1],
                        ['¿Cual es la mitigación de ataque de un Escudo Raro?',"40%","x0%",1],
                        ['¿Cual es la mitigación de ataque de un Escudo Muy Raro?',"60%","x0%",1],
                        ['¿Cual es la mitigación de ataque de un AXA?',"70%","x0%",1],
                        ['¿Que es un AXA?',"son escudos patrocinados","Sxx esxxxxx patxxxxxxxxx",2],
                        ['¿Que pasa si pongo mas de un Escudo?',"los valores de mitigacion se suman","Lxx valxxxx xx mitixxxxxx xx suxxx",2],
                        ['¿Que pasa si pongo 2 Escudos?',"los valores de mitigacion se suman","Lxx valxxxx xx mitixxxxxx xx suxxx",2],
                        ['¿Que pasa si pongo 3 Escudos?',"los valores de mitigacion se suman","Lxx valxxxx xx mitixxxxxx xx suxxx",2],
                        ['¿Que pasa si pongo 4 Escudos?',"los valores de mitigacion se suman","Lxx valxxxx xx mitixxxxxx xx suxxx",2],
                        ['¿Que quiere decir que un Escudo aumenta la mitigación de ataque de un portal?',"que aumentan la defensa de un portal","Qxx aumxxxx xx defxxxx xx xx poxxxx",3],
                        ['¿Que es un Link Amp?',"es un mod","xx ux mxx",1],
                        ['¿Para que son los Link Amp?',"mods cuyo efecto es aumentar la distancia de linkeo","moxx cuxx efxxxo xx auxxxxx xx disxxxxxx xx lxxkxx",2],
                        ['¿Cual es la adherencia extra de un Link Amp?',"0%","x%",1],
                        ['¿Para que son los Softbank Ultra Link?',"aumentar alcance, aumentar defensa y aumentar links salientes","aumenxxx alcxxxx, aumxxxxx defxxxx y auxxxxxx linxx salixxxxx",3],
                        ['¿Cual es la adherencia extra de un Softbank Ultra Link?',"0%","x%",2],
                        ['¿Que item aumenta la distancia máxima de un portal?',"link amp o softbank ultra link","Lixx axx o sofxxxxx ulxxx lixx",3],
                        ['¿Que amplificador de link tiene una razón de aumento de distancia mayor?',"link amp muy raro","lixx axx mxx raxx",2],
                        ['¿Que amplificador de link tiene una razón de aumento de distancia medio?',"softbank ultra link","Sofxxxxx ulxxx lixx",2],
                        ['¿Que amplificador de link tiene una razón de aumento de distancia menor?',"link amp raro","lixx axx raxx",2],
                        ['¿Cual es el factor de aumento de un Link Amp Raro?',"2","x",1],
                        ['¿Cual es el factor de aumento de un Softbank Ultra Link?',"5","x",1],
                        ['¿Cual es el factor de aumento de un Link Amp Muy Raro?',"7","x",1],
                        ['¿Como obtengo Link Amp Muy Raro?',"solo a traves de passcode","soxx x txxxx xx paxscxxe",2],
                        ['¿Que características especiales tiene un Softbank Ultra Link?',"aumenta defensa y aumenta links salientes","aumxxxx defxxxx y auxxxxx linxx salixxxxx",3],
                        ['¿Cual es la mitigación de ataque de un Softbank Ultra Link?',"15%","xx%",2],
                        ['¿Cuantos links de salida agrega un Softbank Ultra Link?',"8","x",1],
                        ['¿Que pasa si pongo mas de un LA o SBUL?',"se reduce su eficacia","Sx redxxx xx efixxxxx",2],
                        ['¿Que pasa si pongo 2 LA o SBUL?',"el primero tiene una eficacia del 100% y el segundo del 25%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx del xx%",2],
                        ['¿Que pasa si pongo 3 LA o SBUL?',"el primero tiene una eficacia del 100%, el segundo del 25% y el tercero de 12.5%","El prixxxx tienx una eficxxxx del x00%, el sexxxxx del xx% y ex tercxxx dx xx.x%",3],
                        ['¿Que pasa si pongo 4 LA o SBUL?',"el primero tiene una eficacia del 100%, el segundo del 25%, el tercero de 12.5% y el cuarto de 12.5%","El prixxxx tienx una eficxxxx del x00%, el sexxxxx del xx%, ex tercxxx de xx.x% y xx cuxxxx dx xx.x%",5],
                        ['¿Que quiere decir que un Amplificador de Link aumenta la distancia de un portal?',"que aumenta la distancia que puede alcanzar un portal para ser linkeado","Qux aumxxxa xx disxxxxxx xxe puexx alcxxzxx xx poxxxx paxx xxr linxxxxx",3],
                        ['¿con que formula se calcula el rango de un portal?',"160m * (promedio^4)","xxxm * (proxxxxx^x)",4],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [1]',"160 m","xx0 x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[8] [8] [8] [8] [8] [8] [8] [8]',"655.36 km","xxx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [2]',"256.28 m","xxx.xx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [3] [4]',"1.97 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [3] [5]',"2.56 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [3] [6]',"3.26 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [3] [7]',"4.1 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [3] [8]',"5.09 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [4] [8]',"6.25 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [6] [8]',"10.93 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [7] [8]',"12.96 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [2]',"259.28 m","xxx.xx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [3]',"390.62 m","xxx.xx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [4]',"571.91 m","xxx.xx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [5]',"810 m","xxx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [6]',"1.11 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [1] [7]',"1.5 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [2] [2]',"390.62 m","xxx.xx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [2] [3]',"571.91 m","xxx.xx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [2] [4]',"810 m","xxx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [2] [5]',"1.11 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [2] [6]',"1.5 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [3] [3]',"810 m","xxx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [3] [4]',"1.11 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [3] [6]',"1.97 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [4] [6]',"2.56 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [5] [8]',"5.09 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [1] [7] [8]',"7.59 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [2] [2]',"571.91 m","xxx.xx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [2] [3]',"810 m","xxx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [2] [7]',"2.56 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [2] [8]',"3.26 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [3] [3]',"1.11 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [3] [4]',"1.5 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [4] [7]',"4.1 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [6] [7]',"6.25 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [6] [8]',"7.59 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [2] [7] [8]',"9.15 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [3] [4]',"1.97 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [3] [5]',"2.56 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [5] [6]',"5.09 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [5] [7]',"6.25 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [3] [7] [8]',"10.93 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [4] [4]',"3.26 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [4] [5]',"4.1 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [4] [7]',"6.25 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [5] [7]',"7.59 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [6] [7]',"9.15 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [7] [8]',"12.96 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [4] [8] [8]',"15.25 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [5] [7] [8]',"15.25 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [6] [6] [6]',"10.93 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [6] [7] [8]',"17.85 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [6] [8] [8]',"20.75 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [7] [7] [7]',"17.85 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [7] [7] [8]',"20.75 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [7] [8] [8]',"24.01 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [1] [8] [8] [8]',"27.62 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [2] [2]',"810 m","xxx x",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [2] [3]',"1.11 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [2] [4]',"1.5 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [2] [5]',"1.97 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [2] [6]',"2.56 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [2] [7]',"3.26 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [3] [3]',"1.5 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [5] [6]',"5.09 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [2] [6] [8]',"9.15 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [3] [3]',"1.97 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [3] [4]',"2.56 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [3] [5]',"3.26 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [3] [6]',"4.1 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [5] [6]',"6.25 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [5] [7]',"7.59 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [5] [8]',"9.15 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [6] [8]',"10.93 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [7] [8]',"12.96 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [3] [8] [8]',"15.25 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [4] [4] [4]',"4.1 km","x.x xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [4] [4] [5]',"5.09 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [4] [5] [7]',"9.15 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [4] [5] [8]',"10.93 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [4] [6] [8]',"12.96 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [4] [7] [8]',"15.25 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [4] [8] [8]',"17.85 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [5] [5] [5]',"7.59 km","x.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [5] [7] [8]',"17.85 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [5] [8] [8]',"20.75 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [6] [6] [6]',"12.96 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [6] [6] [7]',"15.25 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [6] [7] [8]',"20.75 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [6] [8] [8]',"24.01 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [7] [7] [7]',"20.75 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [7] [7] [8]',"24.01 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [7] [8] [8]',"27.62 km","xx.xx xx",3],
                        ['¿Cual es el rango de alcanze de un portal -especifica la unidad- sin amplificadores de link y con la siguiente configuracion de resos?:'+'\n[1] [1] [1] [1] [2] [8] [8] [8]',"31.64 km","xx.xx xx",3],
                        ['¿Que es un Heat Sink?',"es un mod","Ex xx mxx",1],
                        ['¿Para que son los Heat Sink?',"reducir el tiempo para volver a hackear","Redxxxr xx tiexxx pxxx volxxx x haxxxxr",3],
                        ['¿Cual es la adherencia extra de un Heat Sink?',"0%","x%",1],
                        ['¿Que caracteristica especial tienen los Heat Sink?',"resetea los hacks y el tiempo inmediatamente para el que lo pone","Resxxxx lxs haxxx y xx tiexxx inmexxxxxxxte paxx xx qxx lo poxx",4], 
                        ['¿Que pasa si pongo mas de un Heat Sink?',"se reduce su eficacia","Sx redxxx xx efixxxxx",2],
                        ['¿Que pasa si pongo 2 Heat Sink?',"el primero tiene una eficacia del 100% y el segundo del 50%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx del xx%",2],
                        ['¿Que pasa si pongo 3 Heat Sink?',"el primero tiene una eficacia del 100% y el segundo y tercero del 50%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx y terxxxx del xx%",3],
                        ['¿Que pasa si pongo 4 Heat Sink?',"el primero tiene una eficacia del 100% y el segundo, tercero del 50% y el cuarto del 50%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx, terxxxx del xx% y el cuxxxx del xx%",4],
                        ['¿A quien le resetea el numero de Hacks un Heat Sink?',"solamente al que lo ponga","Solxxxxxe xx xxe xx poxxx",2],
                        ['¿Cual es el porcentaje de reducción entre hackeos de un Heat Sink Común?',"20%","xx%",1],
                        ['¿Cual es el porcentaje de reducción entre hackeos de un Heat Sink Raro?',"50%","xx%",1],
                        ['¿Cual es el porcentaje de reducción entre hackeos de un Heat Sink Muy Raro?',"70%","xx%",1],
                        ['¿Que es un Multi Hack?',"xx un mod","xx ux mxx",1],
                        ['¿Para que son los Multi Hack?',"aumentar el numero de hacks","auxxxxxx ex nuxxxx xe haxxx",2],
                        ['¿Cual es la adherencia extra de un Multi Hack?',"0%","x%",1],
                        ['¿Que pasa si pongo mas de un Multi Hack?',"se reduce su eficacia","Sx redxxx xx efixxxxx",2],
                        ['¿Que pasa si pongo 2 Multi Hack?',"el primero tiene una eficacia del 100% y el segundo del 50%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx del xx%",2],
                        ['¿Que pasa si pongo 3 Multi Hack',"el primero tiene una eficacia del 100%, el segundo del 50% y el tercero del 50%","El prixxxx tienx una eficxxxx del x00%, el sexxxxx del xx% y xx terxxxx del xx%",4],
                        ['¿Que pasa si pongo 4 Multi Hack?',"el primero tiene una eficacia del 100% y el segundo, tercero y cuarto del 50%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx, terxxxx y cuxxxx del xx%",3],
                        ['¿Cuantos Hacks mas da un Multi Hack Común?',"4","x",1],
                        ['¿Cuantos Hacks mas da un Multi Hack Raro?',"8","x",1],
                        ['¿Cuantos Hacks mas da un Multi Hack Muy Raro?',"12","xx",1],
                        ['¿Que es un Force Amp?',"es un mod","xx ux mxx",1],
                        ['¿Cual es la adherencia extra de un Force Amp?',"0%","x%",1],
                        ['¿Para que son los Force Amp?',"aumentar el dano que el portal hace","auxxxxxr ex daxx qxx xl porxxx haxx",2],
                        ['¿cuanto aumenta un Force Amp la fuerza de ataque?',"el doble","ex doxxx",1],
                        ['¿Que pasa si pongo mas de un Force Amp?',"se reduce su eficacia","Sx redxxx xx efixxxxx",2],
                        ['¿Que pasa si pongo 2 Force Amp?',"el primero tiene una eficacia del 100% y el segundo del 25%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx del xx%",2],
                        ['¿Que pasa si pongo 3 Force Amp?',"el primero tiene una eficacia del 100%, el segundo del 25% y el tercero de 12.5%","El prixxxx tienx una eficxxxx del x00%, el sexxxxx del xx% y ex tercxxx dx xx.x%",3],
                        ['¿Que pasa si pongo 4 Force Amp?',"el primero tiene una eficacia del 100%, el segundo del 25%, el tercero de 12.5% y el cuarto de 12.5%","El prixxxx tienx una eficxxxx del x00%, el sexxxxx del xx%, ex tercxxx de xx.x% y xx cuxxxx dx xx.x%",4],
                        ['¿Que es una Turret?',"es un mod","xx ux mxx",1],
                        ['¿En cuanto aumenta el critico de ataque en unidades de xm una Turret?',"20%","xx%",2],
                        ['¿Cuantas veces aumenta el factor de ataque una Turret?',"1.5 veces","x.x vexxx",3],
                        ['¿Que quiere decir que una Turret aumenta el factor de ataque?',"aumenta las veces que el portal te golpea","Auxxxxx lxx vexxx xux xx poxxxl xx golxxx",3],
                        ['¿Cual es la adherencia extra de una Turret?',"20%","xx%",2],
                        ['¿Que pasa si pongo mas de una Turret?',"se reduce la eficacia del factor de ataque","Sx redxxx xx efixxxxx dxx facxxx dx ataxxx",3],
                        ['¿Que pasa si pongo 2 Turret?',"el primero tiene una eficacia del 100% y el segundo del 25%","El prixxxx tienx una eficxxxx del x00% y el sexxxxx del xx%",2],
                        ['¿Que pasa si pongo 3 Turret?',"el primero tiene una eficacia del 100%, el segundo del 25% y el tercero de 12.5%","El prixxxx tienx una eficxxxx del x00%, el sexxxxx del xx% y ex tercxxx dx xx.x%",3],
                        ['¿Que pasa si pongo 4 Turret?',"el primero tiene una eficacia del 100%, el segundo del 25% y el tercero de 12.5% y el cuarto de 12.5%","El prixxxx tienx una eficxxxx del x00%, el sexxxxx del xx%, ex tercxxx de xx.xxx y el cuxxxx dx xx.x%",4],
                        ['¿Que es mejor un ADA Refactor o un Jarvis Virus?, ¿Por qué?',"un ada, porque vuelve los portales azules","Ux xxx, poxxux vuelxx lxx porxxxxx azxxxx",5],
                        ['¿Para que son las Capsulas?',"son para guardar, organizar y pasar inventario a otros agentes","Sxx pxxx guaxxxx, orxxxxxxx y pasxx invxxxxxxx x otrxx agexxxx",3],
                        ['¿Que es una Capsula Mufg?',"son items patrocinados","Sxx itxxx paxxxxxxxxxx",3],
                        ['¿Para que es una Capsula Mufg?',"es para multiplicar los items que hay dentro","Ex paxx mulxxxxxxxx lxx ixxxs xxe xax denxxx",3],
                        ['¿Como puedo multiplicar items?',"poniendolos en capsulas mufg","Ponxxxxxxxx xx capxxxxx mxxx",3],
                        ['¿Que es una Capsula de Llaves/keylocker?',"son items de pago","Sxx itxxx dx paxx",3],
                        ['¿De que están hechas las Capsulas de Llaves?',"estan hechas de darkxm","Esxxx hexxxs xe daxkxx",3],
                        ['¿Para que son los Keylocker?',"guardar llaves","Guaxxxx lxxxxx",3],
                        ['¿Como aumento el espacio en mi invientario?',"comprando keylocker","comxxxxxx kxxlxxxxx",4],
                        ['¿Como se hace un Hack con glifos?',"dejando presionado el boton de hack por unos segundos","Dejanxx prexxxxxxx ex botxx dx haxxx pxx uxx segxxxxx",3],
                        ['¿Como se hace un Hack complejo?',"con el glifo complex","Cxx ex glxxx comxxxx",1],
                        ['¿Como se hace un Hack simple?',"con el glifo simple","Cxx ex glxxx simxxx",1],
                        ['¿Como se hace un Hack Mas llave?',"con el glifo more","Cxx ex glxxx moxx",1],
                        ['¿Como se hace un Hack Sin llave?',"con el glifo less","Cxx ex glxxx lexx",1],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 1?',"250","xx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 2?',"500","xx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 3?',"750","xx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 4?',"1000","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 5?',"1250","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 6?',"1500","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 7?',"1750","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 8?',"2000","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 9?',"2250","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 10?',"2500","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 11?',"2750","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 12?',"3000","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 13?',"3250","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 14?',"3500","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 15?',"3750","xxx0",3],
                        ['¿Que rango de recarga en kilometros tiene un Agente nivel 16?',"4000","xxx0",3]
                    ];

        //No modificar más, solo añadir preguntas en ese formato...
        var indice = Math.floor((Math.random() * (pregunta.length)));
        return pregunta[indice];
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
}());
