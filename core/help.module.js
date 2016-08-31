/**
 * @file Help module
 * @author Artem Veikus artem@veikus.com
 * @version 2.0
 */
(function() {
    app.modules = app.modules || {};
    app.modules.help = Help;

    Help.initMessage = '/help';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Help(message) {
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Help.prototype.onMessage = function (message) {
        var chat = message.chat.id,
            lang = app.settings.lang(chat),
            resp = [];

        //REPLY MARKUP
        var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Iniciame"
        inline_button_califica.url = "https://telegram.me/ada_resco_bot?start";
        //

        inline_keyboard = [[inline_button_califica]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };
        /////////////////////////////////7

        /*resp.push(app.i18n(lang, 'help', 'line_1'));
        resp.push(app.i18n(lang, 'help', 'line_2'));
        resp.push(app.i18n(lang, 'help', 'line_3'));
        resp.push(app.i18n(lang, 'help', 'line_4'));*/

        this.complete = true;
        //app.telegram.sendMessage(chat, resp.join('\n'), null);
        if (chat < 0) {
            app.telegram.sendMessage(chat, "<i>Escríbeme por privado primero</i>", inline_markup);
        }else{
            app.telegram.sendMessage(chat, "\t<b>Centro de ayuda de ADA</b>" +
                                           "\n\nBot en desarrollo, se añadirán más características pronto...", null);
        }
    };
}());
