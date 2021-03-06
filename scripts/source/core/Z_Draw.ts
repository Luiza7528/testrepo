class Z_Draw {
    /**
     * Draw list by template on position
     * @param {object[]} list
     * @example [{name:string, type:string, id:number}]
     * @example [{name:"Header" type:'header', id:1}]
     * @param {string} template
     * [header:{'
     *  <li>
     *     <div data-value="id"     data-type="data",   data-id=""></div>
     *     <div data-value="alias"  data-type="data"    data-alias=""></div>
     *     <div data-value="name"   data-type="inner"></div>
     * </li>'}]
     * @param {object} position
     * @example $("div")
     * @return {number} if draw ok - 0 or error code
     */
    drawList(list: object[], template: object[], position: string): number {
        let html = '';
        html += '<ul>';
        for (let i = 0; i < list.length; i++) {
            if (list[i]["access"] != undefined) {
                html += '<li data-access="' + list[i]["access"].toLowerCase() + '" data-id="' + list[i]["id"] + '">';
            } else {
                html += '<li data-id="' + list[i]["id"] + '">';
            }

            for (let j = 0; j < template.length; j++) {
                let div = template[j]['header'];
                for (let k = 0; k < $(div).length; k++) {
                    for (let prop in list[i]) {
                        if ($(div).eq(k).data('value') == prop) {
                            if ($(div).eq(k).data('type') === 'inner') {
                                html += $(div).eq(k).empty().append(list[i][prop]).prop('outerHTML');
                            } else {
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


    drawFiltersValueList(list: object[], self, template: string, position: object): number {
        list = list["info"];
        let html = '';
        // html += '<ul>';
        for (let i = 0; i < list.length; i++) {
            $(".filters-list ul").find("div[data-id='" + list[i]["param_id"] + "']").remove();
            if (list[i]["search_type_id"] != "6") {
                if (list[i]["list"].length !== 0) {
                    html += '<div data-alias="' + list[i]["data_alias"] + '" data-id="' + list[i]["id"] + '">';
                    html += template;
                    html += '</div>';
                }
            } else {
                if (list[i]["list"]["min"] != list[i]["list"]["max"]) {
                    html += '<div data-alias="' + list[i]["data_alias"] + '" data-id="' + list[i]["id"] + '">';
                    html += template;
                    html += '</div>';
                }
            }
        }
        // html += '</ul>';
        //$(position).empty().append(html);
        $(position).append(html);
        let param_list = "";
        for (let i = 0; i < list.length; i++) {
            //add dynamic template in items
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"] .text').append(list[i]["param_name"]);
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"] .template').append(list[i]["template"]);
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"]').attr('data-type', list[i]['search_type_id']);
            // list[i]["list"].unshift({"param_value": "Any"});
            switch (list[i]["search_type_id"]) {
                case "4":
                    param_list = "";
                    param_list += "<option data-alias='any' data-id=''>Any</option>";
                    for (let j = 0; j < list[i]["list"].length; j++) {
                        if (list[i]["selected_value"] != 'undefined' && list[i]["selected_value"] == list[i]["list"][j]["param_value"]) {
                            param_list += "<option selected>" + list[i]["list"][j]["param_value"] + "</option>"
                        } else {
                            param_list += "<option>" + list[i]["list"][j]["param_value"] + "</option>"
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
                        // selected_min = parseInt(list[i]["list"]["selected_min"]);
                        // selected_max = parseInt(list[i]["list"]["selected_max"]);
                        value_list = [list[i]["list"]["value_list"]
                    }
                    if (sessionStorage.getItem(list[i]["data_alias"]) != null) {
                        selected_min = sessionStorage.getItem(list[i]["data_alias"]).slice(0, sessionStorage.getItem(list[i]["data_alias"]).indexOf(","));
                        selected_max = sessionStorage.getItem(list[i]["data_alias"]).slice(sessionStorage.getItem(list[i]["data_alias"]).indexOf(",") + 1);
                        sessionStorage.setItem(list[i]["data_alias"], [selected_min, selected_max]);
                    } else {
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
                        // .slider("pips");
                        $(".filters-block ul li[data-id='" + list[i]["id"] + "'] .amount").val($(".filters-block ul li[data-id='" + list[i]["id"] + "']  .slider-range").slider("values", 0) +
                            " - " + $(".filters-block ul li[data-id='" + list[i]["id"] + "']  .slider-range").slider("values", 1));
                    });
                    break;
            }
            //add template values
            $(".filters-block ul").find('li[data-id="' + list[i]["id"] + '"] .template select').empty().append(param_list);
        }
        return 0;
    }



    /**
     * Draw tree by template on position
     * @param {object[]} list
     * @example [{id:number, parent_id:number, name:string, type:string}]
     * @param {number} parent_id
     * @param {object[type:string, template:string]} template
     * @example [{type:"company" template:"<div></div>"}, {type:"position" template:"<li></li>"}]
     * @param {object} position
     * @example $("div")
     * @return {number} if draw ok - 0 or error code
     */
    drawTree(list: object[], parent_id: number, template: object[]): string {
        let html = "";
        for (let i = 0; i < list.length; i++) {
            if (parseInt(list[i]['parent_id']) === parent_id) {
                let child = '';
                child += this.drawTree(list, parseInt(list[i]['id']), template);
                html += "<li data-id = '" + list[i]['id'] + "'><div class='tree_title'>";
                if (child !== "") {
                    html += "<div class='icon closed'></div>";
                } else {
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

    drawTableHeader(table_data: object[], settings: object[], position: string, template: object[] = []): number {
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
                    table_data[i]['value_list'].unshift({"value": "", "name": "any"});
                    if ($(this).parent().data('alias') === table_data[i]['alias']) {
                        for (let j = 0; j < table_data[i]['value_list'].length; j++) {
                            $(this).append('<option value="' + table_data[i]['value_list'][j]['value'] + '">' + table_data[i]['value_list'][j]['name'] + '</option>')
                        }
                    }
                } else {
                    if ($(this).parent().data('alias') === table_data[i]['alias']) {
                        if (JSON.parse(table_data[i]['value_list']) != null) {
                            $(this).append('<option value="">Any</option>');
                            for (let j = 0; j < JSON.parse(table_data[i]['value_list']).length; j++) {
                                $(this).append('<option value="' + JSON.parse(table_data[i]['value_list'])[j]['value'] + '">' + JSON.parse(table_data[i]['value_list'])[j]['name'] + '</option>')
                            }
                        }
                    }
                }

            }
        });
        $(position).find('[data-alias] input[name=daterange]').each(function () {
            //  $(function() {
            $(this).daterangepicker({
                autoUpdateInput: false,
                locale: {
                    //format: 'DD.MM.YY'
                    format: 'YYYY-MM-DD'
                }

            });


            $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
            });

            $('input[name="daterange"]').on('cancel.daterangepicker', function (ev, picker) {
                $(this).val('');
            });
            // });
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
                // $('.table-resizable th[data-alias="'+$(this).parent().parent().data('alias')+'"]').attr('data-visible', 0);
                $(this).parents(".table-block").find('.table-resizable th[data-alias="' + $(this).parent().parent().data('alias') + '"]').attr('data-visible', 0);

                $(this).parents(".table-block").find('.table-resizable tbody tr').each(function () {
                    $(this).find("td[data-id='" + $(this).parent().parent().data('id') + "']").hide();
                });
            } else {
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
                } else {
                    $(".table-resizable th[data-alias='" + settings[i]["alias"] + "']").attr('data-visible', 1);
                }
                if ($(".table-resizable td[data-alias='" + settings[i]["alias"] + "']").data('visible') === 0) {
                    $(".table-resizable td[data-alias='" + settings[i]["alias"] + "']").hide();
                }
            }
        }
        return 0;
    }

    drawTableBody(table_data: object[], position: string, template: object[] = []): number {
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

    /**
     * Draw view by template on position
     * @param {object[]} params
     * @example [{name:string, alias:string, value:string, template:string}]
     * @param {string} template
     * @param {object} group_template
     * @param {object} position
     * @example $("div")
     * @return {number} if draw ok - 0 or error code
     */
    drawView(params: object[], template: string, group_template: object[], position: object): number {
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
            } else {
                $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<label>' + params[i]["param_name"] + '</label>');
                if (params[i]["param_value"] !== " " && params[i]["param_value"] !== "0") {
                    if (params[i]["param_alias"] === "dates-value" || params[i]["param_alias"] === "person-dates-value") {
                        let date = params[i]["param_value"].split(" ")[0];
                        $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<p data-name="">' + date + '</p>');
                    } else {
                        if (params[i]["param_value"] !== '0') {
                            if (parseInt(params[i]["is_primary"]) === 1) {
                                $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<p data-name="" data-primry="' + params[i]["is_primary"] + '" class="primary-icon">' + params[i]["param_value"] + '</p>');
                            } else {
                                $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<p data-name="" data-primry="' + params[i]["is_primary"] + '" >' + params[i]["param_value"] + '</p>');
                            }
                        }
                    }
                } else {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<hr/>');
                }
            }
        }
        return 0;
    }

    /**
     * Draw edit by template on position
     * @param {object[]} params
     * @example [{name:string, alias:string, value:string, template:string, value_list:[id:number, name:string]}]
     * @param {object[]} params_list
     * @param {string} template
     * @param {object} group_template
     * @param {object} position
     * @example $("div")
     * @return {number} if draw ok - 0 or error code
     */
    drawEdit(params: object[], params_list: object[], template: string, group_template: object[], position: object): number {
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
                    // $('input[type="hidden"]').val(JSON.parse(result)['server_name'] + '.' + JSON.parse(result)['ext']);
                    $(position).find('.profile-image').empty().append('<img src="../upload/' + params[i]["param_value"] + '"><i class="fas fa-pen"></i><i class="fas fa-times"></i>');
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append(params[i]["param_template"]);
                    $(position).find('form div[data-alias="image"]').hide();
                } else {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append(params[i]["param_template"]);
                }
            } else {
                if (params[i]["param_group"] > 0) {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div><label>' + params[i]["param_name"] + '</label></div>');

                } else {
                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<label>' + params[i]["param_name"] + '</label>');
                }

                if (params[i]["value_id"] !== null) {
                    if (parseInt(params[i]["is_primary"]) !== 0) {
                        if (params[i]["param_alias"] == 'address-country' || params[i]["param_alias"] == 'person-address-country' || params[i]["param_alias"] == 'address-city' || params[i]["param_alias"] == 'person-address-city') {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="1" data-type="' + params[i]["value_type"] + '" data-value="' + params[i]["param_value"] + '" >'
                                + params[i]["param_template"] + '</div> ');
                        } else {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="1" data-type="' + params[i]["value_type"] + '"  data-value="' + params[i]["param_value"] + '">'
                                + params[i]["param_template"] + '</div> ');
                        }

                    } else {
                        if (params[i]["param_alias"] == 'address-country' || params[i]["param_alias"] == 'person-address-country' || params[i]["param_alias"] == 'address-city' || params[i]["param_alias"] == 'person-address-city') {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="0" data-type="' + params[i]["value_type"] + '"  data-value="' + params[i]["param_value"] + '">'
                                + params[i]["param_template"] + '</div> ');
                        } else {
                            $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="' + params[i]["value_id"] + '" data-primary="0" data-type="' + params[i]["value_type"] + '" data-value="' + params[i]["param_value"] + '">'
                                + params[i]["param_template"] + '</div> ');
                        }

                    }
                } else {

                    $(position).find('div[data-alias="' + params[i]["param_alias"] + '"]').append('<div data-param="' + params[i]["param_id"] + '" data-id="" data-primary="0" data-type="' + params[i]["value_type"] + '" >'
                        + params[i]["param_template"] + '</div> ');
                }

            }
            if (params[i]["value_id"] !== null) {
                if (params[i]["param_value"] === "0") {
                    $(position).find('div[data-id="' + params[i]["value_id"] + '"] input').val('');
                } else {
                    if (params[i]["param_alias"] === "dates-value" || params[i]["param_alias"] === "person-dates-value") {
                        let date = params[i]["param_value"].split(" ")[0];
                        $(position).find('div[data-id="' + params[i]["value_id"] + '"] input').val(date);

                    } else {
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
            } else {
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
                    } else {
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

    /**
     * Draw context menu on right click
     * @param {object[]} list
     * @example [{id:'', parent_id:'', 'name':'Add', 'alias':'add', 'access':7, has_child:false}]
     * @param {number} positionX
     * @param {number} positionY
     * @param {string} contextMenuClick - CallBack function
     * @param {object} target
     * @example $('body')
     * @return {number} if draw ok - 0 or error code
     */
    drawContextMenu(list: object, positionX: number, positionY: number, callBack, target: object, index: number): boolean {
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
                        // menu_items += "<li class='title'><div>" + WORDS["type"][lang_id] + "</div></li>";
                        for (let j = 0; j < sub.length; j++) {
                            menu_items += "<li data-alias='" + sub[j]["data_alias"] + "' data-id='" + sub[j]["data_id"] + "'>" +
                                "<label class='container status-change'><div class='icon'></div>" + sub[j]["name"] +
                                "<input class='styled-checkbox' name='contact_type' type='radio' data-id='" + sub[j]["data_id"] + "'><span class='checkmark'></span></label></li>";
                        }
                        menu_items += "</ul>";
                        menu_items += "</li>";
                    } else {
                        menu_items += "<li class='has_sub' data-alias='" + list["context_menu"][i]["data_alias"] + "'><div class='icon'></div><div>" + list["context_menu"][i]["name"] + "</div>";
                    }
                } else {
                    menu_items += "<li class='disabled' data-alias='" + list["context_menu"][i]["data_alias"] + "'><div class='icon'></div><div>" + list["context_menu"][i]["name"] + "</div>";
                }
            } else {
                menu_items += "<li data-alias='" + list["context_menu"][i]["data_alias"] + "'><div class='icon'></div><div>" + list["context_menu"][i]["name"] + "</div>";
            }
        }
        menu.append(menu_items);
        $("body").append(menu);
        $(".context-menu > li").on('click', function () {
                if ($(this).hasClass("has_sub")) {
                    $(this).find(".sub-list").show();
                } else {
                    $(".sub-list").fadeOut();
                }
            }
        );

        if (positionX + menu.width() > $(document).width() - 5) {
            positionX = $(document).width() - menu.width() - 5;
        }
        if (positionY + menu.height() > $(document).height() - 5) {
            positionY = $(document).height() - menu.height() - 5;
        }

        if($(window).scrollTop() > 0){
            positionY = positionY + $(window).scrollTop();
        }
        menu.offset({top: positionY, left: positionX});
        return true;
    }




    //CB
    drawCarousel(list: object[], block_title: string, position: string): number {
        let html = "";
            html += '<p class="block-title"><span class="text">' + block_title + '</span><span class="line short"></span><span class="line"></span></p>';
            html += '<div class="carousel_loading"></div>'
            html += "<div class='owl-carousel'>";
            for (let i = 0; i < list.length; i++) {
                html += "<div class='item-books' data-id='" + list[i]["book_id"] + "'>";

                if(list[i]["image"] == 'NULL' || list[i]["image"] === null || list[i]["image"] === undefined){
                    html += "<div class='image'><img src='images/book_empty.png' alt=''></div>";
                }else{
                    html += "<div class='image'><img src='images/upload/" + list[i]["image"] + "' alt=''></div>";
                }

                if (list[i]["author"] != null) {
                    html += "<span class='author' title='" + list[i]["author"] + "'>" + list[i]["author"] + "</span><span class='name' title='" + list[i]["name"] + "'>" + list[i]["name"] + "</span>";
                } else {
                        html += "<span class='name' title='" + list[i]["name"] + "'>" + list[i]["name"] + "</span>";
                }
                if (list[i]["volume"] != null) {
                    html += "<span class='name' title='" + list[i]["volume"] + " "+ list[i]["period"] + "'>" + list[i]["volume"] + " "+ list[i]["period"] +  "</span>";
                }


                html += "</div>";
            }
            html += "</div>";
            $(position).css("overflow", "hidden");



      //  $(position).find(".owl-carousel").remove();
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
        setTimeout(function(){
            //$(position).find(".owl-carousel").show();
            $(position).find(".carousel_loading").fadeOut();
        }, 500);
        return 0;
    }

    drawUserBooksCarousel(list: object[], block_title: string, position: string): number {
        console.log(list)
        let html = "";
        html += '<p class="block-title"><span class="text">' + block_title + '</span><span class="line short"></span><span class="line"></span></p>';
        html += "<div class='owl-carousel'>";
        for (let i = 0; i < list.length; i++) {
            html += "<div class='item-books' data-id='" + list[i]["book_id"] + "'>";

            if(list[i]["image"] == 'NULL' || list[i]["image"] === null || list[i]["image"] === undefined){
                html += "<div class='image'><img src='images/book_empty.png' alt=''></div>";
            }else{
                html += "<div class='image'><img src='images/upload/" + list[i]["image"] + "' alt=''></div>";
            }
          //  html += "<div class='image'><img src='images/upload/" + list[i]["image"] + "'></div>";
            if (list[i]["author"] != null) {
                html += "<span class='author'>" + list[i]["author"] + "</span><span class='name' title='" + list[i]["name"] + "'>" + list[i]["name"] + "</span>";
            } else {
                console.log("period " + list[i]["period"]);
                console.log("volume " + list[i]["volume"]);
                if(list[i]["volume"] === null || list[i]["volume"] == 'null' || list[i]["volume"] == 'undefined' || list[i]["volume"] === undefined){
                    list[i]["volume"] = ""
                }
                if(list[i]["period"] === null || list[i]["period"] == 'null' || list[i]["period"] == 'undefined' || list[i]["period"] === undefined){
                    list[i]["period"] = ""
                }
                if(list[i]["volume"] !== null && list[i]["volume"] != 'null' && list[i]["volume"] != 'undefined' && list[i]["volume"] !== undefined && list[i]["period"] !== null && list[i]["period"] != 'null' && list[i]["period"] != 'undefined' && list[i]["period"] !== undefined){
                //if(list[i]["volume"] !== null && list[i]["volume"] != 'null' && list[i]["volume"] != 'undefined' && list[i]["volume"] !== undefined){
                    html += "<span class='name' title='" + list[i]["name"] + list[i]["volume"] + list[i]["period"] + "'>" + list[i]["name"] + "<br/>" + list[i]["volume"] +" "+ list[i]["period"] + "</span>";
                }else{
                    html += "<span class='name' title='" + list[i]["name"] +"'>" + list[i]["name"] + "</span>";
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
