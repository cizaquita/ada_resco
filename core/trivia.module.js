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
            text = "";
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
                app.api.updateTriviaPoints(this.from_id, "sumar", function(data){
                    app.telegram.sendMessage(chat, "Felicidades @" + this.username + ", has respondido <b>correctamente!</b> :D" +
                                                    "\n\nAhora tienes <b>" + data.trivia_points + " puntos!</b>" +
                                                        "\nPuedes consultar tu puntaje preguntando \"Ada quien soy?\" o \"Ada mis puntos\" ", null, message_id);
                });
                this.complete = true;
            }else if (text == "pista") {
                app.telegram.sendMessage(chat, "<b>Pista:</b> " + this.preg[2], null, message_id);
            }else if(text == "/cancel" || text == "/cancel@adarefacto_bot" || text == "/cancel@ada_resco_bot"){
                app.telegram.sendMessage(chat, "<b>Trivia cancelada!</b>", null, message_id);
                this.complete = true;
            }
            else{
                app.api.updateTriviaPoints(this.from_id, "restar", function(data){
                    app.telegram.sendMessage(chat, "Lo lamento @" + this.username + ", has respondido <b>erróneamente!</b> :(" +
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
                        ['¿Que capacidad de XM tiene un Agente nivel 16?',"22000","xx000"]
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
