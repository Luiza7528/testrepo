class Z_Message {

    public drawConfirm(message_text: string, callBack: (response: Response) => void): number {
        // @TODO confirm message
        return 0;
    }

    public drawPrompt(message_text: string, callBack: (response: Response) => void): number {
        // @TODO prompt message
        return 0;
    }

    public drawMessage(message_text:string, message_type: 'ERROR'|'WARNING'|'NOTIFICATION'|'SUCCESS' = 'ERROR', message_code: number = 0): number {
        let msg: string;
        let icon = message_type.toLowerCase();
        let box = $('<div class="blur-box"></div>');

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
        let popup = $("<div class='popup " + message_type.toLowerCase() + "'><div class='msg_view'><div class='i-border'><span class='icon'></span></div><div class='message'>" + message_text + "</div></div></div>");

        box.append(popup);

        $(".blur-box").on("click", function(){
            box.fadeOut('fast');
        });

        box.fadeIn('fast', function () {

            if (box.find('.buttons').length === 0) {
                let timerId = setTimeout(function () {

                    box.fadeOut('normal', function () {

                        box.remove();

                    });

                },  2000);

            }
        });
        return 0;
    }
}

