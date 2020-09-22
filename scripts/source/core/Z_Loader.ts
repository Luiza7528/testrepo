class Z_Loader {
    readonly TEMPLATE_EXTENSION: string = 'tpl';
    //readonly TEMPLATE_EXTENSION: string = 'htm';
    readonly TEMPLATE_PATH: string = 'templates';
    readonly PHP_PATH: string = 'engine';
    readonly PHP_EXTENSION: string = 'php';
    readonly TIMEOUT = 10000;
    public DEFAULT_LANGUAGE_ID = 1;
    public DEFAULT_REGION_ID = 1;

    private php_request:XMLHttpRequest;
    private message:Z_Message;

    constructor(){
        this.php_request = new XMLHttpRequest();
        this.message = new Z_Message();
    }

    public phpSend(successCallback:(response: Object, ...forward_params:any[]) => void, filename: string, command: string,  params:object = {}, ...forward_params:any[]): number {
        let url = this.PHP_PATH + "/" + filename + "." + this.PHP_EXTENSION;
        let self = this;

        this.php_request.ontimeout = function (err) {
            self.errorCallback(2, 'Server timeout'+err.toString(), 'ERROR');
        };
        this.php_request.onerror = function (err) {
            self.errorCallback(1, 'PHP request error:'+err.toString(), 'ERROR');
        };
        this.php_request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                // Success answer!
                const data = JSON.parse(this.response);
                console.log("Success answer!");
                console.log(data);
                if(parseInt(data['error_code'])===0){
                    successCallback && successCallback(data, ...forward_params);
                }else{
                    if(data['error_code'] ===3){
                        self.errorCallback(3, ''+data['error_text'], 'ERROR');
                       /* sessionStorage.clear();
                        location.href = './login.html';*/
                    }
                    self.errorCallback(parseInt(data['error_code']), ''+data['error_text'], 'ERROR');
                }
            } else {
                console.log(this.status)
                //self.errorCallback(0, ''+this.status, 'ERROR');
            }
        };
        if(sessionStorage.getItem("lang_id") === null){
           sessionStorage.setItem("lang_id", this.DEFAULT_LANGUAGE_ID);
        }
        if(sessionStorage.getItem("lang_id") == '4'){
            sessionStorage.setItem("lang_id", '2')
        }

        if(sessionStorage.getItem("token") === null){
            sessionStorage.setItem("token", ' ');
        }

        if(sessionStorage.getItem("host_id") === null){
            sessionStorage.setItem("host_id", '1');
        }
        if(sessionStorage.getItem("user_id") === null){
            sessionStorage.setItem("user_id", '0');
        }

        let data: object = {
            "user_id":  sessionStorage.getItem("user_id"),
            "token":    sessionStorage.getItem("token"),
            "lang_id":  sessionStorage.getItem("lang_id"),
            "host_id":  sessionStorage.getItem("host_id"),
            "command":  command,
            "params":   params
        };

        console.log(data);
        let data_string = JSON.stringify(data);
        this.php_request.open('POST', url);
        this.php_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        this.php_request.send(data_string);
        return 0;
    }

    public loadTemplate(successCallback:(response: Object, ...forward_params:any[]) => void, filename: string, ...forward_params:any[]): number {
        let url = this.TEMPLATE_PATH + "/" + filename + "." + this.TEMPLATE_EXTENSION;
        let self = this;

        this.php_request.ontimeout = function (err) {
            self.errorCallback(2, 'Server timeout:'+err.toString(), 'ERROR');
        };
        this.php_request.onerror = function (err) {
            self.errorCallback(1, 'PHP request error:'+err.toString(), 'ERROR');
        };
        this.php_request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                successCallback && successCallback(this.response, ...forward_params);
            } else {
                self.errorCallback(0, 'PHP data error:'+this.status, 'ERROR');
            }
        };
        this.php_request.open("GET", url, true);
        this.php_request.send();

        return 0;
    }


    private errorCallback(error_code: number, error_text: string, error_type: 'WARNING' | 'ERROR') {
        //let error = 'Error type-'+ error_type+' - error code-'+error_code+': error text-'+ error_text;
        let error = error_text;
        this.message.drawMessage(error, error_type, error_code);

        setTimeout(function(){
            if(error_code == 3){
                let login = new Z_Login();
                login.logOut();
            }
        }, 1000);

    }


    
    /**
     * Checking is engine answer correct
     * @param   data {array}
     * @returns {boolean}
     */

   checkData(data) {
        if (parseInt(data["error"]) === 4 || parseInt(data["error"]) === 5) {// unknown user or send wrong data
            sessionStorage.clear();
            location.href = './login.html';
            return false;
        } else if (data["error"] !== 0) {
            return false;
        }
        return true;
    }
}
