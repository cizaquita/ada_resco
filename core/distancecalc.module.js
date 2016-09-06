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
        this.message_id = message.message_id;
        this.i = 0;
        this.resos = [];
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Distancecalc.prototype.onMessage = function (message) {
        var resp, markup,
            keyboard = [],
            text = message.text;
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

            if (text == "cancelar") {
                app.telegram.sendMessage(this.chat, "Tarea cancelada.", null);
                this.complete = true;
            }

            /////////////////////////////////////
            if (this.i == 8) {
                app.telegram.sendMessage(this.chat, "Resonadores: " +
                                                    "\n<b>1</b> - L" +this.resos[0] +
                                                    "\n<b>2</b> - L" +this.resos[1] +
                                                    "\n<b>3</b> - L" +this.resos[2] +
                                                    "\n<b>4</b> - L" +this.resos[3] +
                                                    "\n<b>5</b> - L" +this.resos[4] +
                                                    "\n<b>6</b> - L" +this.resos[5] +
                                                    "\n<b>7</b> - L" +this.resos[6] +
                                                    "\n<b>8</b> - L" +this.resos[7], null);
                this.complete = true;
            }else{
                if (this.resos[this.i] == 8) {
                    keyboard = [
                        ["1","2","3","4"],
                        ["5","6","7","8"],
                        ["Listo"],
                        ["Cancelar"]
                    ];
                }else{                    
                    keyboard = [
                        ["1","2","3","4"],
                        ["5","6","7","8"],
                        ["Cancelar"]
                    ];
                }
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: true
                };
                app.telegram.sendMessage(this.chat, "Selecciona el nivel resonador (" + (this.i+1) + "):", markup);
                this.i++;
                if(text != "/distance"){
                    this.resos[this.i] = text;
                }
            }
        }
    };
}());
