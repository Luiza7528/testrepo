class Z_User {
    private message = new Z_Message();
    private call_fn = new Z_Loader();
    private notifications = new Z_Notifications();
    readonly PHP_URL = "../engine/";

    /**
     * Send  user info request PHP
     * @return {number} if send ok - 0 or error code
     */
    getUser(): number {
        this.call_fn.phpSend(this.drawUser, 'cb', 'get_user_info', {}, this);
        let loader_1 = new Z_Loader();
        loader_1.phpSend(this.setUserAccess, 'cb', 'access_list', {"user_id": parseInt(sessionStorage.getItem("user_id"))}, this);
        return 0;
    }

    setUserAccess(access_list:object[], self):number{
        let access = access_list["info"];
        for (let i = 0; i < access.length; i++) {
            if (access[i]["alias"] == 'add_book') {
                //add_book_access = true;
                sessionStorage.setItem("add_book_access", true);
            }
            if (access[i]["alias"] == 'edit_book') {
                // edit_book_access = true;
                sessionStorage.setItem("edit_book_access", true);
            }
            if (access[i]["alias"] == 'book_delete') {
                //  remove_book_access = true;
                sessionStorage.setItem("remove_book_access", true);
            }
/*            if (access[i]["alias"] == 'request_for_acquisition') {
                //get_request_access = true;
                sessionStorage.setItem("get_request_access", true);
            }*/
            if (access[i]["alias"] == 'user_add_edit') {
                // add_user_access = true;
                sessionStorage.setItem("add_user_access", true);

            }
        }
        return 0;
    }

    /**
     *
     * @param user_info
     */
    drawUser(user_info: object, self): number {
        let html = '';
        if (user_info['info'][0]["image"] !== null) {
            /* $(".user-info .avatar").find("img").attr('src', "images/upload/" + user_info['info'][0]["image"]);
             $(".user-info .profile-image").find("img").attr('src', "images/upload/" + user_info['info'][0]["image"]);
             $(".user-info").find(".name").text(user_info['info'][0]["name"] + " " + user_info['info'][0]["surname"]);*/

            html += '<div class="avatar"><img src="images/upload/' + user_info["info"][0]["image"] + '"></div>' +
                ' <span class="name">' + user_info['info'][0]["name"] + " " + user_info['info'][0]["surname"] + '</span>';
        } else {
            html += '            <div class="avatar" data-id="' + user_info['info'][0]["user_id"] + '">' +
                '                <img src="images/user_no_image.png">' +
                '            </div>' +
                ' <span class="name">' + user_info['info'][0]["name"] + " " + user_info['info'][0]["surname"] + '</span>';
        }
        $('.user-name').empty().append(html);
        sessionStorage.setItem("user_type", user_info['info'][0]["user_type"]);
        sessionStorage.setItem("user_department", user_info['info'][0]["department"]);

        $('body').find('header .user-info .user-name').off().on('click',  function () {
            self.call_fn.phpSend(self.drawUserSettings, 'cb', 'access_list', {"user_id": parseInt(sessionStorage.getItem("user_id"))}, user_info, user_info['info'][0]["user_type"], self);
            //self.drawUserSettings(user_info, user_info['info'][0]["user_type"],  self);
        });

        $('body').find("header").on('click', '.notification-icon', function () {
            self.notifications.getNotificationList("open");
          /*  $(".notifications-list").fadeToggle();*/
        });
        return 0;
    }

    /**
     * Draw user info
     * @param {object} user_info
     * @return {number} if draw ok - 0 or error code
     */
    drawUserSettings(access: object[], user_info: object, user_type: string, self): number {
        access = access["info"];
       // let get_request_access = false;
        let add_book_access = false;
        let edit_book_access = false;
        let remove_book_access = false;
        let add_user_access = false;
        for (let i = 0; i < access.length; i++) {
            if (access[i]["alias"] == 'add_book') {
                add_book_access = true;
                //sessionStorage.setItem("add_book_access", true);
            }
            if (access[i]["alias"] == 'edit_book') {
                edit_book_access = true;
               // sessionStorage.setItem("edit_book_access", true);
            }
            if (access[i]["alias"] == 'book_delete') {
                remove_book_access = true;
               // sessionStorage.setItem("remove_book_access", true);
            }
           /* if (access[i]["alias"] == 'request_for_acquisition') {
                get_request_access = true;
               // sessionStorage.setItem("get_request_access", true);
            }*/
            if (access[i]["alias"] == 'user_add_edit') {
                add_user_access = true;
               // sessionStorage.setItem("add_user_access", true);
            }
        }
        let html = "";
        html += '<div>';
        if (user_info["info"][0]["image"] != null) {
            html += ' <div class="profile-image"><img src="images/upload/' + user_info["info"][0]["image"] + '"></div>';
        } else {
            html += ' <div class="profile-image"><img src="images/user_no_image.png"></div>';
        }
        html += '                    <div class="user-info-text">\n' +
            '                        <div class="name">' + user_info['info'][0]["name"] + " " + user_info['info'][0]["surname"] + '</div>\n' +
            '                        <div class="position">' + user_info['info'][0]["position"] + '</div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <ul>\n' +
            '                    <li data-alias="profile" data-id="1"><div>Անձնական էջ</div>\n' +
            '                    <li data-alias="library" data-id="2" class="has_sub"><div>Իմ գրադարանը</div>\n' +
            '                        <ul>\n' +
            '                            <li data-alias="books_list" data-id="1"><div>Գրքեր</div></li>\n' +
            '                            <li data-alias="newspapers_list" data-id="2"><div>Պարբերականներ</div></li>\n' +
            '                            <li data-alias="guide_list" data-id="3"><div>Ձեռնարկներ</div></li>\n' +
            '                            <li data-alias="other_list" data-id="4"><div>Այլ</div></li>\n' +
            '                        </ul>\n' +
            '                    </li>\n' +
            '                    <li data-alias="archive" data-id="3"><div>Արխիվ</div></li>\n';
            html += '<li data-alias="get_request" data-id="4"><div>Ձեռքբերման հայտ</div></li>';
            html += '<li data-alias="sent_request" data-id="4"><div>Ուղարկված հայտեր</div></li>';
            html += '<li data-alias="order_history" data-id="4"><div>Պատմություն</div></li>';


        //if (user_type == 'admin') {
       // html += '<li data-alias="administration"><div>Ադմինիստրավորում</div></li>';
        if(access.length > 0){
            html += '<li data-alias="administration"><div>Ադմինիստրավորում</div></li>';
        }
        //}

        html += '<li data-alias="logout"><div>Ելք</div></li>\n' +
            '                </ul>';
        $('body').find('header .user-info-popup').empty().append(html);
        $(".user-info-popup").fadeToggle();

        //EVENTS
        $(".user-info-popup > ul > li").hover(function () {
            //$(".user-info-popup ul ul").hide();
            $(this).find("ul").fadeIn(500);
        }, function () {
            $(".user-info-popup ul ul").hide();
        });
        $('body').off().on('click', '.user-info-popup ul li div', function () {
            let book1 = new Z_Books();
            let address = new Z_Address();
            let title = "";
            $(".user-info-popup").fadeOut();

            sessionStorage.setItem("lang_id", "1");
            sessionStorage.setItem("page", $(this).parent().data("alias"));
            sessionStorage.setItem("sub_page", "home");
            sessionStorage.setItem("sub_id", "0");
            address.openPage();
        });
        return 0;
    }


    drawUserProfileTemp(html: any, self): number {
        $("section").empty().append(html);
        let loader = new Z_Loader();
        loader.phpSend(self.drawUserProfile, 'cb', 'get_user_info', {}, self);
        return 0
    }

    drawUserProfile(user_info: object, self): number {
        user_info = user_info["info"][0];
        //DRAW USER INFO
        if (user_info["image"] != null) {
            $(".user-info-block .image_1").attr("src", '../images/upload/' + user_info["image"]);
        } else {
            $(".user-info-block .image_1").attr("src", '../images/no_image_user.png');
        }

        $("span[data-alias='el_card_number']").text(user_info["el_card_number"]);
        for (let i in user_info) {
            $("input[name='" + i + "']").val(user_info[i])
        }

        //EVENTS
        $(".change_photo").off().on("click", function () {
            //$('input[name="fileToUpload"]').trigger("click");
            $('input[name="fileToUpload"]').click();
        });

        $('.user-info-block .img-block input[name="fileToUpload"]').off().on('change', function (e) {
            e.preventDefault();
            let formData = new FormData($('.img-block form')[0]);
            $.ajax({
                url: 'engine/upload_cb.php',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 1500,
                success: function (result) {
                    if (JSON.parse(result)['errors']) {
                    } else {
                        $('.img-block form .profile-image').remove();
                        $('.img-block form').append('<div class="profile-image"></div>');
                        $('.img-block input[type="hidden"]').parent('div').removeClass('removed');
                        $('.img-block input[type="hidden"]').val(JSON.parse(result)['name']);
                        $('.img-block .profile-image').empty().append('<img src="../images/upload/' + $('.img-block input[type="hidden"]').val() + '">');
                        $('.img-block form .image_1').hide();

                    }
                }
            });
        });

        $(".action-block .save").on("click", function (e) {
            e.preventDefault();
            let data = {
                "name": $("input[name=name]").val(),
                "surname": $("input[name=surname]").val(),
                "department": $("input[name=department]").val(),
             /*   "section": $("input[name=section]").val(),
                "position": $("input[name=position]").val(),*/
                "email": $("input[name=mail]").val(),
                "phone": $("input[name=telephone]").val(),
                "access": []
            };

            if ($(".image_send").val() != "") {
                data["image"] = $(".image_send").val()
            } else {
                data["image"] = user_info["image"]
            }
            self.call_fn.phpSend(self.reDrawUserProfile, 'cb', 'edit_user_info', data, self);
        });

        $(".action-block .cancel").on("click", function (e) {
            e.preventDefault();
            $(".user-info-popup ul li[data-alias='library'] div").trigger("click");
            //self.call_fn.phpSend(self.reDrawUserProfile, 'cb', 'edit_user_info', self);
        });
        return 0;
    }

    reDrawUserProfile(data, self): number {
        if (data) {
            // self.message.drawMessage('Անձնական տվյալները թարմացված են։','SUCCESS');
            alert("Անձնական տվյալները թարմացված են:");
            self.call_fn.phpSend(self.drawUser, 'cb', 'get_user_info', {}, self);
            //self.call_fn.phpSend(self.drawUserProfile, 'cb', 'get_user_info', {}, self);
        }

        return 0;
    }


}
