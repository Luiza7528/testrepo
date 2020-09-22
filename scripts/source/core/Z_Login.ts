class Z_Login{
   // readonly MAIN_PAGE = "index.html";
    readonly MAIN_PAGE = "admin.html";
    readonly LOGIN_PAGE = "login.html";
    readonly DEFAULT_HOST = 1;
    readonly DEFAULT_LANGUAGE = 1;
    readonly DEFAULT_LANGUAGE_ID = '1';
    readonly DEFAULT_PAGE = "home";
    readonly LANGUAGES = ["no", 1, "ru", "am"];

    private call_fn = new Z_Loader();
    /**
     * Send login request PHP
     * @param {string} login
     * @param {string} password
     */
    public login(login:string, password:string) {
        let send_data = {"username": login, "password": password, "host_id": this.DEFAULT_HOST};
      this.call_fn.phpSend(this.goMain, 'lanar', 'admin_login', send_data, this);
    }

    public testLogin(login:string, password:string) {
        let send_data = {"username": login, "password": password, "host_id": this.DEFAULT_HOST};
        this.call_fn.phpSend(this.testLoginCallback, 'ldap', 'check', send_data, this);
    }

    public testLoginCallback(data:object):number{
       console.log(data);
        if(data["info"] == "TRUE"){
            let message = new Z_Message();
            message.drawMessage("Login successful", 'SUCCESS');
        }
        return 0;
    }
    /**
     * Send logout request PHP
     */
    public logOut() {
        this.call_fn.phpSend(this.goLogin, 'login', 'logout',this);
    }
    /**
     * Send user to Login Page
     */
    goLogin(self) {
        sessionStorage.clear();
        location.href = './login.html';
    }


    /**

     * Check on login page is user logged

     * @param data bool is user logged

     */

   isLogged(data:object) {
       console.log(data);
        if (data) {
            this.goMain({
                'user_id': parseInt(sessionStorage.getItem("user_id")),
                'token': sessionStorage.getItem("token"),
                'host_id': parseInt(sessionStorage.getItem("host_id"))
            }, this);
        }
    }

    /**
     * Get user check result
     * @param data object php answer

     */
    public getCheckUser():number {
        console.log('checkkk');
        this.call_fn.phpSend(this.checkUser, 'login', 'check_user',this);
        return 0;
    }

    /**
     *
     * @param data
     */
    checkUser(data:object, self):number{
        console.log(data);
        if (data['info'] === 'logout') {
            self.logOut();
        }
        return 0;
    }

    /**
     * Send user to main page
     * @param {object} data
     */
    goMain(data:object, self:any) {
        console.log(data);
        if(data["info"] === true){
            sessionStorage.setItem("user_id", "1");
            location.href = self.MAIN_PAGE;
        }else{
            let message = new Z_Message();
            message.drawMessage("Your username or password is incorrect.", 'ERROR', 0);
        }
        /*sessionStorage.setItem("user_id", "1");
        location.href = self.MAIN_PAGE;*/

/*        sessionStorage.setItem("lang_id", self.DEFAULT_LANGUAGE_ID);
        sessionStorage.setItem("region_id", self.DEFAULT_REGION_ID);
        sessionStorage.setItem("token", data["token"]);
        sessionStorage.setItem("user_id", data["user_id"]);
        sessionStorage.setItem("host_id", data["host_id"]);

        sessionStorage.setItem("lang_id", "1");
        sessionStorage.setItem("page", 'home');
        sessionStorage.setItem("sub_page", 'home');
        sessionStorage.setItem("sub_id", "0");*/

       /* let page = sessionStorage.getItem("page");
        let sub_page = sessionStorage.getItem("sub_page");
        if (page === "" || typeof page === "undefined" || page === null) page = self.DEFAULT_PAGE;
        if (typeof sub_page === "undefined") sub_page = "";
       // if (self.MAIN_PAGE === 'index.html') {
        if (self.MAIN_PAGE === 'admin.html') {
            location.href = "/" + "#" + self.LANGUAGES[self.DEFAULT_LANGUAGE_ID] + "/" + page + "/" + sub_page;
        } else {
            location.href = self.MAIN_PAGE + "#" + self.LANGUAGES[self.DEFAULT_LANGUAGE_ID] + "/" + page + "/" + sub_page;
        }*/
    }
}
