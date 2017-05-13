/**
 * @file Screenshot task creation module
 * @author Artem Veikus artem@veikus.com
 * @version 2.0
 */
(function () {
    app.modules = app.modules || {};
    app.modules.screenshot = Screenshot;

    Screenshot.initMessage = '/screenshot' || '/screen' || '/foto';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    //zoom, Added new parameter for BOGOTA ZONES
    //Now the function automatically will recieve
    //a zoom parameter to do the Screenshot of a zone automatically
    //@cizaquita

    //Added more Stats variables, like username,
    //firstname, lastname for segmentation
    //That will be sended to the task manager
    //and saved in localStorage
    function Screenshot(message, zoom, portals) {
        this.zoom = zoom;
        this.username = message.chat.username;
        this.firstname = message.chat.first_name;
        this.lastname = message.chat.last_name;
        this.chat = message.chat.id;
        this.lang = app.settings.lang(this.chat);
        this.location = null;
        this.onMessage(message, zoom, portals);
    }

    /**
     * @param message {object} Telegram message object
     */
        //zoom, Added new parameter for BOGOTA ZONES
        //Now the function automatically will recieve
        //a zoom parameter to do the Screenshot of a zone automatically
        //@cizaquita
    Screenshot.prototype.onMessage = function (message, zoom, portals) {
        var resp, markup, plugins,
            keyboard = [],
            text = message.text,
            location = message.location;
        this.zoom = zoom;
        this.portals = portals;


        //REPLY MARKUP
        var inline_button_califica = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Ir"
        inline_button_califica.url = "https://telegram.me/ada_resco_bot?start";
        //

        inline_keyboard = [[inline_button_califica]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };
        /////////////////////////////////7

        if (this.chat < 0) {
            app.telegram.sendMessage(this.chat, "<i>Utiliza esta funionalidad por privado!</i>", inline_markup);
            this.complete = true;
        } else {
            //Debug information
            //console.log('Debug zoom: ' + this.zoom);
            //console.log('Debug location: ' + this.location);
            // Step 1
            if (location && location.latitude && location.longitude) {
                this.location = location;
                if (this.zoom == null) {
                    keyboard = [
                        app.i18n(this.lang, 'interval', 'options_1').split(';'),
                        app.i18n(this.lang, 'interval', 'options_2').split(';'),
                        app.i18n(this.lang, 'interval', 'options_3').split(';'),
                        app.i18n(this.lang, 'interval', 'options_4').split(';')
                    ];
                    markup = {
                        keyboard: keyboard,
                        one_time_keyboard: true
                    };

                    resp = app.i18n(this.lang, 'screenshot', 'zoom_setup');
                    app.telegram.sendMessage(this.chat, resp, markup);
                    return;
                }
                ;
            } else if (!this.location) {
                var button = {};
                button.text = app.i18n(this.lang, 'screenshot', 'my_location');
                button.request_location = true;
                keyboard = [[button]];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: true
                };

                resp = app.i18n(this.lang, 'screenshot', 'location_required');
                if (this.chat < 0) {
                    app.telegram.sendMessage(this.chat, resp, null);
                } else {
                    app.telegram.sendMessage(this.chat, resp, markup);
                }
                return;
            }

            // Step 2
            //console.log('Debug text: ' + text);
            if (this.zoom == null) {
                this.zoom = parseInt(text);
            } else {
                plugins = app.settings.plugins(this.chat);
                //Añade plugin de zonas
                plugins.push("iitc/draw-tools.user.js");
                app.settings.plugins(this.chat, plugins);
            }

            //Añade el plugin de portales si el campo es !null
            if (this.portals != null) {
                if (this.portals == 1) {
                    plugins = app.settings.plugins(this.chat);
                    //Añade plugin de PORTALES
                    plugins.push("iitc/debug-raw-portal-data.user.js");
                    plugins.push("iitc/portals.user.js");
                    app.settings.plugins(this.chat, plugins);
                    console.log("PLUGINS: antes: " + plugins);
                }
                ;
            }
            ;

            if (this.zoom && this.zoom >= 3 && this.zoom <= 18) {
                this.complete = true;

                app.taskManager.add({
                    chat: this.chat,
                    location: this.location,
                    zoom: this.zoom,
                    portals: this.portals
                });

                resp = app.i18n(this.lang, 'screenshot', 'task_saved');
                app.telegram.sendMessage(this.chat, resp, null);

                //Stats that wll be sended to the task manager
                //@cizaquita
                if (app.modules.stats) {
                    app.modules.stats.trackScreenshot({
                        chat: this.chat,
                        username: this.username,
                        firstname: this.firstname,
                        lastname: this.lastname,
                        zoom: this.zoom,
                        location: this.location
                    });
                }
            } else {
                keyboard = [
                    app.i18n(this.lang, 'interval', 'options_1').split(';'),
                    app.i18n(this.lang, 'interval', 'options_2').split(';'),
                    app.i18n(this.lang, 'interval', 'options_3').split(';'),
                    app.i18n(this.lang, 'interval', 'options_4').split(';')
                ];
                markup = {
                    keyboard: keyboard,
                    one_time_keyboard: true
                };
                resp = app.i18n(this.lang, 'screenshot', 'incorrect_input');
                app.telegram.sendMessage(this.chat, resp, markup);
            }
        }
    };

}());
