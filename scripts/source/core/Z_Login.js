var Z_Login = (function () {
    function Z_Login() {
        this.MAIN_PAGE = "admin.html";
        this.LOGIN_PAGE = "login.html";
        this.DEFAULT_HOST = 1;
        this.DEFAULT_LANGUAGE = 1;
        this.DEFAULT_LANGUAGE_ID = '1';
        this.DEFAULT_PAGE = "home";
        this.LANGUAGES = ["no", 1, "ru", "am"];
        this.call_fn = new Z_Loader();
    }
    Z_Login.prototype.login = function (login, password) {
        var send_data = { "username": login, "password": password, "host_id": this.DEFAULT_HOST };
        this.call_fn.phpSend(this.goMain, 'lanar', 'admin_login', send_data, this);
    };
    Z_Login.prototype.testLogin = function (login, password) {
        var send_data = { "username": login, "password": password, "host_id": this.DEFAULT_HOST };
        this.call_fn.phpSend(this.testLoginCallback, 'ldap', 'check', send_data, this);
    };
    Z_Login.prototype.testLoginCallback = function (data) {
        console.log(data);
        if (data["info"] == "TRUE") {
            var message = new Z_Message();
            message.drawMessage("Login successful", 'SUCCESS');
        }
        return 0;
    };
    Z_Login.prototype.logOut = function () {
        this.call_fn.phpSend(this.goLogin, 'login', 'logout', this);
    };
    Z_Login.prototype.goLogin = function (self) {
        sessionStorage.clear();
        location.href = './login.html';
    };
    Z_Login.prototype.isLogged = function (data) {
        console.log(data);
        if (data) {
            this.goMain({
                'user_id': parseInt(sessionStorage.getItem("user_id")),
                'token': sessionStorage.getItem("token"),
                'host_id': parseInt(sessionStorage.getItem("host_id"))
            }, this);
        }
    };
    Z_Login.prototype.getCheckUser = function () {
        console.log('checkkk');
        this.call_fn.phpSend(this.checkUser, 'login', 'check_user', this);
        return 0;
    };
    Z_Login.prototype.checkUser = function (data, self) {
        console.log(data);
        if (data['info'] === 'logout') {
            self.logOut();
        }
        return 0;
    };
    Z_Login.prototype.goMain = function (data, self) {
        console.log(data);
        if (data["info"] === true) {
            sessionStorage.setItem("user_id", "1");
            location.href = self.MAIN_PAGE;
        }
        else {
            var message = new Z_Message();
            message.drawMessage("Your username or password is incorrect.", 'ERROR', 0);
        }
    };
    return Z_Login;
}());
//# sourceMappingURL=Z_Login.js.map