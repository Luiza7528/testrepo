"use strict";
class Z_Address {
    constructor() {
        this.message = new Z_Message();
    }
    getAddress() {
        let address = window.location.hash;
        let lang_id = (window.location.hash.split('/')[0]).substring(1);
        let page = window.location.hash.split('/')[1];
        let sub_page = window.location.hash.split('/')[2];
        let sub_id = window.location.hash.split('/')[3];
        sessionStorage.setItem("lang_id", lang_id.toString());
        sessionStorage.setItem("page", page);
        sessionStorage.setItem("sub_page", sub_page);
        sessionStorage.setItem("sub_id", sub_id.toString());
        return { "lang_id": lang_id.toString(), "page": page, "sub_page": sub_page, "sub_id": sub_id.toString() };
    }
    setAddress(lang_id, page, sub_page, sub_id) {
        window.location.hash = "#" + lang_id + "/" + page + "/" + sub_page + "/" + sub_id;
        return 0;
    }
    openPage(page_type, from = "command", is_new = false) {
        switch (from) {
            case "command":
                let lang_id = parseInt(sessionStorage.getItem('lang_id'));
                let page = sessionStorage.getItem('page');
                let sub_page = sessionStorage.getItem('sub_page');
                let sub_id = parseInt(sessionStorage.getItem('sub_id'));
                let result = this.setAddress(lang_id, page, sub_page, sub_id);
                if (result > 0) {
                }
                if (page_type == 'view' || page_type === undefined) {
                    var zhome = new Z_Home();
                }
                if (page_type == 'admin') {
                }
                let loader = new Z_Loader();
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
class Z_Draw {
    drawList(list, template, position) {
        let html = '';
        html += '<ul>';
        for (let i = 0; i < list.length; i++) {
            if (list[i]["access"] != undefined) {
                html += '<li data-access="' + list[i]["access"].toLowerCase() + '" data-id="' + list[i]["id"] + '">';
            }
            else {
                html += '<li data-id="' + list[i]["id"] + '">';
            }
            for (let j = 0; j < template.length; j++) {
                let div = template[j]['header'];
                for (let k = 0; k < $(div).length; k++) {
                    for (let prop in list[i]) {
                        if ($(div).eq(k).data('value') == prop) {
                            if ($(div).eq(k).data('type') === 'inner') {
                                html += $(div).eq(k).empty().append(list[i][prop]).prop('outerHTML');
                            }
                            else {
                                html += $(div).eq(k).attr('data-' + prop, list[i][prop]).prop('outerHTML');
                            }
                        }
                    }
                }
            }
            html += '</li>';
        }
        html += '</ul>';
        $(position).empty().append(html);
        return 0;
    }
    drawFiltersValueList(list, self, template, position) {
        list = list["info"];
        let html = '';
        for (let i = 0; i < list.length; i++) {
            $(".filters-list ul").find("div[data-id='" + list[i]["param_id"] + "']").remove();
            if (list[i]["search_type_id"] != "6") {
                if (list[i]["list"].length !== 0) {
                    html += '<div data-alias="' + list[i]["data_alias"] + '" data-id="' + list[i]["id"] + '">';
                    html += template;
                    html += '</div>';
                }
            }
            else {
                if (list[i]["list"]["min"] != list[i]["list"]["max"]) {
                    html += '<div data-alias="' + list[i]["data_alias"] + '" data-id="' + list[i]["id"] + '">';
                    html += template;
                    html += '</div>';
                }
            }
        }
        $(position).append(html);
        let param_list = "";
        for (let i = 0; i < list.length; i++) {
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"] .text').append(list[i]["param_name"]);
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"] .template').append(list[i]["template"]);
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"]').attr('data-type', list[i]['search_type_id']);
            switch (list[i]["search_type_id"]) {
                case "4":
                    param_list = "";
                    param_list += "<option data-alias='any' data-id=''>Any</option>";
                    for (let j = 0; j < list[i]["list"].length; j++) {
                        if (list[i]["selected_value"] != 'undefined' && list[i]["selected_value"] == list[i]["list"][j]["param_value"]) {
                            param_list += "<option selected>" + list[i]["list"][j]["param_value"] + "</option>";
                        }
                        else {
                            param_list += "<option>" + list[i]["list"][j]["param_value"] + "</option>";
                        }
                    }
                    break;
                case "6":
                    let min;
                    let max;
                    let selected_min;
                    let selected_max;
                    let current_min;
                    let current_max;
                    let value_list;
                    for (let key in list[i]["list"]) {
                        min = parseInt(list[i]["list"]["value_list"][0]);
                        max = parseInt(list[i]["list"]["value_list"][list[i]["list"]["value_list"].length - 1]);
                        value_list = [list[i]["list"]["value_list"]];
                    }
                    if (sessionStorage.getItem(list[i]["data_alias"]) != null) {
                        selected_min = sessionStorage.getItem(list[i]["data_alias"]).slice(0, sessionStorage.getItem(list[i]["data_alias"]).indexOf(","));
                        selected_max = sessionStorage.getItem(list[i]["data_alias"]).slice(sessionStorage.getItem(list[i]["data_alias"]).indexOf(",") + 1);
                        sessionStorage.setItem(list[i]["data_alias"], [selected_min, selected_max]);
                    }
                    else {
                        selected_min = min;
                        selected_max = max;
                    }
                    $(function () {
                        $(".filters-block ul li[data-id='" + list[i]["id"] + "'] .slider-range").slider({
                            range: true,
                            min: min,
                            max: max,
                            animate: "slow",
                            values: [selected_min, selected_max],
                            slide: function (event, ui) {
                                $(".filters-block ul li[data-id='" + list[i]["id"] + "'] .amount").val(ui.values[0] + " - " + ui.values[1]);
                            }
                        });
                        $(".filters-block ul li[data-id='" + list[i]["id"] + "'] .amount").val($(".filters-block ul li[data-id='" + list[i]["id"] + "']  .slider-range").slider("values", 0) +
                            " - " + $(".filters-block ul li[data-id='" + list[i]["id"] + "']  .slider-range").slider("values", 1));
                    });
                    break;
            }
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"] .template select').empty().append(param_list);
        }
        return 0;
    }
    drawTree(list, parent_id, template) {
        let html = "";
        for (let i = 0; i < list.length; i++) {
            if (parseInt(list[i]['parent_id']) === parent_id) {
                let child = '';
                child += this.drawTree(list, parseInt(list[i]['id']), template);
                html += "<li data-id = '" + list[i]['id'] + "'><div class='tree_title'>";
                if (child !== "") {
                    html += "<div class='icon closed'></div>";
                }
                else {
                    html += "<div class='icon empty'></div>";
                }
                html += "";
                for (let j = 0; j < template.length; j++) {
                    let div = $(template[j]['item']);
                    div.find('[data-value]').each(function () {
                        switch ($(this).data('type')) {
                            case 'inner':
                                $(this).append(list[i][$(this).data('value')] + " (" + list[i]["total"] + ")");
                                $(this).attr('title', (list[i][$(this).data('value')]));
                                break;
                            case 'data':
                                $(this).data($(this).data('type'), list[i][$(this).data('value')]);
                                break;
                        }
                    });
                    html += div.prop('outerHTML');
                }
                html += '</div>';
                if (child !== "") {
                    html += "<ul>";
                    html += child;
                    html += "</ul>";
                }
                html += "</li>";
            }
        }
        return html;
    }
    drawTableHeader(table_data, settings, position, template = []) {
        let title = '<tr>';
        let search = '<tr>';
        for (let i = 0; i < table_data.length; i++) {
            title += '<th sort-order="0" data-id="' + table_data[i]["id"] + '" data-alias="' + table_data[i]["alias"] + '">' + table_data[i]['name'] + '<span class="sort-icon none"></span></th>';
            search += '<td data-type="' + table_data[i]["search_type_id"] + '"  data-id="' + table_data[i]["id"] + '" data-alias="' + table_data[i]['alias'] + '">' + table_data[i]['search_template'] + '</td>';
        }
        title += '</tr>';
        search += '</tr>';
        let header = title + search;
        $(position).empty().append(header);
        $(position).find('[data-alias] select').each(function () {
            for (let i = 0; i < table_data.length; i++) {
                if (typeof table_data[i]['value_list'] !== 'string') {
                    table_data[i]['value_list'].unshift({ "value": "", "name": "any" });
                    if ($(this).parent().data('alias') === table_data[i]['alias']) {
                        for (let j = 0; j < table_data[i]['value_list'].length; j++) {
                            $(this).append('<option value="' + table_data[i]['value_list'][j]['value'] + '">' + table_data[i]['value_list'][j]['name'] + '</option>');
                        }
                    }
                }
                else {
                    if ($(this).parent().data('alias') === table_data[i]['alias']) {
                        if (JSON.parse(table_data[i]['value_list']) != null) {
                            $(this).append('<option value="">Any</option>');
                            for (let j = 0; j < JSON.parse(table_data[i]['value_list']).length; j++) {
                                $(this).append('<option value="' + JSON.parse(table_data[i]['value_list'])[j]['value'] + '">' + JSON.parse(table_data[i]['value_list'])[j]['name'] + '</option>');
                            }
                        }
                    }
                }
            }
        });
        $(position).find('[data-alias] input[name=daterange]').each(function () {
            $(this).daterangepicker({
                autoUpdateInput: false,
                locale: {
                    format: 'YYYY-MM-DD'
                }
            });
            $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
            });
            $('input[name="daterange"]').on('cancel.daterangepicker', function (ev, picker) {
                $(this).val('');
            });
        });
        if ($(position).parent().parent().find("ul").is(".settings-menu")) {
            $(position).parent().parent().find(".settings-menu").remove();
        }
        let settings_block = '';
        settings_block += '<ul class="settings-menu">';
        for (let i = 0; i < table_data.length; i++) {
            if (table_data[i]['alias'] != "action" && table_data[i]['alias'] != "name") {
                settings_block += '<li data-id="' + table_data[i]['id'] + '" data-alias="' + table_data[i]['alias'] + '">' +
                    '<label class="container status-change"><div class="icon"></div>' + table_data[i]['name'] + '<input checked class="styled-checkbox" name="table_type" type="checkbox" data-id="1"><span class="checkmark"></span></label></li>';
            }
        }
        settings_block += '</ul>';
        $(position).parent().parent().append(settings_block);
        $("#main").find(".table-block").off().on("click", "button[data-name=table-settings]", function () {
            $(this).parent().find(".settings-menu").toggleClass("open");
        });
        $("#main").find(".table-block").on('change', '.settings-menu li input[type="checkbox"]', function () {
            if (!$(this).is(':checked')) {
                $(this).parents(".table-block").find('.table-resizable td[data-alias="' + $(this).parent().parent().data('alias') + '"]').hide();
                $(this).parents(".table-block").find('.table-resizable th[data-alias="' + $(this).parent().parent().data('alias') + '"]').hide();
                $(this).parents(".table-block").find('.table-resizable th[data-alias="' + $(this).parent().parent().data('alias') + '"]').attr('data-visible', 0);
                $(this).parents(".table-block").find('.table-resizable tbody tr').each(function () {
                    $(this).find("td[data-id='" + $(this).parent().parent().data('id') + "']").hide();
                });
            }
            else {
                $(this).parents(".table-block").find('.table-resizable td[data-alias="' + $(this).parent().parent().data('alias') + '"]').show();
                $(this).parents(".table-block").find('.table-resizable th[data-alias="' + $(this).parent().parent().data('alias') + '"]').show();
                $(this).parents(".table-block").find('.table-resizable th[data-alias="' + $(this).parent().parent().data('alias') + '"]').attr('data-visible', 1);
                $(this).parents(".table-block").find('.table-resizable td[data-alias="' + $(this).parent().parent().data('alias') + '"]').attr('data-visible', 1);
                $(this).parents(".table-block").find('.table-resizable tbody tr').each(function () {
                    $(this).find("td[data-alias='" + $(this).parent().parent().data('alias') + "']").show();
                });
            }
        });
        $(position).parents("table").addClass("table-resizable");
        if (settings !== null || settings != []) {
            for (let i = 0; i < settings.length; i++) {
                if (settings[i]["alias"] != "name") {
                    $(".table-resizable td[data-alias='" + settings[i]["alias"] + "']").css("width", settings[i]["width"]);
                    $(".table-resizable thead th[data-alias='" + settings[i]["alias"] + "']").css("width", settings[i]["width"]);
                }
                if (settings[i]["is_visible"]) {
                    $(".table-resizable th[data-alias='" + settings[i]["alias"] + "']").attr('data-visible', settings[i]["is_visible"]);
                }
                else {
                    $(".table-resizable th[data-alias='" + settings[i]["alias"] + "']").attr('data-visible', 1);
                }
                if ($(".table-resizable td[data-alias='" + settings[i]["alias"] + "']").data('visible') === 0) {
                    $(".table-resizable td[data-alias='" + settings[i]["alias"] + "']").hide();
                }
            }
        }
        return 0;
    }
    drawTableBody(table_data, position, template = []) {
        let row = "";
        for (let i = 0; i < table_data.length; i++) {
            row += '<tr>';
            for (let j in table_data[i]) {
                row += '<td data-alias="' + table_data[i][j]["alias"] + '">' + table_data[i][j]["value"] + '</td>';
            }
            row += '</tr>';
        }
        $(position).empty().append(row);
        return 0;
    }
    drawView(params, template, group_template, position) {
        $(position).empty().append(template);
        for (let i = 0; i < group_template.length; i++) {
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"]').append('<label>' + group_template[i]["group_name"] + '</label>');
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"]').append(group_template[i]["group_template"]);
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"]').attr('data-id', group_template[i]["group_id"]);
        }
        for (let i = 0; i < params.length; i++) {
            if (params[i]["param_alias"] === "image" || params[i]["param_alias"] === "person-image") {
                if (params[i]["param_value"] !== " " && params[i]["param_value"] !== "") {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<img src="../upload/' + params[i]["param_value"] + '" >');
                }
            }
            else {
                $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<label>' + params[i]["param_name"] + '</label>');
                if (params[i]["param_value"] !== " " && params[i]["param_value"] !== "0") {
                    if (params[i]["param_alias"] === "dates-value" || params[i]["param_alias"] === "person-dates-value") {
                        let date = params[i]["param_value"].split(" ")[0];
                        $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<p data-name="">' + date + '</p>');
                    }
                    else {
                        if (params[i]["param_value"] !== '0') {
                            if (parseInt(params[i]["is_primary"]) === 1) {
                                $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<p data-name="" data-primry="' + params[i]["is_primary"] + '" class="primary-icon">' + params[i]["param_value"] + '</p>');
                            }
                            else {
                                $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<p data-name="" data-primry="' + params[i]["is_primary"] + '" >' + params[i]["param_value"] + '</p>');
                            }
                        }
                    }
                }
                else {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<hr/>');
                }
            }
        }
        return 0;
    }
    drawEdit(params, params_list, template, group_template, position) {
        $(position).empty().append(template);
        for (let i = 0; i < group_template.length; i++) {
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"]').append('<label>' + group_template[i]["group_name"] + '</label>');
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"]').append(group_template[i]["group_template"]);
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"]').attr('data-group', group_template[i]["group_id"]);
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"] > div').append('<div class="primary"></div>');
            $(position).find('div[data-alias="' + group_template[i]["group_alias"] + '"] > div:last-child').append('<div class="duplicate"><i class="fas fa-plus-circle"></i></div>');
        }
        for (let i = 0; i < params.length; i++) {
            if (params[i]["param_alias"] === "image" || params[i]["param_alias"] === "person-image") {
                $(position).find('form').append('<div style="display:none" data-id="' + params[i]["param_id"] + '" data-type="' + params[i]["value_type"] + '" data-primary="0"><input type="hidden" data-id="' + params[i]["value_id"] + '"></div>');
                if (params[i]["param_value"] !== " " && params[i]["param_value"] !== "") {
                    $(position).find('form').find('input[type="hidden"]').val(params[i]["param_value"]);
                    $(position).find('form').append('<div class="profile-image"></div>');
                    $(position).find('.profile-image').empty().append('<img src="../upload/' + params[i]["param_value"] + '"><i class="fas fa-pen"></i><i class="fas fa-times"></i>');
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append(params[i]["param_template"]);
                    $(position).find('form div[data-alias="image"]').hide();
                }
                else {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append(params[i]["param_template"]);
                }
            }
            else {
                if (params[i]["param_group"] > 0) {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div><label>' + params[i]["param_name"] + '</label></div>');
                }
                else {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<label>' + params[i]["param_name"] + '</label>');
                }
                if (params[i]["value_id"] !== null) {
                    if (parseInt(params[i]["is_primary"]) !== 0) {
                        if (params[i]["param_alias"] == 'address-country' || params[i]["param_alias"] == 'person-address-country' || params[i]["param_alias"] == 'address-city' || params[i]["param_alias"] == 'person-address-city') {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="1" data-type="' + params[i]["value_type"] + '" data-value="' + params[i]["param_value"] + '" >'
                                + params[i]["param_template"] + '</div> ');
                        }
                        else {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="1" data-type="' + params[i]["value_type"] + '"  data-value="' + params[i]["param_value"] + '">'
                                + params[i]["param_template"] + '</div> ');
                        }
                    }
                    else {
                        if (params[i]["param_alias"] == 'address-country' || params[i]["param_alias"] == 'person-address-country' || params[i]["param_alias"] == 'address-city' || params[i]["param_alias"] == 'person-address-city') {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="0" data-type="' + params[i]["value_type"] + '"  data-value="' + params[i]["param_value"] + '">'
                                + params[i]["param_template"] + '</div> ');
                        }
                        else {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="0" data-type="' + params[i]["value_type"] + '" data-value="' + params[i]["param_value"] + '">'
                                + params[i]["param_template"] + '</div> ');
                        }
                    }
                }
                else {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="" data-primary="0" data-type="' + params[i]["value_type"] + '" >'
                        + params[i]["param_template"] + '</div> ');
                }
            }
            if (params[i]["value_id"] !== null) {
                if (params[i]["param_value"] === "0") {
                    $(position).find('div[data-id="' + params[i]["value_id"] + '"] input').val('');
                }
                else {
                    if (params[i]["param_alias"] === "dates-value" || params[i]["param_alias"] === "person-dates-value") {
                        let date = params[i]["param_value"].split(" ")[0];
                        $(position).find('div[data-id="' + params[i]["value_id"] + '"] input').val(date);
                    }
                    else {
                        $(position).find('div[data-id="' + params[i]["value_id"] + '"] input').val(params[i]["param_value"]);
                    }
                }
                $(position).find('div[data-id="' + params[i]["value_id"] + '"] textarea').val(params[i]["param_value"]);
                if (params[i]["param_group"] > 0) {
                    $(position).find('div[data-id="' + params[i]["value_id"] + '"] input').parent().parent().parent().find('>.primary').remove();
                    $(position).find('div[data-id="' + params[i]["value_id"] + '"] input').parent().parent().parent().find('>.duplicate').remove();
                    $(position).find('div[data-id="' + params[i]["value_id"] + '"]').parent().parent().find('div:last-child').find('div[data-id="' + params[i]["value_id"] + '"] input').parent().append('<div class="edited-primary"></div>');
                    $(position).find('div[data-id="' + params[i]["value_id"] + '"]').parent().parent().find('div:last-child').find('div[data-id="' + params[i]["value_id"] + '"] input').parent().append('<div class="edited-remove"><i class="fas fa-times-circle"></i></div>');
                }
            }
            else {
                if (params[i]["param_value"] !== " ") {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"] input:not([type="file"])').val(params[i]["param_value"]);
                }
            }
        }
        for (let i = 0; i < params.length; i++) {
            let select = '';
            if (params[i]["value_list"]) {
                let value_list = params[i]["value_list"];
                for (let j = 0; j < value_list.length; j++) {
                    if (parseInt(value_list[j]["is_default"]) === 1) {
                        select += '<option value="' + value_list[j]["value_id"] + '" data-id="' + value_list[j]["value_id"] + '" data-default="' + value_list[j]["is_default"] + '" selected>' + value_list[j]["value_name"] + '</option>';
                    }
                    else {
                        select += '<option value="' + value_list[j]["value_id"] + '" data-id="' + value_list[j]["value_id"] + '" data-default="' + value_list[j]["is_default"] + '">' + value_list[j]["value_name"] + '</option>';
                    }
                }
                $(position).find('div[data-alias="' + params[i]["param_alias"] + '"] select').empty().append(select);
                if (params[i]["param_value"] !== ' ') {
                    $(position).find('div[data-id="' + params[i]["value_id"] + '"] select option[data-id="' + params[i]["param_value"] + '"]').prop('selected', true);
                }
            }
        }
        return 0;
    }
    drawContextMenu(list, positionX, positionY, callBack, target, index) {
        if ($("ul").is(".context-menu")) {
            $(".context-menu").remove();
            return false;
        }
        let menu_items = "";
        let menu = $("<ul class='context-menu'></ul>");
        for (let i = 0; i < list["context_menu"].length; i++) {
            if (list["context_menu"][i]["access_mask"] != null) {
                if (parseInt(list["clicked_item_access"]) & parseInt(list["context_menu"][i]["access_mask"])) {
                    if (list["context_menu"][i]["sub"] != 'null') {
                        menu_items += "<li class='has_sub' data-alias='" + list["context_menu"][i]["data_alias"] + "'><div class='icon'></div><div>" + list["context_menu"][i]["name"] + "<span class='arrow-right'></span></div>";
                        let sub = JSON.parse(list["context_menu"][i]["sub"]);
                        menu_items += "<ul class='sub-list'>";
                        for (let j = 0; j < sub.length; j++) {
                            menu_items += "<li data-alias='" + sub[j]["data_alias"] + "' data-id='" + sub[j]["data_id"] + "'>" +
                                "<label class='container status-change'><div class='icon'></div>" + sub[j]["name"] +
                                "<input class='styled-checkbox' name='contact_type' type='radio' data-id='" + sub[j]["data_id"] + "'><span class='checkmark'></span></label></li>";
                        }
                        menu_items += "</ul>";
                        menu_items += "</li>";
                    }
                    else {
                        menu_items += "<li class='has_sub' data-alias='" + list["context_menu"][i]["data_alias"] + "'><div class='icon'></div><div>" + list["context_menu"][i]["name"] + "</div>";
                    }
                }
                else {
                    menu_items += "<li class='disabled' data-alias='" + list["context_menu"][i]["data_alias"] + "'><div class='icon'></div><div>" + list["context_menu"][i]["name"] + "</div>";
                }
            }
            else {
                menu_items += "<li data-alias='" + list["context_menu"][i]["data_alias"] + "'><div class='icon'></div><div>" + list["context_menu"][i]["name"] + "</div>";
            }
        }
        menu.append(menu_items);
        $("body").append(menu);
        $(".context-menu > li").on('click', function () {
            if ($(this).hasClass("has_sub")) {
                $(this).find(".sub-list").show();
            }
            else {
                $(".sub-list").fadeOut();
            }
        });
        if (positionX + menu.width() > $(document).width() - 5) {
            positionX = $(document).width() - menu.width() - 5;
        }
        if (positionY + menu.height() > $(document).height() - 5) {
            positionY = $(document).height() - menu.height() - 5;
        }
        if ($(window).scrollTop() > 0) {
            positionY = positionY + $(window).scrollTop();
        }
        menu.offset({ top: positionY, left: positionX });
        return true;
    }
    drawCarousel(list, block_title, position) {
        let html = "";
        html += '<p class="block-title"><span class="text">' + block_title + '</span><span class="line short"></span><span class="line"></span></p>';
        html += '<div class="carousel_loading"></div>';
        html += "<div class='owl-carousel'>";
        for (let i = 0; i < list.length; i++) {
            html += "<div class='item-books' data-id='" + list[i]["book_id"] + "'>";
            if (list[i]["image"] == 'NULL' || list[i]["image"] === null || list[i]["image"] === undefined) {
                html += "<div class='image'><img src='images/book_empty.png' alt=''></div>";
            }
            else {
                html += "<div class='image'><img src='images/upload/" + list[i]["image"] + "' alt=''></div>";
            }
            if (list[i]["author"] != null) {
                html += "<span class='author' title='" + list[i]["author"] + "'>" + list[i]["author"] + "</span><span class='name' title='" + list[i]["name"] + "'>" + list[i]["name"] + "</span>";
            }
            else {
                html += "<span class='name' title='" + list[i]["name"] + "'>" + list[i]["name"] + "</span>";
            }
            if (list[i]["volume"] != null) {
                html += "<span class='name' title='" + list[i]["volume"] + " " + list[i]["period"] + "'>" + list[i]["volume"] + " " + list[i]["period"] + "</span>";
            }
            html += "</div>";
        }
        html += "</div>";
        $(position).css("overflow", "hidden");
        $(position).empty().append(html);
        $('.owl-carousel').owlCarousel({
            loop: true,
            items: 6,
            dots: false,
            margin: 100,
            responsiveClass: false,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 4,
                    nav: false
                },
                1400: {
                    items: 5,
                    nav: true,
                    loop: false
                }
            }
        });
        setTimeout(function () {
            $(position).find(".carousel_loading").fadeOut();
        }, 500);
        return 0;
    }
    drawUserBooksCarousel(list, block_title, position) {
        console.log(list);
        let html = "";
        html += '<p class="block-title"><span class="text">' + block_title + '</span><span class="line short"></span><span class="line"></span></p>';
        html += "<div class='owl-carousel'>";
        for (let i = 0; i < list.length; i++) {
            html += "<div class='item-books' data-id='" + list[i]["book_id"] + "'>";
            if (list[i]["image"] == 'NULL' || list[i]["image"] === null || list[i]["image"] === undefined) {
                html += "<div class='image'><img src='images/book_empty.png' alt=''></div>";
            }
            else {
                html += "<div class='image'><img src='images/upload/" + list[i]["image"] + "' alt=''></div>";
            }
            if (list[i]["author"] != null) {
                html += "<span class='author'>" + list[i]["author"] + "</span><span class='name' title='" + list[i]["name"] + "'>" + list[i]["name"] + "</span>";
            }
            else {
                console.log("period " + list[i]["period"]);
                console.log("volume " + list[i]["volume"]);
                if (list[i]["volume"] === null || list[i]["volume"] == 'null' || list[i]["volume"] == 'undefined' || list[i]["volume"] === undefined) {
                    list[i]["volume"] = "";
                }
                if (list[i]["period"] === null || list[i]["period"] == 'null' || list[i]["period"] == 'undefined' || list[i]["period"] === undefined) {
                    list[i]["period"] = "";
                }
                if (list[i]["volume"] !== null && list[i]["volume"] != 'null' && list[i]["volume"] != 'undefined' && list[i]["volume"] !== undefined && list[i]["period"] !== null && list[i]["period"] != 'null' && list[i]["period"] != 'undefined' && list[i]["period"] !== undefined) {
                    html += "<span class='name' title='" + list[i]["name"] + list[i]["volume"] + list[i]["period"] + "'>" + list[i]["name"] + "<br/>" + list[i]["volume"] + " " + list[i]["period"] + "</span>";
                }
                else {
                    html += "<span class='name' title='" + list[i]["name"] + "'>" + list[i]["name"] + "</span>";
                }
            }
            html += "</div>";
        }
        html += "</div>";
        $(position).css("overflow", "hidden");
        $(position).empty().append(html);
        $('.owl-carousel').owlCarousel({
            loop: true,
            items: 3,
            dots: false,
            margin: 100,
            responsiveClass: false,
            responsive: {
                0: {
                    items: 3,
                    nav: false
                },
                600: {
                    items: 3,
                    nav: false
                },
                1200: {
                    items: 3,
                    nav: false,
                    loop: false
                }
            }
        });
        return 0;
    }
}
class Z_Loader {
    constructor() {
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
    phpSend(successCallback, filename, command, params = {}, ...forward_params) {
        let url = this.PHP_PATH + "/" + filename + "." + this.PHP_EXTENSION;
        let self = this;
        this.php_request.ontimeout = function (err) {
            self.errorCallback(2, 'Server timeout' + err.toString(), 'ERROR');
        };
        this.php_request.onerror = function (err) {
            self.errorCallback(1, 'PHP request error:' + err.toString(), 'ERROR');
        };
        this.php_request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                const data = JSON.parse(this.response);
                console.log("Success answer!");
                console.log(data);
                if (parseInt(data['error_code']) === 0) {
                    successCallback && successCallback(data, ...forward_params);
                }
                else {
                    if (data['error_code'] === 3) {
                        self.errorCallback(3, '' + data['error_text'], 'ERROR');
                    }
                    self.errorCallback(parseInt(data['error_code']), '' + data['error_text'], 'ERROR');
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
        let data = {
            "user_id": sessionStorage.getItem("user_id"),
            "token": sessionStorage.getItem("token"),
            "lang_id": sessionStorage.getItem("lang_id"),
            "host_id": sessionStorage.getItem("host_id"),
            "command": command,
            "params": params
        };
        console.log(data);
        let data_string = JSON.stringify(data);
        this.php_request.open('POST', url);
        this.php_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        this.php_request.send(data_string);
        return 0;
    }
    loadTemplate(successCallback, filename, ...forward_params) {
        let url = this.TEMPLATE_PATH + "/" + filename + "." + this.TEMPLATE_EXTENSION;
        let self = this;
        this.php_request.ontimeout = function (err) {
            self.errorCallback(2, 'Server timeout:' + err.toString(), 'ERROR');
        };
        this.php_request.onerror = function (err) {
            self.errorCallback(1, 'PHP request error:' + err.toString(), 'ERROR');
        };
        this.php_request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                successCallback && successCallback(this.response, ...forward_params);
            }
            else {
                self.errorCallback(0, 'PHP data error:' + this.status, 'ERROR');
            }
        };
        this.php_request.open("GET", url, true);
        this.php_request.send();
        return 0;
    }
    errorCallback(error_code, error_text, error_type) {
        let error = error_text;
        this.message.drawMessage(error, error_type, error_code);
        setTimeout(function () {
            if (error_code == 3) {
                let login = new Z_Login();
                login.logOut();
            }
        }, 1000);
    }
    checkData(data) {
        if (parseInt(data["error"]) === 4 || parseInt(data["error"]) === 5) {
            sessionStorage.clear();
            location.href = './login.html';
            return false;
        }
        else if (data["error"] !== 0) {
            return false;
        }
        return true;
    }
}
class Z_Login {
    constructor() {
        this.MAIN_PAGE = "admin.html";
        this.LOGIN_PAGE = "login.html";
        this.DEFAULT_HOST = 1;
        this.DEFAULT_LANGUAGE = 1;
        this.DEFAULT_LANGUAGE_ID = '1';
        this.DEFAULT_PAGE = "home";
        this.LANGUAGES = ["no", 1, "ru", "am"];
        this.call_fn = new Z_Loader();
    }
    login(login, password) {
        let send_data = { "username": login, "password": password, "host_id": this.DEFAULT_HOST };
        this.call_fn.phpSend(this.goMain, 'lanar', 'admin_login', send_data, this);
    }
    testLogin(login, password) {
        let send_data = { "username": login, "password": password, "host_id": this.DEFAULT_HOST };
        this.call_fn.phpSend(this.testLoginCallback, 'ldap', 'check', send_data, this);
    }
    testLoginCallback(data) {
        console.log(data);
        if (data["info"] == "TRUE") {
            let message = new Z_Message();
            message.drawMessage("Login successful", 'SUCCESS');
        }
        return 0;
    }
    logOut() {
        this.call_fn.phpSend(this.goLogin, 'login', 'logout', this);
    }
    goLogin(self) {
        sessionStorage.clear();
        location.href = './login.html';
    }
    isLogged(data) {
        console.log(data);
        if (data) {
            this.goMain({
                'user_id': parseInt(sessionStorage.getItem("user_id")),
                'token': sessionStorage.getItem("token"),
                'host_id': parseInt(sessionStorage.getItem("host_id"))
            }, this);
        }
    }
    getCheckUser() {
        console.log('checkkk');
        this.call_fn.phpSend(this.checkUser, 'login', 'check_user', this);
        return 0;
    }
    checkUser(data, self) {
        console.log(data);
        if (data['info'] === 'logout') {
            self.logOut();
        }
        return 0;
    }
    goMain(data, self) {
        console.log(data);
        if (data["info"] === true) {
            sessionStorage.setItem("user_id", "1");
            location.href = self.MAIN_PAGE;
        }
        else {
            let message = new Z_Message();
            message.drawMessage("Your username or password is incorrect.", 'ERROR', 0);
        }
    }
}
class Z_Message {
    drawConfirm(message_text, callBack) {
        return 0;
    }
    drawPrompt(message_text, callBack) {
        return 0;
    }
    drawMessage(message_text, message_type = 'ERROR', message_code = 0) {
        let msg;
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
        $(".blur-box").on("click", function () {
            box.fadeOut('fast');
        });
        box.fadeIn('fast', function () {
            if (box.find('.buttons').length === 0) {
                let timerId = setTimeout(function () {
                    box.fadeOut('normal', function () {
                        box.remove();
                    });
                }, 2000);
            }
        });
        return 0;
    }
}
class Z_User {
    constructor() {
        this.message = new Z_Message();
        this.call_fn = new Z_Loader();
        this.notifications = new Z_Notifications();
        this.PHP_URL = "../engine/";
    }
    getUser() {
        this.call_fn.phpSend(this.drawUser, 'cb', 'get_user_info', {}, this);
        let loader_1 = new Z_Loader();
        loader_1.phpSend(this.setUserAccess, 'cb', 'access_list', { "user_id": parseInt(sessionStorage.getItem("user_id")) }, this);
        return 0;
    }
    setUserAccess(access_list, self) {
        let access = access_list["info"];
        for (let i = 0; i < access.length; i++) {
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
    }
    drawUser(user_info, self) {
        let html = '';
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
    }
    drawUserSettings(access, user_info, user_type, self) {
        access = access["info"];
        let add_book_access = false;
        let edit_book_access = false;
        let remove_book_access = false;
        let add_user_access = false;
        for (let i = 0; i < access.length; i++) {
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
        let html = "";
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
    drawUserProfileTemp(html, self) {
        $("section").empty().append(html);
        let loader = new Z_Loader();
        loader.phpSend(self.drawUserProfile, 'cb', 'get_user_info', {}, self);
        return 0;
    }
    drawUserProfile(user_info, self) {
        user_info = user_info["info"][0];
        if (user_info["image"] != null) {
            $(".user-info-block .image_1").attr("src", '../images/upload/' + user_info["image"]);
        }
        else {
            $(".user-info-block .image_1").attr("src", '../images/no_image_user.png');
        }
        $("span[data-alias='el_card_number']").text(user_info["el_card_number"]);
        for (let i in user_info) {
            $("input[name='" + i + "']").val(user_info[i]);
        }
        $(".change_photo").off().on("click", function () {
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
            let data = {
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
    }
    reDrawUserProfile(data, self) {
        if (data) {
            alert("Անձնական տվյալները թարմացված են:");
            self.call_fn.phpSend(self.drawUser, 'cb', 'get_user_info', {}, self);
        }
        return 0;
    }
}
//# sourceMappingURL=core.js.map