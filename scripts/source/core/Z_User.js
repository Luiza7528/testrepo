var Z_User = (function () {
    function Z_User() {
        this.message = new Z_Message();
        this.call_fn = new Z_Loader();
        this.notifications = new Z_Notifications();
        this.PHP_URL = "../engine/";
    }
    Z_User.prototype.getUser = function () {
        this.call_fn.phpSend(this.drawUser, 'cb', 'get_user_info', {}, this);
        var loader_1 = new Z_Loader();
        loader_1.phpSend(this.setUserAccess, 'cb', 'access_list', { "user_id": parseInt(sessionStorage.getItem("user_id")) }, this);
        return 0;
    };
    Z_User.prototype.setUserAccess = function (access_list, self) {
        var access = access_list["info"];
        for (var i = 0; i < access.length; i++) {
            if (access[i]["alias"] == 'add_book') {
                sessionStorage.setItem("add_book_access", true);
            }
            if (access[i]["alias"] == 'edit_book') {
                sessionStorage.setItem("edit_book_access", true);
            }
            if (access[i]["alias"] == 'book_delete') {
                sessionStorage.setItem("remove_book_access", true);
            }
            if (access[i]["alias"] == 'user_add_edit') {
                sessionStorage.setItem("add_user_access", true);
            }
        }
        return 0;
    };
    Z_User.prototype.drawUser = function (user_info, self) {
        var html = '';
        if (user_info['info'][0]["image"] !== null) {
            html += '<div class="avatar"><img src="images/upload/' + user_info["info"][0]["image"] + '"></div>' +
                ' <span class="name">' + user_info['info'][0]["name"] + " " + user_info['info'][0]["surname"] + '</span>';
        }
        else {
            html += '            <div class="avatar" data-id="' + user_info['info'][0]["user_id"] + '">' +
                '                <img src="images/user_no_image.png">' +
                '            </div>' +
                ' <span class="name">' + user_info['info'][0]["name"] + " " + user_info['info'][0]["surname"] + '</span>';
        }
        $('.user-name').empty().append(html);
        sessionStorage.setItem("user_type", user_info['info'][0]["user_type"]);
        sessionStorage.setItem("user_department", user_info['info'][0]["department"]);
        $('body').find('header .user-info .user-name').off().on('click', function () {
            self.call_fn.phpSend(self.drawUserSettings, 'cb', 'access_list', { "user_id": parseInt(sessionStorage.getItem("user_id")) }, user_info, user_info['info'][0]["user_type"], self);
        });
        $('body').find("header").on('click', '.notification-icon', function () {
            self.notifications.getNotificationList("open");
        });
        return 0;
    };
    Z_User.prototype.drawUserSettings = function (access, user_info, user_type, self) {
        access = access["info"];
        var add_book_access = false;
        var edit_book_access = false;
        var remove_book_access = false;
        var add_user_access = false;
        for (var i = 0; i < access.length; i++) {
            if (access[i]["alias"] == 'add_book') {
                add_book_access = true;
            }
            if (access[i]["alias"] == 'edit_book') {
                edit_book_access = true;
            }
            if (access[i]["alias"] == 'book_delete') {
                remove_book_access = true;
            }
            if (access[i]["alias"] == 'user_add_edit') {
                add_user_access = true;
            }
        }
        var html = "";
        html += '<div>';
        if (user_info["info"][0]["image"] != null) {
            html += ' <div class="profile-image"><img src="images/upload/' + user_info["info"][0]["image"] + '"></div>';
        }
        else {
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
        if (access.length > 0) {
            html += '<li data-alias="administration"><div>Ադմինիստրավորում</div></li>';
        }
        html += '<li data-alias="logout"><div>Ելք</div></li>\n' +
            '                </ul>';
        $('body').find('header .user-info-popup').empty().append(html);
        $(".user-info-popup").fadeToggle();
        $(".user-info-popup > ul > li").hover(function () {
            $(this).find("ul").fadeIn(500);
        }, function () {
            $(".user-info-popup ul ul").hide();
        });
        $('body').off().on('click', '.user-info-popup ul li div', function () {
            var book1 = new Z_Books();
            var address = new Z_Address();
            var title = "";
            $(".user-info-popup").fadeOut();
            sessionStorage.setItem("lang_id", "1");
            sessionStorage.setItem("page", $(this).parent().data("alias"));
            sessionStorage.setItem("sub_page", "home");
            sessionStorage.setItem("sub_id", "0");
            address.openPage();
        });
        return 0;
    };
    Z_User.prototype.drawUserProfileTemp = function (html, self) {
        $("section").empty().append(html);
        var loader = new Z_Loader();
        loader.phpSend(self.drawUserProfile, 'cb', 'get_user_info', {}, self);
        return 0;
    };
    Z_User.prototype.drawUserProfile = function (user_info, self) {
        user_info = user_info["info"][0];
        if (user_info["image"] != null) {
            $(".user-info-block .image_1").attr("src", '../images/upload/' + user_info["image"]);
        }
        else {
            $(".user-info-block .image_1").attr("src", '../images/no_image_user.png');
        }
        $("span[data-alias='el_card_number']").text(user_info["el_card_number"]);
        for (var i in user_info) {
            $("input[name='" + i + "']").val(user_info[i]);
        }
        $(".change_photo").off().on("click", function () {
            $('input[name="fileToUpload"]').click();
        });
        $('.user-info-block .img-block input[name="fileToUpload"]').off().on('change', function (e) {
            e.preventDefault();
            var formData = new FormData($('.img-block form')[0]);
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
                    }
                    else {
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
            var data = {
                "name": $("input[name=name]").val(),
                "surname": $("input[name=surname]").val(),
                "department": $("input[name=department]").val(),
                "email": $("input[name=mail]").val(),
                "phone": $("input[name=telephone]").val(),
                "access": []
            };
            if ($(".image_send").val() != "") {
                data["image"] = $(".image_send").val();
            }
            else {
                data["image"] = user_info["image"];
            }
            self.call_fn.phpSend(self.reDrawUserProfile, 'cb', 'edit_user_info', data, self);
        });
        $(".action-block .cancel").on("click", function (e) {
            e.preventDefault();
            $(".user-info-popup ul li[data-alias='library'] div").trigger("click");
        });
        return 0;
    };
    Z_User.prototype.reDrawUserProfile = function (data, self) {
        if (data) {
            alert("Անձնական տվյալները թարմացված են:");
            self.call_fn.phpSend(self.drawUser, 'cb', 'get_user_info', {}, self);
        }
        return 0;
    };
    return Z_User;
}());
//# sourceMappingURL=Z_User.js.map