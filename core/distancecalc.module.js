/**
 * @file Distance
 * @author Cris @Cizaquita - Rata @RATAELTRIFORCE
 */
(function() {
    app.modules = app.modules || {};
    app.modules.distancecalc = Distancecalc;

    Distancecalc.initMessage = '/distance';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Distancecalc(message) {
        this.chat = message.chat.id,
        this.modsCount = 0;
        this.message_id = message.message_id;
        this.i = 0;
        this.resos = [];
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Distancecalc.prototype.onMessage = function (message) {
        var resp, markup, distancia,
            keyboard = [],
            text = message.text;
            console.log("texto calculadora " + text);
        //REPLY MARKUP
        var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Ir"
        inline_button_califica.url = "https://telegram.me/ada_resco_bot?start";
        //
        inline_keyboard = [[inline_button_califica]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };
        /////////////////////////////////
        if (this.chat < 0) {
            app.telegram.sendMessage(this.chat, "<i>Utiliza esta funionalidad por privado!</i>", inline_markup);
            this.complete = true;
        }else{
            if (text == "Cancelar") {
                app.telegram.sendMessage(this.chat, "Tarea cancelada.", null);
                this.complete = true;
            }else{
                /////////////////////////////////////
                console.log("numero reso" + this.resos.length);
                //this.complete = true;              
                keyboard = [
                    ["1","2","3","4"],
                    ["5","6","7","8"],
                    ["Cancelar"]
                ];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: false,
                    resize_keyboard: true
                };

                if (text != "/distance") {
                    this.resos[this.i] = text;
                    this.i++;
                    if(this.resos.length <= 7){
                        app.telegram.sendMessage(this.chat, "Selecciona el nivel resonador(" + (this.i+1) + "):", markup);                            
                    }else{
                        keyboard = [
                            ["Link Amp"],
                            ["Link Amp Very Rare"],
                            ["Softbank Ultra Link"],
                            ["Ninguno"]
                        ];
                        var suma = ((this.resos[0] + this.resos[1] + this.resos[2] + this.resos[3] +
                                      this.resos[4] + this.resos[5] + this.resos[6] + this.resos[7])/8);
                        var elevar = Math.pow(suma, 4);
                        resultado = elevar * 160;
                        app.telegram.sendMessage(this.chat, "Resonadores: " +
                                                    "\n<b>1</b> - L" +this.resos[0] +
                                                    "\n<b>2</b> - L" +this.resos[1] +
                                                    "\n<b>3</b> - L" +this.resos[2] +
                                                    "\n<b>4</b> - L" +this.resos[3] +
                                                    "\n<b>5</b> - L" +this.resos[4] +
                                                    "\n<b>6</b> - L" +this.resos[5] +
                                                    "\n<b>7</b> - L" +this.resos[6] +
                                                    "\n<b>8</b> - L" +this.resos[7] +
                                                    "\n\nDistancia: " + suma + "asd" + resultado + "m", null);
                        app.telegram.sendMessage(this.chat, "Selecciona los mods instalados en el portal:", markup);

                        if (text == "Link Amp") {
                            resultado = 0;
                            this.modsCount++;
                        }else if(text == "Link Amp Very Rare"){
                            resultado = 0;
                            this.modsCount++;
                        }else if(text == "Softbank Ultra Link"){
                            resultado = 0;
                            this.modsCount++;
                        }else{
                            resultado = 0;
                        }

                    }
                }else{
                    app.telegram.sendMessage(this.chat, "Selecciona el nivel resonador(" + (this.i+1) + "):-", markup);                        
                }

            }
        }
    };
}());
