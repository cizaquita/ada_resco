(function() {
    // ADA
    //264896440:AAELr7j2DD9zzsiOAxbMteoHyNHO_r5XaiQ
    //255931013:AAFKhDij0XIlKhuuB1gym4V9qKCQhEbuK24 //adaRefacto_bot
    var TOKEN = '255931013:AAFKhDij0XIlKhuuB1gym4V9qKCQhEbuK24',
        API_URL = 'https://api.telegram.org/bot' + TOKEN,
        TIMEOUT = 10,
        offset = localStorage.getItem('telegram_offset') || 0,
        chatSettings = localStorage.getItem('chatSettings') || '{}';

    app.telegram = {};

    /**
     * Send message to specified chat
     * @param chatId {Number} Chat id
     * @param message {String} Message
     * @param markup {Object|undefined|null} Keyboard markup (null hides previous keyboard, undefined leaves it)
     */
    app.telegram.sendMessage = function(chatId, message, markup, reply_to_message_id, callback) {
        var url= API_URL + '/sendMessage',
            params = {};

        if (markup === null) {
            markup = { hide_keyboard: true };
        }
        markup = JSON.stringify(markup);
        params.chat_id = chatId;
        params.text = message;
        params.disable_web_page_preview = true;
        params.reply_markup = markup;
        params.parse_mode = 'HTML';
        params.reply_to_message_id = reply_to_message_id;

        request('get', url, params, function(data) {
            if (typeof callback === 'function') {
                if (data) {
                    callback(data);
                }else
                    callback(null);
            }
        });
    };

    /**
     * Send photo to specified chat
     * @param chatId {Number} Chat id
     * @param photo {String} Base64 encrypted image
     * @param compression {Boolean} If true image will be compressed by telegram
     * @param callback {Function} Callback function
     */
    app.telegram.sendPhoto = function(chatId, photo, compression, callback) {
        var url = API_URL + (compression ? '/sendPhoto' : '/sendDocument'),
            params = {};

        params.chat_id = chatId;
        params[compression ? 'photo' : 'document'] = photo;

        request('post', url, params, function(data) {
            if (typeof callback === 'function') {
                callback(data);
            }else
                callback(null);
        });
    };

    /**
     * Send photo to specified chat
     * @param chatId {Number} Chat id
     * @param photo {String} Base64 encrypted image or String
     */
    app.telegram.sendPhotoEx = function(chatId, photo, caption, reply_to_message_id, reply_markup, callback) {
        var url = API_URL + '/sendPhoto',
            params = {};
            
        if (reply_markup === null) {
            reply_markup = { hide_keyboard: true };
        }
        reply_markup = JSON.stringify(reply_markup);

        params.chat_id = chatId;
        params.photo = photo;
        params.caption = caption;
        params.reply_to_message_id = reply_to_message_id;
        params.reply_markup = reply_markup;

        request('get', url, params, function(data) {
            if (typeof callback === 'function') {
                callback(data);
            }else{
                callback(null);
            }
        });
    };

    /**
     * Send photo to specified chat
     * @param chatId {Number} Chat id
     * @param photo {String} Base64 encrypted image
     * @param compression {Boolean} If true image will be compressed by telegram
     * @param callback {Function} Callback function
     */
    app.telegram.kickChatMember = function(chatId, userId) {
        var url = API_URL + '/kickChatMember',
            params = {};

        params.chat_id = chatId;
        params.user_id = userId;

        request('post', url, params, function(data) {
            if (typeof callback === 'function') {
                callback(data && data.ok, data.description);
            }
        });
    };


    /**
     * Send photo to specified chat
     * @param chatId {Number} Chat id
     * @param photo {String} Base64 encrypted image
     * @param compression {Boolean} If true image will be compressed by telegram
     * @param callback {Function} Callback function
     */
    app.telegram.unbanChatMember = function(chatId, userId) {
        var url = API_URL + '/unbanChatMember',
            params = {};

        params.chat_id = chatId;
        params.user_id = userId;

        request('post', url, params, function(data) {
            if (typeof callback === 'function') {
                callback(data && data.ok, data.description);
            }
        });
    };
    /**
     * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.).
     * Returns a Chat object on success.
     * @param chatId {Number} Chat id
     */
    app.telegram.getChat = function(chatId) {
        var url = API_URL + '/getChat',
            params = {};

        params.chat_id = chatId;

        request('post', url, params, function(data) {
            console.log(JSON.stringify(data));
            if (typeof callback === 'function') {
                callback(data && data.ok, data.description);
            }
        });
    };
    /**
     * getChatAdministrators ver los administradores de un chat
     * https://core.telegram.org/bots/api#getchatadministrators
     * @param chatId {Number} Chat id
     */
    app.telegram.getChatAdministrators = function(chatId, chat_title) {
        var url = API_URL + '/getChatAdministrators',
            params = {}, text = " - Admins de " + chat_title + " -\n";
            //

        params.chat_id = chatId;
        request('post', url, params, function(data) {
            data.result.forEach(function(val) {
                text += "\n(" + val.user.id + ") @" + val.user.username + " - " + val.status;
            });
            app.telegram.sendMessage(chatId, text, null);
        });
    };
    /**
     * getChatMembersCount ver la cantidad de usuarios en el chat
     * https://core.telegram.org/bots/api#getchatmemberscount
     * @param chatId {Number} Chat id
     */
    app.telegram.getChatMembersCount = function(chatId) {
        var url = API_URL + '/getChatMembersCount',
            params = {};

        params.chat_id = chatId;

        request('post', url, params, function(data) {
            console.log(JSON.stringify(data));
            if (typeof callback === 'function') {
                callback(data && data.ok, data.description);
            }
        });
    };
    /**
     * getUserProfilePhotos ver la cantidad de usuarios en el chat
     * https://core.telegram.org/bots/api#getUserProfilePhotos
     * @param userId {Number} user id
     * @param offset {Number} optional
     * @param limit {Number} optional
     */
    app.telegram.getUserProfilePhotos = function(userId) {
        var url = API_URL + '/getUserProfilePhotos',
            params = {};

        params.user_id = userId;

        request('post', url, params, function(data) {
            console.log(JSON.stringify(data));
            if (typeof callback === 'function') {
                callback(data && data.ok, data.description);
            }
        });
    };
    /**
     * getFile descargar un archivo almacenado en Telegram
     * https://core.telegram.org/bots/api#getFile
     * @param file_id {Number} required
     */
    app.telegram.getFile = function(file_id, callback) {
        var url = API_URL + '/getFile',
            params = {};

        params.file_id = file_id;

        request('post', url, params, function(data) {
            console.log(JSON.stringify(data));
            if (typeof callback === 'function') {
                callback(data);//var file_download = "https://api.telegram.org/file/bot" + TOKEN + "/" + data.file_path;
            }
        });
    };


    /**
     * Send sticker to specified chat
     * @param chatId {Number} Chat id
     * @param sticker {String} file_id
     */
    app.telegram.sendSticker = function(chatId, sticker, reply_to_message_id) {
        var url = API_URL + '/sendSticker',
            params = {};

        params.chat_id = chatId;
        params.sticker = sticker;
        params.reply_to_message_id = reply_to_message_id;

        request('post', url, params, function(data) {
            if(data && data.ok){
                //console.log('sticker enviado');
            }else{
                console.log('Error enviando sticker: ' + JSON.stringify(data));
            }
        });
    };


    /**
     * Send DOCUMENT like VIDEO to specified chat
     * @param chatId {Number} Chat id
     * @param sticker {String} file_id
     */
    app.telegram.sendDocument = function(chatId, document, caption, reply_to_message_id) {
        var url = API_URL + '/sendDocument',
            params = {};

        params.chat_id = chatId;
        params.document = document;
        params.caption = caption;
        params.reply_to_message_id = reply_to_message_id;

        request('post', url, params, function(data) {
            if(data && data.ok){
                //console.log('sticker enviado');
                console.log(JSON.stringify(data));
            }else{
                console.log('Error enviando sticker: ' + JSON.stringify(data));
            }
        });
    };


    /**
     * Send chat action to specified chat
     * @param chatId {Number} Chat id
     * @param action {String} action
     +
     +
     +
     * Type of action to broadcast. Choose one, depending on what the user
     * is about to receive: typing for text messages, upload_photo for photos,
     * record_video or upload_video for videos, record_audio or upload_audio 
     * for audio files, upload_document for general files, find_location for location data.
     */

    app.telegram.sendChatAction = function(chatId, action) {
        var url = API_URL + '/sendChatAction',
            params = {};

        params.chat_id = chatId;
        params.action = action;

        request('post', url, params, function(data) {
            if(data && data.ok){
                console.log('chatAction enviado');
            }else{
                console.log('Error enviando chatAction: ' + JSON.stringify(data));
            }
        });
    };


    /**
     * Send venue to specified chat
     * @param chatId {Number} Chat id
     * @param lat {Float number} latitude
     * @param lon {Float number} longitude
     * @param title {String} title
     * @param address {String} address
     *
     * https://core.telegram.org/bots/api#sendvenue
     */

    app.telegram.sendVenue = function(chatId, lat, lon, title, address) {
        var url = API_URL + '/sendVenue',
            params = {};

        params.chat_id = chatId;
        params.latitude = lat;
        params.longitude = lon;
        params.title = title;
        params.address = address;

        request('post', url, params, function(data) {
            if(data && data.ok){
                console.log('sendVenue enviado');
            }else{
                console.log('Error enviando sendVenue: ' + JSON.stringify(data));
            }
        });
    };
    /**
     * editMessageText
     * https://core.telegram.org/bots/api#editmessagetext
     * @param inline_message_id {String} inline_message_id id
     * @param text {Text} text
     *
     * https://core.telegram.org/bots/api#editMessageText
     */

    app.telegram.editMessageText = function(inline_message_id, text) {
        var url = API_URL + '/editMessageText',
            params = {};
        var inline_button_califica = {}, inline_button_buscar = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Rate me 👍";
        inline_button_califica.url = "http://telegram.me/storebot?start=ada_resco_bot";
        //inline_button.callback_data = "data";
        inline_button_buscar.text = "Share & search new location";
        inline_button_buscar.switch_inline_query = "";
        //
        inline_button_callback.text = "👌";
        inline_button_callback.callback_data = "cris";

        inline_keyboard = [[inline_button_buscar],[inline_button_califica,inline_button_callback]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };

        params.inline_message_id = inline_message_id;
        params.text = text;
        params.reply_markup = inline_markup;

        request('post', url, params, function(data) {
            //console.log(JSON.stringify(data));
        });
    };
    /**
     * editMessageText
     * https://core.telegram.org/bots/api#editmessagetext
     * @param inline_message_id {String} inline_message_id id
     * @param text {Text} text
     *
     * https://core.telegram.org/bots/api#editMessageText
     */

    app.telegram.editMessageReplyMarkup = function(inline_message_id) {
        var url = API_URL + '/editMessageReplyMarkup',
            params = {};
        var inline_button_califica = {}, inline_button_buscar = {}, inline_button_callback = {}, inline_keyboard, inline_markup;
        inline_button_califica.text = "Rate me 👍";
        inline_button_califica.url = "http://telegram.me/storebot?start=ada_resco_bot";
        //inline_button.callback_data = "data";
        inline_button_buscar.text = "Share & search new location";
        inline_button_buscar.switch_inline_query = "";
        //
        inline_button_callback.text = "👌";
        inline_button_callback.callback_data = "cris";

        inline_keyboard = [[inline_button_buscar],[inline_button_califica,inline_button_callback]];
        inline_markup = {
            inline_keyboard: inline_keyboard
        };

        params.inline_message_id = inline_message_id;
        params.reply_markup = inline_markup;

        request('post', url, params, function(data) {
            //console.log(JSON.stringify(data));
        });
    };


    /**
     * answerInlineQuery to a query_id
     * @param inlineQuery {inlineQuery object}
     *
     * https://core.telegram.org/bots/api#sendvenue
     */

    app.telegram.answerInlineQuery = function(inline_query_id, results) {

        /*console.log("*************************************************************" +
                    "\nResults telegram: " + JSON.stringify(results));*/
        //console.log("answerInlineQuery: " + JSON.stringify(inlineQuery));
        //console.log("answerInlineQuery: " + inlineQuery.id);
        var url = API_URL + '/answerInlineQuery',
            params = {};

        params.inline_query_id = inline_query_id;
        params.results = JSON.stringify(results);

        //console.log("params: " + params);
        //console.log("json params: " + JSON.stringify(params));

        request('post', url, params, function(data) {
            console.log('answerInlineQuery:' + JSON.stringify(data));
            if(data && data.ok){
                console.log('answerInlineQuery enviado' + JSON.stringify(data));
            }else{
                console.log('Error enviando answerInlineQuery: ' + JSON.stringify(data));
            }
        });
    };
    /**
     * answerCallbackQuery to a query_id
     * @param callback_query_id {String} Unique identifier for the query to be answered
     * @param text {String} Text of the notification. If not specified, nothing will be shown to the user
     * @param show_alert {Boolean} If true, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false.
     *
     * https://core.telegram.org/bots/api#answercallbackquery
     */

    app.telegram.answerCallbackQuery = function(callback_query_id, text, show_alert) {

        /*console.log("*************************************************************" +
                    "\nResults telegram: " + JSON.stringify(results));*/
        //console.log("answerInlineQuery: " + JSON.stringify(inlineQuery));
        //console.log("answerInlineQuery: " + inlineQuery.id);
        var url = API_URL + '/answerCallbackQuery',
            params = {};

        params.callback_query_id = callback_query_id;
        params.text = text;
        params.show_alert = show_alert;

        request('post', url, params, function(data) {
            console.log('answerCallbackQuery:' + JSON.stringify(data));
        });
    };

    /**
     * Get new messages from server
     * @param callback {Function} Callback function
     */
    app.telegram.getUpdates = function(callback) {
        var result = [],
            url = API_URL + '/getUpdates';

        request('get', url, { timeout: TIMEOUT, offset: offset }, function(data) {
            if (data && data.ok) {
                //console.log("data: " +JSON.stringify(data));
                data.result.forEach(function(val) {
                    result.push(val);
                    offset = val.update_id + 1;
                    localStorage.setItem('telegram_offset', offset);
                });

                callback(result);
            } else {
                callback(null);
            }
        })
    };

    /**
     * Request wrapper
     * @param method {String} GET or POST
     * @param url {String} Request url
     * @param data {Object} Request parameters
     * @param callback {Function} Callback function
     */
    function request(method, url, data, callback) {
        var formData, i,
            xmlhttp = new XMLHttpRequest();

        if (typeof callback !== 'function') {
            callback = undefined;
        }

        if (method.toLowerCase() === 'post') {
            formData = new FormData();

            for (i in data) {
                if (!data.hasOwnProperty(i)) {
                    continue;
                }
                if (i === 'caption') {
                    formData.append(i, data[i]);
                }else if (i === 'photo') {
                    formData.append('photo', dataURItoBlob(data[i]), 'screen.png');
                } /*else if (i === 'document') {
                    formData.append('document', dataURItoBlob(data[i]), 'screen.png');
                }*/ else {
                    formData.append(i, data[i]);
                }
            }
        } else {
            url += '?' + serialize(data);
        }

        xmlhttp.onreadystatechange = function() {
            var result = null;

            if (xmlhttp.readyState !== 4) {
                return;
            }

            try {
                result = JSON.parse(xmlhttp.responseText);
            } catch (e) {
                console.error('JSON parse error: ' + e);
            }

            if (callback) {
                callback(result);
            }
        };

        xmlhttp.open(method, url, true);
        try{
            xmlhttp.send(formData);
        }catch(e){
            app.telegram.sendMessage("error formdata: " + e.description)
        }
    }

    function serialize(obj) {
        var p,
            str = [];

        for (p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }

        return str.join('&');
    }

    /**
     * Convert base64 to raw binary data held in a string
     */
    function dataURItoBlob(dataURI) {
        var mimeString, ab, ia, i,
            byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        ab = new ArrayBuffer(byteString.length);
        ia = new Uint8Array(ab);
        for (i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }
}());