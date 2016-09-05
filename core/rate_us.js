/**
 * @file Rate us controller
 * @author Artem Veikus artem@veikus.com
 * @version 2.3
 */
(function() {
    var users = localStorage.getItem('rate_us__users');

    if (users) {
        users = JSON.parse(users);
    } else {
        users = {};
    }

    app.rateUs = function(chat) {
        // Send vote us messages after 3 photos sent
        var resp,
            sent = users[chat] || 0,
            lang = app.settings.lang(chat);

        //REPLY MARKUP
        var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "⭐⭐⭐⭐⭐"
        inline_button_califica.url = "http://telegram.me/storebot?start=ada_resco_bot";
        //

        inline_keyboard = [[inline_button_califica]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };
        /////////////////////////////////7
        ++sent;

        console.log(chat, sent);

        if (sent === 3 || sent === 10 || 
            sent === 30 || sent === 50 ||
            sent === 100) {
            resp = [
                app.i18n(lang, 'main', 'rate_us_1'),
                app.i18n(lang, 'main', 'rate_us_2'),
                app.i18n(lang, 'main', 'rate_us_3')
            ].join('\n');

            app.telegram.sendMessage(chat, resp, inline_markup);
        }

        users[chat] = sent;

        localStorage.setItem('rate_us__users', JSON.stringify(users))
    }

}());