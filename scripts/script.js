$(function () {
    $('.send').on('click', function (e) {
        e.preventDefault();
        var data = {
            user_name: $('.lead_user_info input[name=name]').val(),
            user_phone: $('.lead_user_info input[name=phone]').val(),
            user_email: $('.lead_user_info input[name=email]').val(),
        };
        var loader = new Z_Loader();
        loader.phpSend(function (response) {
            if (response['info'] == true) {
                $('.popup').fadeIn();
            }
        }, 'Company', 'save_lead', data);
    });
    $('.re-send').on('click', function (e) {
        e.preventDefault();
        var company_data = [];
        $('.company_list label').each(function () {
            if ($(this).find('input').is(":checked")) {
                company_data.push({ 'company_id': $(this).data('id') });
            }
        });
        var loader = new Z_Loader();
        loader.phpSend(function (response) {
            if (response['info'] == true) {
                $('.popup').fadeIn();
            }
        }, 'Company', 'send_mail', { 'company': company_data });
    });
});
var Z_Home = (function () {
    function Z_Home() {
    }
    Z_Home.prototype.saveLead = function () {
    };
    return Z_Home;
}());
//# sourceMappingURL=script.js.map