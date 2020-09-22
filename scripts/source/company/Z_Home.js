var Z_Home = (function () {
    function Z_Home() {
        this.loader = new Z_Loader();
        this.z_page = new Z_Page();
        this.DEFAULT_REGION_ID = 1;
        this.translate = {
            "read_more": ["Read more", "Далее...", "Ավելին", "Далее..."],
            "contacts": ["Contacts", "Контакты", "Կապ", "Контакты"],
            "about_company": ["About company", "О компани", "Մեր մասին", "О компани"],
            "for_partners": ["For partners", "Партнерам", "Գործընկերների համար", "Партнерам"],
            "change_lang": ["Change language: ", "Изменить язык: ", "Փոխել լեզուն։ ", "Изменить язык: "],
            "contact_with_us": ["Contact us", "Связаться с нами", "Կապ մեզ հետ", "Связаться с нами"],
            "expand_your_experience": ["Expand your experience", "Расширьте свой опыт", "Ընդլայնեք ձեր փորձը", "Расширьте свой опыт"],
            "save": ["Save", "Сохранить", "Պահպանել", "Сохранить"],
            "cancel": ["Cancel", "Отменить", "Փակել", "Отменить"],
            "no_data": ["Nothing found", "Ничего не найдено", "Ոչինչ չի գտնվել", "Ничего не найдено"],
            "where_to_buy_footer": ["Partner locator", "Где купить", "Որտեղ գնել", "Где купить"],
        };
    }
    Z_Home.prototype.getHeader = function () {
        this.getRegions();
        this.getLangList();
        this.getMenu();
        return 0;
    };
    Z_Home.prototype.getHomePage = function () {
        var loader_home = new Z_Loader();
        loader_home.loadTemplate(this.drawHomePage, 'home', this);
        return 0;
    };
    Z_Home.prototype.drawHomePage = function (html, self) {
        $('body section').empty().append(html);
        var loader1 = new Z_Loader();
        loader1.phpSend(self.drawHomePageInfo, 'lanar', 'home_page_info', {}, self);
    };
    Z_Home.prototype.getHomePgaeInfo = function (self) {
        var loader1 = new Z_Loader();
        loader1.phpSend(self.drawHomePageInfo, 'lanar', 'home_page_info', {}, self);
        return 0;
    };
    Z_Home.prototype.drawHomePageInfo = function (page_data, self) {
        self.getCarousel();
        self.getProducts();
        var lang_id = parseInt(sessionStorage.getItem("lang_id")) - 1;
        var last_news = '';
        var last_news_data = page_data["info"]["last-news"];
        var about_data = page_data["info"]["about"];
        if (last_news_data !== null && last_news_data != 'null' && last_news_data !== undefined && last_news_data != 'undefined') {
            last_news += '<h1>' + last_news_data['name'] + '</h1>\n' +
                ' <img src="images/upload/' + last_news_data['image'] + '">' +
                '            <p>' + last_news_data['short_text'] + '</p>\n' +
                '            <a href="#" class="read-more" data-id="' + last_news_data['id'] + '">' + self.translate['read_more'][lang_id] + '</a>';
        }
        $('body .home-text .row .last-news').empty().append(last_news);
        $('body .home-text .row .about').empty().append("<div class='home_about_block'>" + about_data + "</div><a href='' class='read-more read_more_about'>" + self.translate["read_more"][lang_id] + "</a>");
        $(".read_more_about").on("click", function (e) {
            e.preventDefault();
            var about_loader = new Z_Page();
            about_loader.getAbout();
        });
        $(".last-news .read-more").on("click", function (e) {
            e.preventDefault();
            var zpage = new Z_Page();
            self.loader.phpSend(zpage.drawPressInfo, 'lanar', 'news_info', { "news_id": $(this).data("id") }, zpage);
        });
        return 0;
    };
    Z_Home.prototype.getLangList = function () {
        var lang_loader = new Z_Loader();
        lang_loader.phpSend(this.drawLangList, 'lanar', 'get_languages', {}, this);
        return 0;
    };
    Z_Home.prototype.drawLangList = function (data, self) {
        var lang_id = parseInt(sessionStorage.getItem("lang_id")) - 1;
        $(".change_lang_block_title .text").html(self.translate["change_lang"][lang_id]);
        $(".lang_popup .title_text").html(self.translate["expand_your_experience"][lang_id]);
        $(".lang_popup .save-lang_region").html(self.translate["save"][lang_id]);
        $(".lang_popup .cancel-popup").html(self.translate["cancel"][lang_id]);
        var lang_list = data["info"];
        var html = "";
        var defaul_lang = "";
        for (var i = 0; i < lang_list.length; i++) {
            if (lang_list[i]["lang_id"] == sessionStorage.getItem("lang_id")) {
                defaul_lang = lang_list[i]["name_full"];
                html += "<option selected data-id='" + lang_list[i]["lang_id"] + "' data-alias='" + lang_list[i]["name_short"] + "'>" + lang_list[i]["name_full"] + "</option>";
            }
            else {
                html += "<option data-id='" + lang_list[i]["lang_id"] + "' data-alias='" + lang_list[i]["name_short"] + "'>" + lang_list[i]["name_full"] + "</option>";
            }
        }
        $(".change_lang_block_title .defaul_lang").html(defaul_lang);
        $("header .lang_list").empty().append(html);
        $(".change_lang_block_title").on("click", function () {
            $(".lang_popup").fadeIn();
        });
        $(".save-lang_region").on("click", function () {
            sessionStorage.setItem("lang_id", $(".lang_list option:selected").data("id"));
            sessionStorage.setItem("region_id", $(".region_select option:selected").data("id"));
            $(".lang_popup").fadeOut();
            location.reload();
        });
        $(".cancel-popup, .close_lang_popup").on("click", function () {
            $(".lang_popup").fadeOut();
        });
        return 0;
    };
    Z_Home.prototype.getRegions = function () {
        var loader_regions = new Z_Loader();
        loader_regions.phpSend(this.drawRegions, 'lanar', 'get_regions', {}, this);
        return 0;
    };
    Z_Home.prototype.drawRegions = function (data, self) {
        data = data["info"];
        var regions_list = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i]["regionID"] == sessionStorage.getItem("region_id")) {
                regions_list += '<option selected data-id="' + data[i]["regionID"] + '">' + data[i]["region"] + '</option>';
            }
            else {
                regions_list += '<option data-id="' + data[i]["regionID"] + '">' + data[i]["region"] + '</option>';
            }
        }
        $("header .region_select").empty().append(regions_list);
        if (sessionStorage.getItem("region_id") === null || sessionStorage.getItem("region_id") === undefined) {
            sessionStorage.setItem("region_id", self.DEFAULT_REGION_ID);
        }
        return 0;
    };
    Z_Home.prototype.getMenu = function () {
        var loader2 = new Z_Loader();
        loader2.phpSend(this.drawMenu, 'lanar', 'get_menu', {}, 0, this);
        return 0;
    };
    Z_Home.prototype.drawMenu = function (data, parent_id, self) {
        data = data["info"];
        var html = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i]['sub'].length > 0) {
                html += '  <li class="nav-item dropdown" data-id="' + data[i]['id'] + '" data-alias="' + data[i]['alias'] + '">\n' +
                    '                        <a class="nav-link dropdown-toggle" href="#" id="' + data[i]['alias'] + '" data-alias="' + data[i]['alias'] + '" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
                    '                           ' + data[i]['name'] +
                    '                        </a>\n' +
                    '                        <div class="dropdown-menu" aria-labelledby="' + data[i]['alias'] + '">\n';
                for (var j = 0; j < data[i]['sub'].length; j++) {
                    html += ' <a class="dropdown-item" href="#" data-id="' + data[i]["sub"][j]['id'] + '" data-alias="' + data[i]["sub"][j]['alias'] + '">' + data[i]["sub"][j]['name'] + '</a>';
                }
                html += ' </div> </li>';
            }
            else {
                if (data[i]['alias'] == "for_partners") {
                    html += ' <li class="nav-item" data-id="' + data[i]['id'] + '" data-alias="' + data[i]['alias'] + '">\n' +
                        '                        <a class="nav-link" target="_blank" href="//portal.company.am" data-alias="' + data[i]['alias'] + '">' + data[i]['name'] + '</a>\n' +
                        '                    </li>';
                }
                else {
                    html += ' <li class="nav-item" data-id="' + data[i]['id'] + '" data-alias="' + data[i]['alias'] + '">\n' +
                        '                        <a class="nav-link" href="#" data-alias="' + data[i]['alias'] + '">' + data[i]['name'] + '</a>\n' +
                        '                    </li>';
                }
            }
        }
        $('header nav ul').empty().append(html);
        $('header nav ul li a').on('click', function (e) {
            if ($(this).parent().data("alias") != 'for_partners') {
                e.preventDefault();
            }
            var address = new Z_Address();
            sessionStorage.setItem("lang_id", sessionStorage.getItem("lang_id"));
            sessionStorage.setItem("page", $(this).data('alias'));
            sessionStorage.setItem("sub_page", "home");
            sessionStorage.setItem("sub_id", "0");
            address.openPage("view");
        });
        $(".navbar-brand").on("click", function (e) {
            e.preventDefault();
            var address = new Z_Address();
            sessionStorage.setItem("lang_id", sessionStorage.getItem("lang_id"));
            sessionStorage.setItem("page", 'home');
            sessionStorage.setItem("sub_page", "home");
            sessionStorage.setItem("sub_id", "0");
            address.openPage("view");
        });
        $(".change-language-dr div a").removeClass("selected");
        $(".change-language-dr div a[data-id='" + sessionStorage.getItem("lang_id") + "']").addClass("selected");
        $("#langDropdown").html($(".change-language-dr div a.selected").html());
        $(".change-language-dr div a").on("click", function (e) {
            e.preventDefault();
            $(".change-language-dr div a").removeClass("selected");
            $(this).addClass("selected");
            sessionStorage.setItem("lang_id", $(this).data("id"));
            $("#langDropdown").html($(".change-language-dr div a.selected").html());
            var address = new Z_Address();
            address.openPage('view');
            location.reload();
        });
        $(".search-info").on("click", function () {
            var search_loader = new Z_Loader();
            search_loader.phpSend(self.drawSearchResult, 'lanar', 'search_items', { "filter": $(".search-input").val() }, $(".search-input").val(), self);
        });
        $('.search-input').keydown(function (e) {
            if (e.keyCode == 13) {
                var search_loader = new Z_Loader();
                search_loader.phpSend(self.drawSearchResult, 'lanar', 'search_items', { "filter": $(".search-input").val() }, $(".search-input").val(), self);
            }
        });
    };
    Z_Home.prototype.drawSearchResult = function (search_result, searched_text, self) {
        var lang_id = parseInt(sessionStorage.getItem("lang_id"));
        var lang_id1 = parseInt(sessionStorage.getItem("lang_id")) - 1;
        var vendors_data = search_result["info"]["brands"];
        var categories_data = search_result["info"]["categories"];
        var news_data = search_result["info"]["news"];
        var params_data = search_result["info"]["params"];
        var products_data = search_result["info"]["products"];
        var soultions_data = search_result["info"]["solutions"];
        var search_result_html = '';
        search_result_html += '<ul class="search_result">';
        var vendors = '';
        var sea = $('.search-input').val();
        if (vendors_data.length > 0) {
            for (var i = 0; i < vendors_data.length; i++) {
                vendors_data[i]["description"] = vendors_data[i]["description"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                vendors_data[i]["title"] = vendors_data[i]["title"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                if (vendors_data[i]["lang_id"] == lang_id) {
                    search_result_html += '<li data-type="vendor" data-id="' + vendors_data[i]["id"] + '">' +
                        '<h1>' + vendors_data[i]["title"] + '</h1>' +
                        '<div>' + vendors_data[i]["description"] + '</div>' +
                        '</li>';
                }
            }
        }
        if (categories_data.length > 0) {
            for (var i = 0; i < categories_data.length; i++) {
                categories_data[i]["description"] = categories_data[i]["description"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                categories_data[i]["title"] = categories_data[i]["title"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                if (categories_data[i]["lang_id"] == lang_id) {
                    search_result_html += '<li data-type="category" data-id="' + categories_data[i]["id"] + '">' +
                        '<h1>' + categories_data[i]["title"] + '</h1>' +
                        '<div>' + categories_data[i]["description"] + '</div>' +
                        '</li>';
                }
            }
        }
        if (news_data.length > 0) {
            for (var i = 0; i < news_data.length; i++) {
                news_data[i]["description"] = news_data[i]["description"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                news_data[i]["title"] = news_data[i]["title"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                if (news_data[i]["lang_id"] == lang_id) {
                    search_result_html += '<li data-type="news" data-id="' + news_data[i]["id"] + '">' +
                        '<h1>' + news_data[i]["title"] + '</h1>' +
                        '<div>' + news_data[i]["description"] + '</div>' +
                        '</li>';
                }
            }
        }
        if (params_data.length > 0) {
            for (var i = 0; i < params_data.length; i++) {
                params_data[i]["description"] = params_data[i]["description"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                params_data[i]["title"] = params_data[i]["title"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                if (params_data[i]["lang_id"] == lang_id) {
                    search_result_html += '<li data-type="param">' +
                        '<h1><a target="_blank" href="' + params_data[i]["link"] + '">' + params_data[i]["title"] + '</a></h1>' +
                        '</li>';
                }
            }
        }
        if (products_data.length > 0) {
            for (var i = 0; i < products_data.length; i++) {
                products_data[i]["description"] = products_data[i]["description"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                products_data[i]["title"] = products_data[i]["title"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                if (products_data[i]["lang_id"] == lang_id) {
                    search_result_html += '<li data-type="product" data-id="' + products_data[i]["id"] + '">' +
                        '<h1><a target="_blank" href="' + products_data[i]["link"] + '">' + products_data[i]["title"] + '</a></h1>' +
                        '<div>' + products_data[i]["description"] + '</div>' +
                        '</li>';
                }
            }
        }
        if (soultions_data.length > 0) {
            for (var i = 0; i < soultions_data.length; i++) {
                soultions_data[i]["description"] = soultions_data[i]["description"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                soultions_data[i]["title"] = soultions_data[i]["title"].replace(sea, "<span class='find_text_search'>" + sea + "</span>");
                if (soultions_data[i]["lang_id"] == lang_id) {
                    search_result_html += '<li data-type="solution" data-id="' + soultions_data[i]["id"] + '">' +
                        '<h1><a target="_blank" href="' + soultions_data[i]["link"] + '">' + soultions_data[i]["title"] + '</a></h1>' +
                        '<div>' + soultions_data[i]["description"] + '</div>' +
                        '</li>';
                }
            }
        }
        search_result_html += '</ul>';
        $("body section").empty().append(search_result_html);
        if ($(".search_result li").length < 1) {
            $(".search_result").empty().append("<li style='text-align: center'>" + self.translate['no_data'][lang_id1] + "</li>");
        }
        $(".search_result li h1").on("click", function () {
            var search_info = new Z_Page();
            switch ($(this).parent().data("type")) {
                case 'vendor':
                    self.loader.loadTemplate(search_info.drawBrandTemp, 'brand_info', parseInt($(this).parent().data("id")), search_info);
                    break;
                case 'news':
                    self.loader.phpSend(search_info.drawPressInfo, 'lanar', 'news_info', { "news_id": $(this).parent().data("id") }, search_info);
                    break;
                case 'category':
                    self.loader.loadTemplate(search_info.drawBrandTemp, 'brand_info', parseInt($(this).parent().data("id")), search_info);
                    break;
                default:
            }
        });
        return 0;
    };
    Z_Home.prototype.getProducts = function () {
        var get_products = new Z_Loader();
        get_products.phpSend(this.drawProducts, 'lanar', 'get_categories', {}, this);
        return 0;
    };
    Z_Home.prototype.drawProducts = function (product_list, self) {
        var lang_id = parseInt(sessionStorage.getItem("lang_id")) - 1;
        product_list = product_list["info"];
        var html = '';
        html += '<div class="container-fluid home-product-list">\n' +
            '    <div class="row" style="margin-top: 30px">';
        for (var j = 0; j < product_list.length; j++) {
            var hover_img = product_list[j]['image'].substr(0, product_list[j]['image'].lastIndexOf('.')) + '_hover.png';
            if (product_list.length > 9) {
                html += '<div class="col-md-3"><div class="card product-item"  data-id="' + product_list[j]["category_id"] + '">\n' +
                    '            <img class="product_icon" src="images/upload/' + product_list[j]['image'] + '" class="card-img-top" alt="' + product_list[j]['image'] + '">\n' +
                    '            <img class="product_icon_hover" src="images/upload/' + hover_img + '" class="card-img-top" alt="' + product_list[j]['image'] + '">\n' +
                    '                <h5 class="card-title">' + product_list[j]['name'] + '</h5>\n' +
                    '        </div></div>';
            }
            else {
                html += '<div class="col-md-4"><div class="card product-item"  data-id="' + product_list[j]["category_id"] + '">\n' +
                    '            <img class="product_icon" src="images/upload/' + product_list[j]['image'] + '" class="card-img-top" alt="' + product_list[j]['image'] + '">\n' +
                    '            <img class="product_icon_hover" src="images/upload/' + hover_img + '" class="card-img-top" alt="' + product_list[j]['image'] + '">\n' +
                    '                <h5 class="card-title">' + product_list[j]['name'] + '</h5>\n' +
                    '        </div></div>';
            }
        }
        html += '</div></div>';
        $('body .home_product_list').empty().append(html);
        $(".product-item").on("click", function () {
            var zpage = new Z_Page();
            self.loader.loadTemplate(zpage.drawProductTemp, 'product_info', parseInt($(this).data("id")), zpage);
        });
        return 0;
    };
    Z_Home.prototype.getFooter = function () {
        var loader5 = new Z_Loader();
        loader5.phpSend(this.drawFooter, 'lanar', 'get_menu_footer', {}, 0, this);
        return 0;
    };
    Z_Home.prototype.drawFooter = function (menu, parent_id, self) {
        menu = menu["info"];
        var lang_id = parseInt(sessionStorage.getItem("lang_id")) - 1;
        var menu_html = '';
        menu_html += '<div class="col-md-4">\n' +
            '            <h3>' + self.translate["contacts"][lang_id] + '</h3>\n' +
            '        <div class="contacts">\n' +
            '        <p><i class="fas fa-map-marker-alt"></i><span class="phisical_address"></span></p>\n' +
            '        <p><i class="fas fa-phone"></i><span class="contact_phone_number"></span></p>\n' +
            '        <p><i class="fas fa-globe"></i><span class="contact_email"></span></p>\n' +
            '        <p><i class="fas fa-link"></i><span class="contact_with_us_text"></span></p>\n' +
            '        </div>\n' +
            '        </div>';
        menu_html += ' <div class="col-md-4">\n' +
            '            <h3>' + self.translate["about_company"][lang_id] + '</h3><ul>';
        for (var i = 0; i < 5; i++) {
            if (menu[i]["alias"] != 'vendors' && menu[i]["alias"] != 'products') {
                menu_html += '<li><a href="#" data-alias="' + menu[i]["alias"] + '">' + menu[i]["name"] + '</a></li>';
            }
        }
        menu_html += '</ul></div>';
        menu_html += ' <div class="col-md-4">\n' +
            '            <h3>' + self.translate["for_partners"][lang_id] + '</h3><ul>';
        for (var i = 5; i < menu.length; i++) {
            if (menu[i]["alias"] == 'where_to_buy') {
                menu_html += '<li><a href="#" data-alias="' + menu[i]["alias"] + '">' + self.translate["where_to_buy_footer"][lang_id] + '</a></li>';
            }
        }
        menu_html += '</ul></div>';
        $(".footer_menu").empty().append(menu_html);
        self.getContactInfo();
        $(".contact_with_us_text").on("click", function () {
            $("header nav ul li").removeClass("selected");
            $("header nav ul li[data-alias=contacts]").addClass("selected");
            var address = new Z_Address();
            sessionStorage.setItem("lang_id", sessionStorage.getItem("lang_id"));
            sessionStorage.setItem("page", 'contacts');
            sessionStorage.setItem("sub_page", "home");
            sessionStorage.setItem("sub_id", "0");
            address.openPage("view");
        });
        $("footer ul li a").on("click", function (e) {
            e.preventDefault();
            var address = new Z_Address();
            sessionStorage.setItem("lang_id", sessionStorage.getItem("lang_id"));
            sessionStorage.setItem("page", $(this).data('alias'));
            sessionStorage.setItem("sub_page", "home");
            sessionStorage.setItem("sub_id", "0");
            address.openPage("view");
        });
        return 0;
    };
    Z_Home.prototype.getContactInfo = function () {
        var loader_contact = new Z_Loader();
        loader_contact.phpSend(this.drawContactInfo, 'lanar', 'get_contacts', { "region_id": sessionStorage.getItem("region_id") }, this);
        return 0;
    };
    Z_Home.prototype.drawContactInfo = function (data, self) {
        data = data["info"][0];
        var lang_id = parseInt(sessionStorage.getItem("lang_id")) - 1;
        $(".phisical_address").html(data["phisical_address"]);
        $(".legal_address").html(data["legal_address"]);
        $(".contact_phone_number").html('<a href="tel:' + data["phone"] + '">' + data["phone"] + '</a>');
        $(".contact_email").html('<a href="mailto:' + data["email"] + '">' + data["email"] + '</a>');
        $(".contact_with_us_text").html(self.translate["contact_with_us"][lang_id]);
        self.getSocialNetwork();
        return 0;
    };
    Z_Home.prototype.getSocialNetwork = function () {
        var network_loader = new Z_Loader();
        network_loader.phpSend(this.drawSocialNetwork, 'lanar', 'get_social_networks', {}, this);
        return 0;
    };
    Z_Home.prototype.drawSocialNetwork = function (data, self) {
        data = data["info"];
        var social_icons = '';
        for (var i = 0; i < data.length; i++) {
            social_icons += '<a href="//' + data[i]["link"] + '" target="_blank">' + data[i]["icon"] + '</a>';
        }
        $(".social_links").empty().append(social_icons);
        return 0;
    };
    Z_Home.prototype.getCarousel = function () {
        var loader3 = new Z_Loader();
        loader3.phpSend(this.drawCarousel, 'lanar', 'brand_list', { "region_id": sessionStorage.getItem("region_id") }, 'vendor', this);
        return 0;
    };
    Z_Home.prototype.drawCarousel = function (slider_data, item_type, self) {
        if (item_type == 'vendor') {
            if (slider_data["info"] !== undefined) {
                slider_data = slider_data["info"]["items"];
            }
        }
        else if (item_type == 'product') {
            if (slider_data["info"] !== undefined) {
                slider_data = slider_data["info"];
            }
        }
        var thumb_items_count;
        var thumb_items_count_for_product;
        if (slider_data.length > 4) {
            thumb_items_count = 5;
        }
        else {
            thumb_items_count = parseInt(slider_data.length);
        }
        if (slider_data.length > 11) {
            thumb_items_count_for_product = 11;
        }
        else {
            thumb_items_count_for_product = parseInt(slider_data.length);
        }
        var slider = '';
        var thumbnail = '';
        slider += '<div id="sync1" class="slider owl-carousel owl-theme">';
        for (var i = 0; i < slider_data.length; i++) {
            if (item_type == 'vendor' || item_type == 'product_hover') {
                slider += ' <div class="item" data-id="' + slider_data[i]['brand_id'] + '">';
            }
            else if (item_type == 'vendor_hover' || item_type == 'product') {
                slider += ' <div class="item" data-id="' + slider_data[i]['category_id'] + '">';
            }
            slider += '<img src="images/upload/' + slider_data[i]['slider_image'] + '" alt="' + slider_data[i]['name'] + '">' +
                '                    <div class="carousel-description">\n';
            if (item_type == 'product') {
                slider += '                        <h5>' + slider_data[i]['name'] + '</h5><hr>';
            }
            slider += '</div>\n' +
                '</div>';
        }
        slider += '</div>';
        if (item_type == 'vendor') {
            slider += '<div class="thumb-carousel-container"><div id="sync2" class="navigation-thumbs owl-carousel owl-theme vendor-carousel">';
        }
        else {
            slider += '<div class="thumb-carousel-container"><div id="sync2" class="navigation-thumbs owl-carousel owl-theme">';
        }
        for (var i = 0; i < slider_data.length; i++) {
            if (item_type == 'vendor' || item_type == 'product_hover') {
                slider += '<div class="item" data-type="vendor" data-id="' + slider_data[i]['brand_id'] + '"><img src="images/upload/' + slider_data[i]['image'] + '" alt="' + slider_data[i]['name'] + '"></div>';
            }
            else if (item_type == 'product' || item_type == 'vendor_hover') {
                slider += '<div class="item" data-type="product" data-id="' + slider_data[i]['category_id'] + '"><img src="images/upload/' + slider_data[i]['image'] + '" alt="' + slider_data[i]['name'] + '"><span>' + slider_data[i]['name'] + '</span></div>';
            }
        }
        slider += '</div>' +
            '<div class="navbar-owl"><div class="owl-prev"><i class="fa fa-chevron-left"></i></div><div class="owl-next"><i class="fa fa-chevron-right"></i></div></div>' +
            '</div>';
        $(".headerCarousel").empty().append(slider);
        var owl = $(".owl-carousel");
        var sync1 = $(".slider");
        var sync2 = $(".navigation-thumbs");
        var thumbnailItemClass = '.owl-item';
        var slides = sync1.owlCarousel({
            video: true,
            items: 1,
            loop: true,
            margin: 10,
            nav: true,
            autoplay: true,
            autoplayTimeout: 6000,
            dots: false,
            autoplayHoverPause: true,
        }).on('changed.owl.carousel', syncPosition);
        function syncPosition(el) {
            var owl_slider = $(this).data('owl.carousel');
            var loop = owl_slider.options.loop;
            if (loop) {
                var count = el.item.count - 1;
                var current = Math.round(el.item.index - (el.item.count / 2) - .5);
                if (current < 0) {
                    current = count;
                }
                if (current > count) {
                    current = 0;
                }
            }
            else {
                var current = el.item.index;
            }
            var owl_thumbnail = sync2.data('owl.carousel');
            var itemClass = "." + owl_thumbnail.options.itemClass;
            var thumbnailCurrentItem = sync2
                .find(itemClass)
                .removeClass("synced")
                .eq(current);
            thumbnailCurrentItem.addClass('synced');
            if (!thumbnailCurrentItem.hasClass('active')) {
                var duration = 300;
                sync2.trigger('to.owl.carousel', [current, duration, true]);
            }
        }
        if (item_type == 'product' || item_type == 'vendor_hover') {
            var thumbs = sync2.owlCarousel({
                items: thumb_items_count,
                loop: false,
                autoplayTimeout: 6000,
                margin: 10,
                autoplay: true,
                nav: true,
                dots: false,
                autoplayHoverPause: true,
                onInitialized: function (e) {
                    var thumbnailCurrentItem = $(e.target).find(thumbnailItemClass).eq(this._current);
                    thumbnailCurrentItem.addClass('synced');
                },
            }).on('mouseout', thumbnailItemClass, function (e) {
                e.preventDefault();
                sync1.trigger('play.owl.autoplay', [6000]);
                sync2.trigger('play.owl.autoplay', [6000]);
            }).on('mouseover', thumbnailItemClass, function (e) {
                e.preventDefault();
                var duration = 300;
                var itemIndex = $(e.target).parents(thumbnailItemClass).index();
                sync1.trigger('to.owl.carousel', [itemIndex, duration, true]);
                sync1.trigger('stop.owl.autoplay');
                sync2.trigger('stop.owl.autoplay');
                $(".vendor_banner_image").hide();
            }).on("changed.owl.carousel", function (el) {
                var number = el.item.index;
                var owl_slider = sync1.data('owl.carousel');
                owl_slider.to(number, 100, true);
            });
            $('.owl-item').on('mouseleave', function (e) {
                $(".vendor_banner_image").show();
            });
        }
        else if (item_type == 'vendor' || item_type == 'product_hover') {
            $(".vendor_banner_image").hide();
            var autoWidthVal = false;
            if (item_type == 'product_hover') {
                autoWidthVal = false;
            }
            var thumbs = sync2.owlCarousel({
                items: thumb_items_count_for_product,
                loop: false,
                autoplayTimeout: 6000,
                margin: 0,
                nav: true,
                autoplay: false,
                autoWidth: autoWidthVal,
                dots: false,
                autoplayHoverPause: true,
                onInitialized: function (e) {
                    var thumbnailCurrentItem = $(e.target).find(thumbnailItemClass).eq(this._current);
                    thumbnailCurrentItem.addClass('synced');
                },
            }).on('mouseout', thumbnailItemClass, function (e) {
                e.preventDefault();
                sync1.trigger('play.owl.autoplay', [6000]);
                sync2.trigger('play.owl.autoplay', [6000]);
            }).on('mouseover', thumbnailItemClass, function (e) {
                e.preventDefault();
                var duration = 300;
                var itemIndex = $(e.target).parents(thumbnailItemClass).index();
                sync1.trigger('to.owl.carousel', [itemIndex, duration, true]);
                sync1.trigger('stop.owl.autoplay');
                sync2.trigger('stop.owl.autoplay');
            }).on("changed.owl.carousel", function (el) {
                var number = el.item.index;
                var owl_slider = sync1.data('owl.carousel');
                owl_slider.to(number, 100, true);
            });
        }
        $(".owl-prev").empty().append('<i class="fa fa-chevron-left"></i>');
        $(".owl-next").empty().append('<i class="fa fa-chevron-right"></i>');
        $(".owl-item").hover(function () {
            sync1.trigger('stop.owl.autoplay');
            sync2.trigger('stop.owl.autoplay');
        }, function () {
            sync1.trigger('play.owl.autoplay', [6000]);
            sync2.trigger('play.owl.autoplay', [6000]);
        });
        $("#sync2 .item").on("click", function () {
            var info_page = new Z_Page();
            if ($(this).data("type") == 'vendor') {
                self.loader.loadTemplate(info_page.drawBrandTemp, 'brand_info', parseInt($(this).data("id")), info_page);
            }
            else if ($(this).data("type") == 'product') {
                self.loader.loadTemplate(info_page.drawProductTemp, 'product_info', parseInt($(this).data("id")), info_page);
            }
        });
        $(".navbar-owl .owl-prev").on("click", function () {
            $(".owl-nav .owl-prev").trigger("click");
        });
        $(".navbar-owl .owl-next").on("click", function () {
            $(".owl-nav .owl-next").trigger("click");
        });
        return 0;
    };
    return Z_Home;
}());
//# sourceMappingURL=Z_Home.js.map