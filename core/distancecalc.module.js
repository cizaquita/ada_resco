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
            var i = 1,
                resos = [];
            for (i; i <= 8; i++) {
                resos[i] = text;
                if (resos[i] == 8) {
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
                app.telegram.sendMessage(this.chat, "Selecciona el nivel resonador (" + i + "):", markup);
            };
            app.telegram.sendMessage(this.chat, "Resonadores: " + resos[0] + ", " + resos[1], null);
            this.complete = true;
        }
    };
}());
