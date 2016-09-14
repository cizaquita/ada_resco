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
        this.chat = message.chat.id,
        this.from_id = message.from.id;
        this.username = message.from.username,
        this.message_id = message.message_id;
        this.onMessage(message);
        this.preg;
    }

    /**
     * @param message {object} Telegram message object
     */
    Trivia.prototype.onMessage = function (message) {
        var chat = message.chat.id;
        var textEx = message.text,
            text = "",
            from_id = message.from.id,
            username = message.from.username,
            message_id = message.message_id;
            if (textEx) {
                text = textEx.toLowerCase();
                text = acentos(text);
            };
        console.log(this.chat);
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

        if (chat > 0) {
            app.telegram.sendMessage(chat, "<i>Utiliza esta funionalidad solo en grupos!</i>", inline_markup);
            this.complete = true;
        }else{
            if (text == "/trivia") {
                this.preg = pregunta();
                app.telegram.sendMessage(chat, "<b>Pregunta:</b> " + this.preg[0] +
                                                "\n\nSi no aciertas te elimina un punto!"+
                                                "\nPuedes pedir una <b>\"pista\"</b> si eres muy no0b."+
                                                "\nUtiliza /cancel para terminar la trivia!", null, message_id);
            }else if(text == acentos(this.preg[1].toLowerCase())){
                app.api.updateTriviaPoints(from_id, "sumar", function(data){
                    app.telegram.sendMessage(chat, "Felicidades @" + username + ", has respondido <b>correctamente!</b> :D" +
                                                    "\n\nAhora tienes <b>" + data.trivia_points + " puntos!</b>" +
                                                        "\nPuedes consultar tu puntaje preguntando \"Ada quien soy?\" o \"Ada mis puntos\" "+
                                                        "\n\n<b>Trivia resuelta!</b>", null, message_id);
                });
                this.complete = true;
            }else if (text == "pista") {
                app.telegram.sendMessage(chat, "<b>Pista:</b> " + this.preg[2], null, message_id);
            }else if(text == "/cancel" || text == "/cancel@adarefacto_bot" || text == "/cancel@ada_resco_bot"){
                app.telegram.sendMessage(chat, "<b>Trivia cancelada!</b>", null, message_id);
                this.complete = true;
            }
            else{
                app.api.updateTriviaPoints(from_id, "restar", function(data){
                    app.telegram.sendMessage(chat, "Lo lamento @" + username + ", has respondido <b>erróneamente!</b> :(" +
                                                        "\n\nAhora tienes <b>" + data.trivia_points + " puntos!</b>" +
                                                        "\nPuedes consultar tu puntaje preguntando \"Ada quien soy?\" o \"Ada mis puntos\" ", null, message_id);
                });
            }

        }

    };

    function pregunta(){
        // FORMATO: [pregunta, respuesta, pista]
        // Ejemplo: pregunta[0][0] es pregunta para la pregunta 1 (indice 0)
        // Ejemplo: pregunta[0][1] es respuesta  para la pregunta 1 (indice 0)
        // Ejemplo: pregunta[0][1] es pista  para la pregunta 1 (indice 0)
        var pregunta =  
                    [
                        ['¿Que capacidad de XM tiene un Agente nivel 1?',"3000","x000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 2?',"4000","x000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 3?',"5000","x000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 4?',"6000","x000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 5?',"7000","x000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 6?',"8000","x000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 7?',"9000","x000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 8?',"10000","xx000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 9?',"11500","xx500"],
                        ['¿Que capacidad de XM tiene un Agente nivel 10?',"13000","xx000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 11?',"14500","xx500"],
                        ['¿Que capacidad de XM tiene un Agente nivel 12?',"16000","xx000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 13?',"17500","xx500"],
                        ['¿Que capacidad de XM tiene un Agente nivel 14?',"19000","xx000"],
                        ['¿Que capacidad de XM tiene un Agente nivel 15?',"20500","xx500"],
                        ['¿Que capacidad de XM tiene un Agente nivel 16?',"22000","xx000"],
			['¿Que es un XMP?',"un tipo de arma que tienen un largo alcance y un critico no muy alto","un tipo de arma xxx xxxxxx xx xxxxx xxxxxxx x xx xxxxxxx xx xxx xxxx"],
                        ['¿Para que son los XMP?',"se usan principalmente para tumbar resonadores","Se usan xxxxxxxxxxxxxx xxxx xxxxxx xxxxxxxxxxx"],
                        ['¿Cual es el rango de ataque de un XMP 1?',"42m","4xx"],
                        ['¿De cuanto es el critico de ataque de un XMP 1?',"150 xm","1xx Xx"],
                        ['¿Cual es el rango de ataque de un XMP 2?',"48m","4xx"],
                        ['¿De cuanto es el critico de ataque de un XMP 2?',"300 xm","3xx Xx"],
                        ['¿Cual es el rango de ataque de un XMP 3?',"58m","5xx"],
                        ['¿De cuanto es el critico de ataque de un XMP 3?',"500 xm","5xx Xx"],
                        ['¿Cual es el rango de ataque de un XMP 4?',"72m","7xx"],
                        ['¿De cuanto es el critico de ataque de un XMP 4?',"900 xm","9xx Xx"],
                        ['¿Cual es el rango de ataque de un XMP 5?',"90m","9xx"],
                        ['¿De cuanto es el critico de ataque de un XMP 5?',"1200 xm","1xxx Xx"],
                        ['¿Cual es el rango de ataque de un XMP 6?',"112m","1xxx"],
                        ['¿De cuanto es el critico de ataque de un XMP 6?',"1500 xm","1xxx Xx"],
                        ['¿Cual es el rango de ataque de un XMP 7?',"138m","1xxx"],
                        ['¿De cuanto es el critico de ataque de un XMP 7?',"1800 xm","1xxx Xx"],
                        ['¿Cual es el rango de ataque de un XMP 8?',"168m","1xxx"],
                        ['¿De cuanto es el critico de ataque de un XMP 8?',"2700 xm","2xxx Xx"],
                        ['¿Que es un Ultra Strike?',"un tipo de arma que tienen un muy corto alcance pero tienen un critico de dano muy elevado","Un tipo de arma xxx xxxxxx xx xxx xxxxx xxxxxxx xxxx xxxxxx xx xxxxxxx xx xxxx xxx xxxxxxx"],
                        ['¿Como uso mejor los Ultra Strike?',"parandote en el centro del portal","Parandote xx xx Cenxxx xxx xxxxxx"],
                        ['¿Cual es el rango de ataque de un US 1?',"10m","1xx"],
                        ['¿De cuanto es el critico de ataque de un US 1?',"150 xm","1xx Xx"],
                        ['¿Cual es el rango de ataque de un US 2?',"13m","1xx"],
                        ['¿De cuanto es el critico de ataque de un US 2?',"300 xm","3xx Xx"],
                        ['¿Cual es el rango de ataque de un US 3?',"16m","1xx"],
                        ['¿De cuanto es el critico de ataque de un US 3?',"500 xm","5xx Xx"],
                        ['¿Cual es el rango de ataque de un US 4?',"18m","1xx"],
                        ['¿De cuanto es el critico de ataque de un US 4?',"900 xm","9xx Xx"],
                        ['¿Cual es el rango de ataque de un US 5?',"21m","2xx"],
                        ['¿De cuanto es el critico de ataque de un US 5?',"1200 xm","1xxx Xx"],
                        ['¿Cual es el rango de ataque de un US 6?',"24m","2xx"],
                        ['¿De cuanto es el critico de ataque de un US 6?',"1500 xm","1xxx Xx"],
                        ['¿Cual es el rango de ataque de un US 7?',"27m","2xx"],
                        ['¿De cuanto es el critico de ataque de un US 7?',"1800 xm","1xxx Xx"],
                        ['¿Cual es el rango de ataque de un US 8?',"30m","3xx"],
                        ['¿De cuanto es el critico de ataque de un US 8?',"2700 xm","2xxx Xx"],
                        ['¿Que es un ADA Refactor?',"son armas cuyo fin es reparar los portales del daño producido por jarvis y los iluminados","Sxx Armas xxxx xxx xx rexxx xxx xxxxxxxx xxx xxxx xxxxxxxxx xxx xxxxxx x xxx xxxxxxxxxx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor?',"1000 de xm por cada nivel del portal","1xxx xx xM xxx xxxx nixxx xxx xxxxxx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 1?',"1000 XM","1xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 2?',"2000 XM","2xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 3?',"3000 XM","3xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 4?',"4000 XM","4xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 5?',"5000 XM","5xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 6?',"6000 XM","6xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 7?',"7000 XM","7xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un ADA Refactor en un portal 8?',"8000 XM","8xxx Xx"],
                        ['¿Por qué hay portales con 8 resonadores a nombre de un pitufo?',"porque todos los resos pasan a ser del agente que los coloco","porque toxxx lxx rexxx pxxxx x sxx dxx agexxx qxx lxx cxxxxx"],
                        ['¿Por qué hay portales con 8 resonadores a nombre de __ADA__?',"porque fue un sapo quien usó el ada","porque fxx xx saxx quxxx uxx xx xxx"],
                        ['¿Que es un Jarvis Virus?',"son armas cuyo fin es infectar los portales","Sxx axxxx cxxxx xxx xx inxxxxxx xxx pxxxxxxx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus?',"1000 de xm por cada nivel del portal","1xxx xx xM xxx xxxx nixxx xxx xxxxxx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 1?',"1000 XM","1xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 2?',"2000 XM","2xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 3?',"3000 XM","3xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 4?',"4000 XM","4xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 5?',"5000 XM","5xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 6?',"6000 XM","6xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 7?',"7000 XM","7xxx Xx"],
                        ['¿Cuanto XM se debe tener para usar un Jarvis Virus en un portal 8?',"8000 XM","8xxx Xx"],
                        ['¿Por qué hay portales con 8 resonadores a nombre de un Sapo?',"porque todos los resos pasan a ser del agente que los coloco","porque toxxx lxx rexxx pxxxx x sxx dxx agexxx qxx lxx cxxxxx"],
                        ['¿Por qué hay portales con 8 resonadores a nombre de __Jarvis__?',"porque fue un pitufo quien usó el ada","porque Fxxx xx pixxxx qxxxx xxx xx xxx"],
                        ['¿Que es un Resonador?',"son items que te permiten capturar el portal para tu faccion","Sxx ixxxx xxx xx perxxxxx caxxxxxx xx poxxxx pxxx xx faxxxxx"],
                        ['¿Cuanto XM tiene un resonador 1?',"1000 xm","1xxx Xx"],
                        ['¿Cuanto XM tiene un resonador 2?',"1500 xm","xxx Xx"],
                        ['¿Cuanto XM tiene un resonador 3?',"2000 xm","xxx Xx"],
                        ['¿Cuanto XM tiene un resonador 4?',"2500 xm","xxx Xx"],
                        ['¿Cuanto XM tiene un resonador 5?',"3000 xm","xxx Xx"],
                        ['¿Cuanto XM tiene un resonador 6?',"4000 xm","xxx Xx"],
                        ['¿Cuanto XM tiene un resonador 7?',"5000 xm","xxx Xx"],
                        ['¿Cuanto XM tiene un resonador 8?',"6000 xm","xxx Xx"],
                        ['¿Cuantos resonadores 1 puede poner un agente?',"8 resonadores","x resxxxxxxxx"],
                        ['¿Cuantos resonadores 2 puede poner un agente?',"4 resonadores","x resxxxxxxxx"],
                        ['¿Cuantos resonadores 3 puede poner un agente?',"4 resonadores","x resxxxxxxxx"],
                        ['¿Cuantos resonadores 4 puede poner un agente?',"4 resonadores","x resxxxxxxxx"],
                        ['¿Cuantos resonadores 5 puede poner un agente?',"2 resonadores","x resxxxxxxxx"],
                        ['¿Cuantos resonadores 6 puede poner un agente?',"2 resonadores","x resxxxxxxxx"],
                        ['¿Cuantos resonadores 7 puede poner un agente?',"1 resonadores","x resxxxxxxxx"],
                        ['¿Cuantos resonadores 8 puede poner un agente?',"1 resonadores","x resxxxxxxxx"],
                        ['¿Cual es la adherencia extra de un Resonador?',"0%","x%"],
                        ['¿Como debo poner los resonadores para maximizar defensa?',"lejos del portal","lexxx xxx poxxxx"],
                        ['¿Cuanto XM tiene un portal 1?',"8000 xm","x000 Xx"],
                        ['¿Cuanto XM tiene un portal 2?',"12000 xm","xx000 Xx"],
                        ['¿Cuanto XM tiene un portal 3?',"16000 xm","xx000 Xx"],
                        ['¿Cuanto XM tiene un portal 4?',"20000 xm","xx000 Xx"],
                        ['¿Cuanto XM tiene un portal 5?',"24000 xm","xx000 Xx"],
                        ['¿Cuanto XM tiene un portal 6?',"32000 xm","xx000 Xx"],
                        ['¿Cuanto XM tiene un portal 7?',"40000 xm","xx000 Xx"],
                        ['¿Cuanto XM tiene un portal 8?',"48000 xm","xx000 Xx"],
                        ['¿Que es el XM?',"materia exotica","maxxxxx exoxxxx"],
                        ['¿Cuales son los nuevos lideres de ambas facciones?',"jahan y acolita","Jxxxn y axxxxxa"],
                        ['¿Que es un Power Cube?',"son items que guardan xm","Sxx itxxx xxx guaxxxx Xx"],
                        ['¿Para que son los Power Cube?',"recuperar xm","rexxxxxxx Xx"],
			['¿Cuanto XM puede un Cubo nivel 1 almacenar?',"1000 xm","x000 Xx"],
			['¿Cuanto XM puede un Cubo nivel 2 almacenar?',"2000 xm","x000 Xx"],
			['¿Cuanto XM puede un Cubo nivel 3 almacenar?',"3000 xm","x000 Xx"],
			['¿Cuanto XM puede un Cubo nivel 4 almacenar?',"4000 xm","x000 Xx"],
			['¿Cuanto XM puede un Cubo nivel 5 almacenar?',"5000 xm","x000 Xx"],
			['¿Cuanto XM puede un Cubo nivel 6 almacenar?',"6000 xm","x000 Xx"],
			['¿Cuanto XM puede un Cubo nivel 7 almacenar?',"7000 xm","x000 Xx"],
			['¿Cuanto XM puede un Cubo nivel 8 almacenar?',"8000 xm","x000 Xx"],
                        ['¿Que es un Cubo Lawson?',"son items patrocinados","Sxx itxx paxxxxxxxxxx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 1?',"18000 xm","1x000 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 2?',"20250 xm","2xxx0 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 3?',"21500 xm","2xxx00 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 4?',"24750 xm","2xxx0 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 5?',"27000 xm","2xx000 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 6?',"29250 xm","2xxxx0 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 7?',"31500 xm","3xx00 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 8?',"33750 xm","3xxx0 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 9?',"36000 xm","3x000 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 10?',"38400 xm","3xx00 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 11?',"40800 xm","4xx00 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 12?',"43200 xm","4xx00 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 13?',"45600 xm","4xx00 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 14?',"48000 xm","4x000 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 15?',"50400 xm","5xx00 Xx"],
			['¿Cuanto XM puede un Lawson entregarle a un Agente nivel 16?',"52800 xm","5xx00 Xx"],
                        ['¿Para que son las llaves?',"recargar, enlazar y ver portales","rexxxxxx, enlxxxx y vxx porxxxxx"],
                        ['¿Que debo reciclar cuando no tengo XM ni Cubos?',"llaves y xmp de nivel bajo","llxxxx y Xxx xx nixxx baxx"],
                        ['¿Cuanto XM me da un item al reciclarlo?',"cada item tiene un valor especial de XM","caxx itxx txxxx un vaxxx espxxxxx xx Xx"],
                        ['¿Cuanto XM me da un item nivel 1 al reciclarlo?',"20 xm","x0 Xx"],
                        ['¿Cuanto XM me da un item nivel 2 al reciclarlo?',"40 xm","x0 Xx"],
                        ['¿Cuanto XM me da un item nivel 3 al reciclarlo?',"60 xm","x0 Xx"],
                        ['¿Cuanto XM me da un item nivel 4 al reciclarlo?',"80 xm","x0 Xx"],
                        ['¿Cuanto XM me da un item nivel 5 al reciclarlo?',"100 xm","x00 Xx"],
                        ['¿Cuanto XM me da un item nivel 6 al reciclarlo?',"120 xm","x00 Xx"],
                        ['¿Cuanto XM me da un item nivel 7 al reciclarlo?',"140 xm","x00 Xx"],
                        ['¿Cuanto XM me da un item nivel 8 al reciclarlo?',"160 xm","x00 Xx"],
                        ['¿Cuanto XM me da un item común al reciclarlo?',"250 xm","xx0 Xx"],
                        ['¿Cuanto XM me da un item raro al reciclarlo?',"500 xm","x00 Xx"],
                        ['¿Cuanto XM me da un item muy raro al reciclarlo?',"1000 xm","x000 Xx"],
                        ['¿Cuanto XM me da una llave al reciclarla?',"500 xm","x00 Xx"],
                        ['¿Que es un Mod?',"son un tipo de items que cambian las condiciones basicas del portal","Sxx xx tixx xx itxxx xxx caxxxxx xxx conxxxxxxxx baxxxxx dxx poxxxx"],
                        ['¿Que items tienen adherencia extra?',"escudos y turret","Escxxxx y tuxxxx"], 
                        ['¿Cuantos mods puede poner un Agente?',"2 mods","x moxx"],
                        ['¿Que es un Escudo?',"son mods que aumentan la defensa del portal","Sxx mxxx xxx auxxxxxx xx defxxxx xxx poxxxx"],
                        ['¿Cual es la adherencia extra de un Escudo Común?',"0%","x%"],
                        ['¿Cual es la adherencia extra de un Escudo Raro?',"15%","x5%"],
                        ['¿Cual es la adherencia extra de un Escudo Muy Raro?',"45%","4x%"],
                        ['¿Cual es la adherencia extra de un AXXA?',"70%","x0%"],
                        ['¿Cual es la mitigación de ataque de un Escudo Común?',"30%","x0%"],
                        ['¿Cual es la mitigación de ataque de un Escudo Raro?',"40%","x0%"],
                        ['¿Cual es la mitigación de ataque de un Escudo Muy Raro?',"60%","x0%"],
                        ['¿Cual es la mitigación de ataque de un AXXA?',"70%","x0%"],
                        ['¿Que es un AXA?',"son escudos patrocinados","Sxx esxxxxx patxxxxxxxxx"]/*,
                        ['¿Que pasa si pongo mas de un Escudo?',
                        ['¿Que pasa si pongo 2 Escudos?',
                        ['¿Que pasa si pongo 3 Escudos?',
                        ['¿Que pasa si pongo 4 Escudos?',
                        ['¿Que quiere decir que un Escudo aumenta la mitigación de ataque de un portal?',
                        ['¿Que es un Link Amp?',
                        ['¿Para que son los Link Amp?',
                        ['¿Cual es la adherencia extra de un Link Amp?',
                        ['¿Que es un Softbank Ultra Link?',
                        ['¿Para que son los Softbank Ultra Link?',
                        ['¿Cual es la adherencia extra de un Softbank Ultra Link?',
                        ['¿Que debo hacer si me sale un Softbank Ultralink?',
                        ['¿Como uso mejor los Amplificadores de Link?',
                        ['¿Que item aumenta la distancia máxima de un portal?',
                        ['¿Que amplificador de link tiene una razón de aumento de distancia mayor?',
                        ['¿Que amplificador de link tiene una razón de aumento de distancia medio?',
                        ['¿Que amplificador de link tiene una razón de aumento de distancia menor?',
                        ['¿Cual es el factor de aumento de un Link Amp Raro?',
                        ['¿Cual es el factor de aumento de un Softbank Ultra Link?',
                        ['¿Cual es el factor de aumento de un Link Amp Muy Raro?',
                        ['¿Como obtengo Link Amp Muy Raro?',
                        ['¿Que características especiales tiene un Softbank Ultra Link?',
                        ['¿Cual es la mitigación de ataque de un Softbank Ultra Link?',
                        ['¿Cuantos links de salida agrega un Softbank Ultra Link?',
                        ['¿Cual es la adherencia extra de un AXXA?',
                        ['¿Que pasa si pongo mas de un LA o SBUL?',
                        ['¿Que pasa si pongo 2 LA o SBUL?',
                        ['¿Que pasa si pongo 3 LA o SBUL?',
                        ['¿Que pasa si pongo 4 LA o SBUL?',
                        ['¿Que quiere decir que un Amplificador de Link aumenta la distancia de un portal?',
                        ['¿Cual es la máxima distancia de un portal 1?',
                        ['¿Cual es la máxima distancia de un portal 2?',
                        ['¿Cual es la máxima distancia de un portal 3?',
                        ['¿Cual es la máxima distancia de un portal 4?',
                        ['¿Cual es la máxima distancia de un portal 5?',
                        ['¿Cual es la máxima distancia de un portal 6?',
                        ['¿Cual es la máxima distancia de un portal 7?',
                        ['¿Cual es la máxima distancia de un portal 8?',
                        ['¿Que es un Heat Sink?',
                        ['¿Para que son los Heat Sink?',
                        ['¿Como uso mejor los Heat Sink?',
                        ['¿Cual es la adherencia extra de un Heat Sink?',
                        ['¿Que caracteristica especial tienen los Heat Sink?',
                        ['¿Que pasa si pongo mas de un Heat Sink?',
                        ['¿Que pasa si pongo 2 Heat Sink?',
                        ['¿Que pasa si pongo 3 Heat Sink?',
                        ['¿Que pasa si pongo 4 Heat Sink?',
                        ['¿Que quiere decir que un Heat Sink disminuye el tiempo entre hackeos de un portal?',
                        ['¿Que quiere decir que una Heat Sink resetea el numero de hacks?',
                        ['¿A quien le resete el numero de Hacks un Heat Sink?',
                        ['¿Cual es el porcentaje de reducción entre hackeos de un Heat Sink Común?',
                        ['¿Cual es el porcentaje de reducción entre hackeos de un Heat Sink Raro?',
                        ['¿Cual es el porcentaje de reducción entre hackeos de un Heat Sink Muy Raro?',
                        ['¿Que es un Multi Hack?',
                        ['¿Para que son los Multi Hack?',
                        ['¿Como uso mejor los Multi Hack?',
                        ['¿Cual es la adherencia extra de un Multi Hack?',
                        ['¿Que pasa si pongo mas de un Multi Hack?',
                        ['¿Que pasa si pongo 2 Multi Hack?',
                        ['¿Que pasa si pongo 3 Multi Hack',
                        ['¿Que pasa si pongo 4 Multi Hack?',
                        ['¿Que quiere decir que un Multi Hack aumenta el numero de hacks de un portal?',
                        ['¿Cuantos Hacks mas da un Multi Hack Común?',
                        ['¿Cuantos Hacks mas da un Multi Hack Raro?',
                        ['¿Cuantos Hacks mas da un Multi Hack Muy Raro?',
                        ['¿Que es un Force Amp?',
                        ['¿Cual es la adherencia extra de un Force Amp?',
                        ['¿Para que son los Force Amp?',
                        ['¿Que quiere decir que un Force Amp aumenta la fuerza de ataque?',
                        ['¿Como uso mejor los Force Amp?',
                        ['¿Que pasa si pongo mas de un Force Amp?',
                        ['¿Que pasa si pongo 2 Force Amp?',
                        ['¿Que pasa si pongo 3 Force Amp?',
                        ['¿Que pasa si pongo 4 Force Amp?',
                        ['¿Que es una Turret?',
                        ['¿En cuanto aumenta el critico de ataque una Turret?',
                        ['¿Que quiere decir que una Turret aumenta el critico de ataque?',
                        ['¿Cuantas veces aumenta el factor de ataque una Turret?',
                        ['¿Que quiere decir que una Turret aumenta el factor de ataque?',
                        ['¿Cual es la adherencia extra de una Turret?',
                        ['¿Para que son las Turret?',
                        ['¿Como uso mejor las Turret?',
                        ['¿Que pasa si pongo mas de una Turret?',
                        ['¿Que pasa si pongo 2 Turret?',
                        ['¿Que pasa si pongo 3 Turret?',
                        ['¿Que pasa si pongo 4 Turret?',
                        ['¿Que es mejor un XMP o un US?, ¿Por qué?',
                        ['¿Que es mejor un ADA Refactor o un Jarvis Virus?, ¿Por qué?',
                        ['¿Que es mejor un resonador o un XMP?, ¿Por qué?',
                        ['¿Que es mejor un Escudo o un Force Amp?, ¿Por qué?',
                        ['¿Que es mejor un Escudo o una Turret?, ¿Por qué?',
                        ['¿Que es mejor una Turret o un Force Amp?, ¿Por qué?',
                        ['¿Que es mejor un Heat Sink o un Multi Hack?, ¿Por qué?',
                        ['¿Que es mejor un LA o un SBUL?, ¿Por qué?',
                        ['¿Que es mejor una Capsula Mufg o una de llaves?, ¿Por qué?',
                        ['¿Que es un Media o multimedia?',
                        ['¿Para que son los Media?',
                        ['¿Que es una Capsula?',
                        ['¿Para que son las Capsulas?',
                        ['¿Como uso mejor las Capsulas?',
                        ['¿Te has encontrado con algún dinosaurio que aún pase items sin usar Capsulas?',
                        ['¿Que es una Capsula Mufg?',
                        ['¿Como puedo multiplicar items?',
                        ['¿Como uso mejor las Capsulas Mufg?',
                        ['¿Que debo hacer si me sale una Capsula Mufg?',
                        ['¿Que debo hacer si me sale un Item Very Rare?',
                        ['¿Para que son las Capsulas Mufg?',
                        ['¿Que es una Capsula de Llaves?',
                        ['¿Como uso mejor las Capsulas de Llaves?',
                        ['¿Para que son las Capsulas de Lllaves?',
                        ['¿Como aumento el espacio en mi invientario?, ¿Por qué?',
                        ['¿Como se hace un Hack rápido sin llave?',
                        ['¿Como se hace un Hack rápido?',
                        ['¿Como se hace un Hack con glifos?',
                        ['¿Como se hace un Hack con complejo?',
                        ['¿Como se hace un Hack simple?',
                        ['¿Como se hace un Hack Mas llave?',
                        ['¿Como se hace un Hack Sin llave?',
                        ['¿Como se aprenden los glifos?',
                        ['¿Que rango de recarga tiene un Agente nivel 1?',
                        ['¿Que rango de recarga tiene un Agente nivel 2?',
                        ['¿Que rango de recarga tiene un Agente nivel 3?',
                        ['¿Que rango de recarga tiene un Agente nivel 4?',
                        ['¿Que rango de recarga tiene un Agente nivel 5?',
                        ['¿Que rango de recarga tiene un Agente nivel 6?',
                        ['¿Que rango de recarga tiene un Agente nivel 7?',
                        ['¿Que rango de recarga tiene un Agente nivel 8?',
                        ['¿Que rango de recarga tiene un Agente nivel 9?',
                        ['¿Que rango de recarga tiene un Agente nivel 10?',
                        ['¿Que rango de recarga tiene un Agente nivel 11?',
                        ['¿Que rango de recarga tiene un Agente nivel 12?',
                        ['¿Que rango de recarga tiene un Agente nivel 13?',
                        ['¿Que rango de recarga tiene un Agente nivel 14?',
                        ['¿Que rango de recarga tiene un Agente nivel 15?',
                        ['¿Que rango de recarga tiene un Agente nivel 16?',*/
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
