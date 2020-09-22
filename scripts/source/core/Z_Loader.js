var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Z_Loader = (function () {
    function Z_Loader() {
        this.TEMPLATE_EXTENSION = 'tpl';
        this.TEMPLATE_PATH = 'templates';
        this.PHP_PATH = 'engine';
        this.PHP_EXTENSION = 'php';
        this.TIMEOUT = 10000;
        this.DEFAULT_LANGUAGE_ID = 1;
        this.DEFAULT_REGION_ID = 1;
        this.php_request = new XMLHttpRequest();
        this.message = new Z_Message();
    }
    Z_Loader.prototype.phpSend = function (successCallback, filename, command, params) {
        if (params === void 0) { params = {}; }
        var forward_params = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            forward_params[_i - 4] = arguments[_i];
        }
        var url = this.PHP_PATH + "/" + filename + "." + this.PHP_EXTENSION;
        var self = this;
        this.php_request.ontimeout = function (err) {
            self.errorCallback(2, 'Server timeout' + err.toString(), 'ERROR');
        };
        this.php_request.onerror = function (err) {
            self.errorCallback(1, 'PHP request error:' + err.toString(), 'ERROR');
        };
        this.php_request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var data_1 = JSON.parse(this.response);
                console.log("Success answer!");
                console.log(data_1);
                if (parseInt(data_1['error_code']) === 0) {
                    successCallback && successCallback.apply(void 0, __spreadArrays([data_1], forward_params));
                }
                else {
                    if (data_1['error_code'] === 3) {
                        self.errorCallback(3, '' + data_1['error_text'], 'ERROR');
                    }
                    self.errorCallback(parseInt(data_1['error_code']), '' + data_1['error_text'], 'ERROR');
                }
            }
            else {
                console.log(this.status);
            }
        };
        if (sessionStorage.getItem("lang_id") === null) {
            sessionStorage.setItem("lang_id", this.DEFAULT_LANGUAGE_ID);
        }
        if (sessionStorage.getItem("lang_id") == '4') {
            sessionStorage.setItem("lang_id", '2');
        }
        if (sessionStorage.getItem("token") === null) {
            sessionStorage.setItem("token", ' ');
        }
        if (sessionStorage.getItem("host_id") === null) {
            sessionStorage.setItem("host_id", '1');
        }
        if (sessionStorage.getItem("user_id") === null) {
            sessionStorage.setItem("user_id", '0');
        }
        var data = {
            "user_id": sessionStorage.getItem("user_id"),
            "token": sessionStorage.getItem("token"),
            "lang_id": sessionStorage.getItem("lang_id"),
            "host_id": sessionStorage.getItem("host_id"),
            "command": command,
            "params": params
        };
        console.log(data);
        var data_string = JSON.stringify(data);
        this.php_request.open('POST', url);
        this.php_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        this.php_request.send(data_string);
        return 0;
    };
    Z_Loader.prototype.loadTemplate = function (successCallback, filename) {
        var forward_params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            forward_params[_i - 2] = arguments[_i];
        }
        var url = this.TEMPLATE_PATH + "/" + filename + "." + this.TEMPLATE_EXTENSION;
        var self = this;
        this.php_request.ontimeout = function (err) {
            self.errorCallback(2, 'Server timeout:' + err.toString(), 'ERROR');
        };
        this.php_request.onerror = function (err) {
            self.errorCallback(1, 'PHP request error:' + err.toString(), 'ERROR');
        };
        this.php_request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                successCallback && successCallback.apply(void 0, __spreadArrays([this.response], forward_params));
            }
            else {
                self.errorCallback(0, 'PHP data error:' + this.status, 'ERROR');
            }
        };
        this.php_request.open("GET", url, true);
        this.php_request.send();
        return 0;
    };
    Z_Loader.prototype.errorCallback = function (error_code, error_text, error_type) {
        var error = error_text;
        this.message.drawMessage(error, error_type, error_code);
        setTimeout(function () {
            if (error_code == 3) {
                var login = new Z_Login();
                login.logOut();
            }
        }, 1000);
    };
    Z_Loader.prototype.checkData = function (data) {
        if (parseInt(data["error"]) === 4 || parseInt(data["error"]) === 5) {
            sessionStorage.clear();
            location.href = './login.html';
            return false;
        }
        else if (data["error"] !== 0) {
            return false;
        }
        return true;
    };
    return Z_Loader;
}());
//# sourceMappingURL=Z_Loader.js.map