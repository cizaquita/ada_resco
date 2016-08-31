(function() {
    var message,
        chats = [],
        stats = JSON.parse(localStorage.stats__screenshots);

    message = "<b>Hi there!</b>"+"\n - Now you can use inline bot querys to find a location by place name, just typing the place name after <code>@DuNord_Intel_Bot [Place name]</code>"+"\n - Added a new command /latlon for desktop users that can't attach Location from web browser. (User request)"+"\n\nYou can rate us in <a href=\"http://telegram.me/storebot?start=dunord_intel_bot\">Store Bot</a>"+"\n⭐⭐⭐⭐⭐"+"\n\nThanks!";

    stats.forEach(function(item) {
        var chat = item.chat;

        if (chats.indexOf(chat) === -1) {
            chats.push(chat);
            app.telegram.sendMessage(chat, message, null);
        }
    });

}());

(function() {
    var message,
        chats = [],
        stats = JSON.parse(localStorage.stats__screenshots);

    message = [
        'Hi everyone',
        'The bot will be off for a while\nSorry for inconveniences.',
        '\nHappy ingressing!\n @Cizaquita'
    ].join('\n\n');


    app.telegram.sendMessage(7455490, message);

}());