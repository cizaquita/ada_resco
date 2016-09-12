/**
 * @file Distance
 * @author Cris @Cizaquita - Rata @RATAELTRIFORCE
 */
(function() {
    app.modules = app.modules || {};
    app.modules.trivia = Trivia;

    Trivia.initMessage = '/trivia';

    /**
     * @param message {object} Telegram message object
     * @constructor
     */
    function Trivia(message) {
        this.chat = message.chat.id,
        this.message_id = message.message_id;
        this.onMessage(message);
    }

    /**
     * @param message {object} Telegram message object
     */
    Trivia.prototype.onMessage = function (message) {
    };
}());
