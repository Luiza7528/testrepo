var Z_Address = (function () {
    function Z_Address() {
        this.message = new Z_Message();
    }
    Z_Address.prototype.getAddress = function () {
        var address = window.location.hash;
        var lang_id = (window.location.hash.split('/')[0]).substring(1);
        var page = window.location.hash.split('/')[1];
        var sub_page = window.location.hash.split('/')[2];
        var sub_id = window.location.hash.split('/')[3];
        sessionStorage.setItem("lang_id", lang_id.toString());
        sessionStorage.setItem("page", page);
        sessionStorage.setItem("sub_page", sub_page);
        sessionStorage.setItem("sub_id", sub_id.toString());
        return { "lang_id": lang_id.toString(), "page": page, "sub_page": sub_page, "sub_id": sub_id.toString() };
    };
    Z_Address.prototype.setAddress = function (lang_id, page, sub_page, sub_id) {
        window.location.hash = "#" + lang_id + "/" + page + "/" + sub_page + "/" + sub_id;
        return 0;
    };
    Z_Address.prototype.openPage = function (page_type, from, is_new) {
        if (from === void 0) { from = "command"; }
        if (is_new === void 0) { is_new = false; }
        switch (from) {
            case "command":
                var lang_id = parseInt(sessionStorage.getItem('lang_id'));
                var page = sessionStorage.getItem('page');
                var sub_page = sessionStorage.getItem('sub_page');
                var sub_id = parseInt(sessionStorage.getItem('sub_id'));
                var result = this.setAddress(lang_id, page, sub_page, sub_id);
                if (result > 0) {
                }
                if (page_type == 'view' || page_type === undefined) {
                    var zhome = new Z_Home();
                }
                if (page_type == 'admin') {
                }
                var loader = new Z_Loader();
                $("header .top-section").show();
                switch (page) {
                    case 'home':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=home]").addClass("selected");
                        zhome.getHomePage();
                        break;
                    case 'contacts':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=contacts]").addClass("selected");
                        zpage.getContact();
                        break;
                    case 'vendors':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=vendors]").addClass("selected");
                        if (sub_id > 0) {
                            loader.loadTemplate(zpage.drawBrandTemp, 'brand_info', sub_id, zpage);
                        }
                        else {
                            zpage.getBrands();
                        }
                        break;
                    case 'products':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=products]").addClass("selected");
                        if (sub_id > 0) {
                            loader.loadTemplate(zpage.drawProductTemp, 'product_info', sub_id, zpage);
                        }
                        else {
                            zpage.getProducts();
                        }
                        break;
                    case 'press_center':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=press_center]").addClass("selected");
                        if (sub_id > 0) {
                            loader.phpSend(zpage.drawPressInfo, 'lanar', 'news_info', { "news_id": sub_id }, zpage);
                        }
                        else {
                            zpage.getPressCenter();
                        }
                        break;
                    case 'about_us':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=about_us]").addClass("selected");
                        zpage.getAbout();
                        break;
                    case 'press_center':
                        break;
                    case 'where_to_buy':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=where_to_buy]").addClass("selected");
                        zpage.getPartners();
                        break;
                    case 'languages_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=languages_admin]").addClass("selected");
                        z_page_admin.getLanguages();
                        break;
                    case 'regions_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=regions_admin]").addClass("selected");
                        z_page_admin.getRegions();
                        break;
                    case 'about_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=about_admin]").addClass("selected");
                        z_page_admin.getAbout();
                        break;
                    case 'vendors_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=vendors_admin]").addClass("selected");
                        z_page_admin.getVendors();
                        break;
                    case 'products_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=products_admin]").addClass("selected");
                        z_page_admin.getProducts();
                        break;
                    case 'news_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=news_admin]").addClass("selected");
                        z_page_admin.getPressCenter();
                        break;
                    case 'contacts_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=contacts_admin]").addClass("selected");
                        z_page_admin.getContacts();
                        break;
                    case 'for_partners_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=for_partners_admin]").addClass("selected");
                        z_page_admin.getPartners();
                        break;
                }
                break;
            case "address":
                is_new = true;
                var address_list = this.getAddress();
                sessionStorage.setItem('lang_id', address_list['lang_id']);
                sessionStorage.setItem('page', address_list['page']);
                sessionStorage.setItem('sub_page', address_list['sub_page']);
                sessionStorage.setItem('sub_id', address_list['sub_id']);
                this.openPage(page_type, "command", true);
                break;
        }
        return 0;
    };
    return Z_Address;
}());
//# sourceMappingURL=Z_Address.js.map