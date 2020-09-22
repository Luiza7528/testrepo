var Z_Message = (function () {
    function Z_Message() {
    }
    Z_Message.prototype.drawConfirm = function (message_text, callBack) {
        return 0;
    };
    Z_Message.prototype.drawPrompt = function (message_text, callBack) {
        return 0;
    };
    Z_Message.prototype.drawMessage = function (message_text, message_type, message_code) {
        if (message_type === void 0) { message_type = 'ERROR'; }
        if (message_code === void 0) { message_code = 0; }
        var msg;
        var icon = message_type.toLowerCase();
        var box = $('<div class="blur-box"></div>');
        $("body").append(box);
        switch (message_type) {
            case 'ERROR':
            case 'WARNING':
                msg = 'Code-' + message_code + ', Text-' + message_text + ', type ' + message_type;
                break;
            case 'NOTIFICATION':
            case 'SUCCESS':
                msg = 'Text-' + message_text + ', type' + message_type;
                break;
            default:
                return 1;
        }
        console.error(message_text);
        var popup = $("<div class='popup " + message_type.toLowerCase() + "'><div class='msg_view'><div class='i-border'><span class='icon'></span></div><div class='message'>" + message_text + "</div></div></div>");
        box.append(popup);
        $(".blur-box").on("click", function () {
            box.fadeOut('fast');
        });
        box.fadeIn('fast', function () {
            if (box.find('.buttons').length === 0) {
                var timerId = setTimeout(function () {
                    box.fadeOut('normal', function () {
                        box.remove();
                    });
                }, 2000);
            }
        });
        return 0;
    };
    return Z_Message;
}());
//# sourceMappingURL=Z_Message.js.map