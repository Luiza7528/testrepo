class Z_Address {
    private message = new Z_Message();

    private getAddress(): object {
        let address = window.location.hash;
        /*  let lang_id: number = 1;
          let page: string = 'home';
          let sub_page: string = 'home';
          let sub_id: number = 0;*/
        let lang_id = (window.location.hash.split('/')[0]).substring(1);
        let page = window.location.hash.split('/')[1];
        let sub_page = window.location.hash.split('/')[2];
        let sub_id = window.location.hash.split('/')[3];


        sessionStorage.setItem("lang_id", lang_id.toString());
        sessionStorage.setItem("page", page);
        sessionStorage.setItem("sub_page", sub_page);
        sessionStorage.setItem("sub_id", sub_id.toString());

        return {"lang_id": lang_id.toString(), "page": page, "sub_page": sub_page, "sub_id": sub_id.toString()};
    }

    private setAddress(lang_id: number, page: string, sub_page: string, sub_id: number): number {
        window.location.hash = "#" + lang_id + "/" + page + "/" + sub_page + "/" + sub_id;
        return 0;
    }

    public openPage(page_type:string, from = "command", is_new = false): number {
        switch (from) {
            case "command":
                let lang_id = parseInt(sessionStorage.getItem('lang_id'));
                let page = sessionStorage.getItem('page');
                let sub_page = sessionStorage.getItem('sub_page');
                let sub_id = parseInt(sessionStorage.getItem('sub_id'));
                let result: number = this.setAddress(lang_id, page, sub_page, sub_id);
                if (result > 0) {
                    // this.message.showError();
                }

                if(page_type == 'view' || page_type === undefined){
                    /*var zpage = new Z_Page();*/
                    var zhome = new Z_Home();
                }
                if(page_type == 'admin'){
                    /*var z_page_admin = new Z_Pages();*/
                }
                let loader = new Z_Loader();
               // let z_page_admin = new Z_Pages();
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
                        if(sub_id > 0){
                            loader.loadTemplate(zpage.drawBrandTemp, 'brand_info', sub_id, zpage);
                        }else{
                            zpage.getBrands();
                        }
                        break;
                    case 'products':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=products]").addClass("selected");
                        if(sub_id > 0){
                            loader.loadTemplate(zpage.drawProductTemp, 'product_info', sub_id, zpage);
                        }else{
                            zpage.getProducts();
                        }
                        break;
                    case 'press_center':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=press_center]").addClass("selected");
                        if(sub_id > 0){
                            loader.phpSend(zpage.drawPressInfo, 'lanar', 'news_info', {"news_id": sub_id},  zpage);
                        }else{
                            zpage.getPressCenter();
                        }
                        break;
                    case 'about_us':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=about_us]").addClass("selected");
                        zpage.getAbout();
                        break;
                    case 'press_center':
                    /*    $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=press_center]").addClass("selected");
                        if(sub_id > 0){
                            loader.phpSend(zpage.drawPressInfo, 'lanar', 'news_info', {"news_id": sub_id},  zpage);
                        }else{
                            zpage.getPressCenter();
                        }*/

                        break;
                    case 'where_to_buy':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=where_to_buy]").addClass("selected");
                        zpage.getPartners();
                        break;
                    /*case 'contacts':
                        page_.getContact();
                        break;*/
                        //ADMIN PAGE MENU
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
                /*    case 'where_to_buy_admin':
                        $("header nav ul li").removeClass("selected");
                        $("header nav ul li[data-alias=where_to_buy_admin]").addClass("selected");
                        break;*/
                }
                break;
            case "address":
                is_new = true;
                let address_list = this.getAddress();
                sessionStorage.setItem('lang_id', address_list['lang_id']);
                sessionStorage.setItem('page', address_list['page']);
                sessionStorage.setItem('sub_page', address_list['sub_page']);
                sessionStorage.setItem('sub_id', address_list['sub_id']);
                this.openPage(page_type, "command", true);
                break;
        }
        return 0;
    }
}
