/**
 * @file Interval setup and processing module
 * @author Artem Veikus artem@veikus.com
 * @version 2.2
 */
(function() {
    var allowedTimeouts, allowedPauses, timeoutMarkup, pauseMarkup,
        intervals;

    app.modules = app.modules || {};
    app.modules.interval = Interval;

    //Disable command, possible bug and exploitation
	//Looks like this slow the Tasks
	//@cizaquita
	//The result of this command will be a /cancel command
	//For future testing the command will be /intervalEx
    Interval.initMessage = '/interval_disable';

    intervals = localStorage.getItem('interval__tasks');

    if (intervals) {
        intervals = JSON.parse(intervals);
    } else {
        intervals = [];
    }

    setInterval(function() {
        var lang,
            ts = new Date().getTime();

        intervals.forEach(function(task, k) {
            if (!task) {
                return;
            }

            if (task.nextPhotoAt <= ts) {
                (function(k) {
                    app.taskManager.add(task, function(result, error) {
                        // Remove interval after bot lost access to group
                        if (error === 'Error: Bad Request: Not in chat' || error === 'Error: Bot was kicked from a chat') {
                            delete(intervals[k]);
                            saveIntervals();
                        }
                    });
                }(k));

                task.nextPhotoAt = ts + task.pause;
            }

            if (task.shutdownTime <= ts) {
                lang = app.settings.lang(task.chat);

                app.telegram.sendMessage(task.chat, app.i18n(lang, 'interval', 'interval_finished'));
                delete(intervals[k]);
            }
        });

        saveIntervals();
    }, 30000);

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Interval(message) {
        this.chat = message.chat.id;
        this.lang = app.settings.lang(this.chat);
        this.hasTask = this.findActiveTask() > -1;
        this.timeout = null;
        this.pause = null;
        this.location = null;

        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Interval.prototype.onMessage = function (message) {
        var zoom, temp,
            text = message.text,
            location = message.location;

        // Cancel action
        temp = app.i18n(this.lang, 'interval', 'cancel');
        if (text === temp) {
            this.complete = true;
            app.telegram.sendMessage(this.chat, '👍', null); // thumbs up
            return;
        }

        // Active task warning
        temp = app.i18n(this.lang, 'interval', 'cancel_previous_option');
        if (this.hasTask && text === temp) {
            delete intervals[this.findActiveTask()];
            saveIntervals();

            this.hasTask = false;
            this.sendMessage('timeout');
            return;
        } else if (this.hasTask) {
            this.sendMessage('activeTask');
            return;
        }

        // Timeout setup
        if (!this.timeout && allowedTimeouts[text]) {
            this.timeout = allowedTimeouts[text];
            this.sendMessage('pause');
            return;
        } else if (!this.timeout) {
            this.sendMessage('timeout');
            return;
        }

        // Pause setup
        if (!this.pause && allowedPauses[text]) {
            this.pause = allowedPauses[text];
            this.sendMessage('location');
            return;
        } else if (!this.pause) {
            this.sendMessage('pause');
            return;
        }

        // Location setup
        if (!this.location && location && location.latitude && location.longitude) {
            this.location = location;
            this.sendMessage('zoom');
            return;
        } else if (!this.location) {
            this.sendMessage('location');
            return;
        }

        // Zoom setup
        zoom = parseInt(text);
        if (!this.zoom && zoom && zoom >= 3 && zoom <= 17) {
            this.zoom = zoom;
            this.complete = true;

            intervals.push({
                chat: this.chat,
                timeout: this.timeout,
                pause: this.pause,
                location: this.location,
                zoom: this.zoom,
                shutdownTime: new Date().getTime() + this.timeout,
                nextPhotoAt: new Date().getTime()
            });
            saveIntervals();

            this.sendMessage('complete');
        } else if (!this.zoom) {
            this.sendMessage('zoom');
        }
    };

    /**
     * Prepare and send response for each step
     * @param step {String}
     */
    Interval.prototype.sendMessage = function(step) {
        var resp, markup, keyboard;

        switch (step) {
            case 'activeTask':
                resp = app.i18n(this.lang, 'interval', 'cancel_previous');
                markup = {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: [
                        [app.i18n(this.lang, 'interval', 'cancel_previous_option')]
                    ]
                };
                break;

            case 'timeout':
                resp = app.i18n(this.lang, 'interval', 'timeout_setup');
                markup = {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: timeoutMarkup
                };
                break;

            case 'pause':
                resp = app.i18n(this.lang, 'interval', 'pause_setup');
                markup = {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: pauseMarkup
                };
                break;

            case 'location':
                resp = app.i18n(this.lang, 'interval', 'location_setup');
                markup = null;
                break;

            case 'zoom':
                resp = app.i18n(this.lang, 'interval', 'zoom_setup');
                keyboard = [
                    app.i18n(this.lang, 'interval', 'options_1').split(';'),
                    app.i18n(this.lang, 'interval', 'options_2').split(';'),
                    app.i18n(this.lang, 'interval', 'options_3').split(';'),
                    app.i18n(this.lang, 'interval', 'options_4').split(';')
                ];
                markup = {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: keyboard
                };
                break;

            case 'complete':
                resp = app.i18n(this.lang, 'interval', 'task_saved');
                markup = null;
        }

        if (markup) {
            markup.keyboard = markup.keyboard.slice();
            markup.keyboard.push([app.i18n(this.lang, 'interval', 'cancel')]);
        }
        app.telegram.sendMessage(this.chat, resp, markup);
    };

    /**
     * Find active task for current chat
     * @returns {number} Array index of found task (or -1)
     */
    Interval.prototype.findActiveTask = function() {
        var result = -1,
            chat = this.chat;

        intervals.forEach(function(interval, i) {
            if (interval && interval.chat === chat) {
                result = i;
            }
        });

        return result;
    };

    /**
     * Save intervals in localStorage
     */
    function saveIntervals() {
        localStorage.setItem('interval__tasks', JSON.stringify(intervals));
    }

    // Translations
    allowedTimeouts = {
        '1 hour': 3600 * 1000,
        '2 hours': 2 * 3600 * 1000,
        '3 hours': 3 * 3600 * 1000,
        '6 hours': 6 * 3600 * 1000,
        '12 hours': 12 * 3600 * 1000,
        '24 hours': 86400 * 1000,
        //'2 days': 2 * 86400 * 1000,
        //'3 days': 3 * 86400 * 1000,
        //'4 days': 4 * 86400 * 1000,
        //'1 week': 7 * 86400 * 1000,
        //'2 weeks': 14 * 86400 * 1000,
        //'3 weeks': 21 * 86400 * 1000,
        //'1 year': 365 * 86400 * 1000
    };

    allowedPauses = {
        //'3 minutes': 3 * 60 * 1000,
        '5 minutes': 5 * 60 * 1000,
        '10 minutes': 10 * 60 * 1000,
        '15 minutes': 15 * 60 * 1000,
        '30 minutes': 30 * 60 * 1000,
        '45 minutes': 45 * 60 * 1000,
        '60 minutes': 3600 * 1000,
        '2 hours': 2 * 3600 * 1000,
        '4 hours': 4 * 3600 * 1000,
        '6 hours': 6 * 3600 * 1000,
        '12 hours': 12 * 3600 * 1000,
        '24 hours': 24 * 3600 * 1000
    };

    timeoutMarkup = [
        ['1 hour', '2 hours', '3 hours'],
        ['6 hours', '12 hours', '24 hours']
        //['2 days', '3 days', '4 days'],
        //['1 week', '2 weeks', '3 weeks'],
        //['1 year']
    ];

    pauseMarkup = [
        ['5 minutes', '10 minutes', '15 minutes'],
        ['30 minutes', '45 minutes', '60 minutes'],
        ['2 hours', '4 hours', '6 hours'],
        ['12 hours', '24 hours']
    ];
}());
