/**
 * @file IITC setup module
 * @author Artem Veikus artem@veikus.com
 * @version 2.0
 */
(function() {
    var plugins, markup;

    app.modules = app.modules || {};
    app.modules.iitc = IITC;

    IITC.initMessage = '/plugins';

    plugins = {
        'IITC': 'iitc/total-conversion-build.user.js',
        'Mostrar Misiones': 'iitc/missions.user.js',
        'Mostrar Portales Débiles': 'iitc/show-portal-weakness.user.js',
        'Mostrar Jugadores': 'iitc/player-tracker.user.js',
        'Mostrar Nombre de los portales': 'iitc/portal-names.user.js',
        'Mostrar Nivel de los portales': 'iitc/portal-level-numbers.user.js',
        'Mostrar la dirección de los Links': 'iitc/link-show-direction.user.js',
        'Zonas':'iitc/draw-tools.user.js'
    };

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function IITC(message) {
        var resp;

        this.chat = message.chat.id;
        this.lang = app.settings.lang(this.chat);

        
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
        markup = {
            one_time_keyboard: false,
            resize_keyboard: true,
            keyboard: this.buildKeyboard()
        };

        resp = app.i18n(this.lang, 'iitc', 'help');
        resp += '\n';
        resp += this.getCurrentStatus();

        if (this.chat < 0) {
            app.telegram.sendMessage(this.chat, "<i>Utiliza esta funionalidad por privado!</i>", inline_markup);
            this.complete = true;
        }else{
            app.telegram.sendMessage(this.chat, resp, markup);
        }
    }

    /**
     * @param message {object} Telegram message object
     */
    IITC.prototype.onMessage = function (message) {
        var index, isEnabled, url, resp, temp,
            text = message.text,
            enabled = app.settings.plugins(this.chat);

        temp = app.i18n(this.lang, 'iitc', 'complete_setup');
        //temp = acentos(temp).toLowerCase();

        //console.log("temp: " + temp + ", text: " + text);

        if (temp === text) {
            this.complete = true;
            app.telegram.sendMessage(this.chat, '👍', null); // thumbs up
        } else if (plugins[text]) {
            url = plugins[text];
            index = enabled.indexOf(url);
            isEnabled = index > -1;

            if (isEnabled) {
                if (text === 'IITC') {
                    enabled = [];
                } else {
                    enabled.splice(index, 1);
                }
            } else {
                if (enabled.length === 0 && url !== plugins.IITC) {
                    enabled.push(plugins.IITC);
                }

                enabled.push(url);
            }

            app.settings.plugins(this.chat, enabled);

            resp = this.getCurrentStatus();
            app.telegram.sendMessage(this.chat, resp, markup);

        } else {
            resp = app.i18n(this.lang, 'iitc', 'plugin_not_found');
            app.telegram.sendMessage(this.chat, resp, markup);
        }
    };

    /**
     * Build message with current modules status
     * @returns {String} String with modules names and their statuses
     */

     //We need to hide the DrawTools in the plugin list, only works
     //For Bogota zones, for now only /norte command
     //will be announced when ready
     //@cizauqita
    IITC.prototype.getCurrentStatus = function() {
        var name, url, isEnabled,
            result = [],
            enabled = app.settings.plugins(this.chat);

        result.push(app.i18n(this.lang, 'iitc', 'status'));

        for (name in plugins) {
            if (!plugins.hasOwnProperty(name)) {
                continue;
            }

            url = plugins[name];
            isEnabled = enabled.indexOf(url) > -1;

            if (isEnabled) {
                result.push('✅' + name);
            } else {
                if (name !== 'Zonas') {
                    result.push('❎' + name);             
                };
            }
        }

        return result.join('\n');
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

    /**
     * Build keyboard with modules list
     * @returns {Array} Array ready to use in markup
     */
    IITC.prototype.buildKeyboard = function() {
        var name,
            result = [];

        for (name in plugins) {
            if (!plugins.hasOwnProperty(name)) {
                continue;
            }
            if (name !== 'Zonas') {
                result.push([name]);                
            };
        }

        result.push([app.i18n(this.lang, 'iitc', 'complete_setup')]);

        return result;
    };

}());
