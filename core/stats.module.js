/**
 * @file Statistic calculation module
 * @author Artem Veikus artem@veikus.com
 * @version 2.1
 */
(function () {
    var screenshotsData;

    app.modules = app.modules || {};
    app.modules.stats = Stats;

    Stats.initMessage = '/stats';

    // Initialization
    screenshotsData = localStorage.getItem('stats__screenshots');
    screenshotsData = screenshotsData ? JSON.parse(screenshotsData) : [];

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Stats(message) {
        this.username = message.chat.username;
        this.firstname = message.chat.first_name;
        this.lastname = message.chat.last_name;
        this.chat = message.chat.id;
        this.lang = app.settings.lang(this.chat);
        this.complete = true;

        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Stats.prototype.onMessage = function (message) {
        var result = [];

        if (app.taskManager) {
            // todo translation
            //Debug information for segmentation @Cizaquita
            result.push("Tareas pendientes: " + app.taskManager.queueLength());
            /* +
             "\nChat ID: " + this.chat +
             "\nUsuario: " + this.username +
             "\nNombre: " + this.firstname +
             "\nApellido: " + this.lastname +
             "\n\nHell yeah! izaquita rocks!");*/
        }

        app.telegram.sendMessage(this.chat, result.join('\r\n'), null);
    };

    /**
     * Saves screenshot requests statistics
     * @param task {object}
     * @param task.chat {Number} Chat id
     * @param task.location {Object} Longitude and latitude
     * @param task.zoom {Number} Zoom value
     */
    Stats.trackScreenshot = function (task) {
        var date = new Date();
        date.setUTCHours(1);
        screenshotsData.push({
            ts: date,
            chat: task.chat,
            username: task.username,
            firstname: task.firstname,
            lastname: task.lastname,
            zoom: task.zoom,
            location: {
                latitude: task.location.latitude,
                longitude: task.location.longitude
            }
        });

        //Data that will be saved in LocalStorage for segmentation
        //@cizaquita
        //localStorage.setItem('stats__screenshots', JSON.stringify(screenshotsData));
        /*console.log('--------------------------'+
         '\nSS de: @' + task.username +
         ', chat ID: ' + task.chat +
         ', a las: ' + date +
         ', lat: ' + task.location.latitude +
         ',' + task.location.longitude +
         '\n--------------------------')*/
        //Send logs to @Cizaquita chat
        //Most important username, chatID and lat long(location)
        /*app.telegram.sendMessage(-1001069963507, '--------------------------'+
         '\nSS de: @' + task.username +
         ', chat ID: ' + task.chat +
         ', a las: ' + date +
         ', lat: ' + task.location.latitude +
         ',' + task.location.longitude +
         '\n--------------------------',null)
         */
    }
}());
