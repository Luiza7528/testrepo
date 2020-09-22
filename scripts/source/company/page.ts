$(function () {

 /* let home = new Z_Home();
  home.getCategories(home.drawCategoriesTree, 'GET', 1, 0, home);
  let home1 = new Z_Home();
  home1.loader.sendPHP(home1.drawCategoriesDropdown, 'GET', {'lang': 1, 'category': 0}, home1);*/


  $('.send').on('click', function (e) {
    e.preventDefault();
    let data = {
        user_name: $('.lead_user_info input[name=name]').val(),
        user_phone: $('.lead_user_info input[name=phone]').val(),
        user_email: $('.lead_user_info input[name=email]').val(),
    };

      let loader = new Z_Loader();
      loader.phpSend(function(response){
           if(response['info'] == true){
              $('.popup').fadeIn();
          }
      }, 'Company', 'save_lead', data);
  });


    $('.re-send').on('click', function (e) {
        e.preventDefault();
        let company_data = [];
        $('.company_list label').each(function(){
            if($(this).find('input').is(":checked")){
                company_data.push({'company_id': $(this).data('id')})
            }
        });
        let loader = new Z_Loader();
        loader.phpSend(function(response){
            if(response['info'] == true){
                $('.popup').fadeIn();
            }
        }, 'Company', 'send_mail', {'company': company_data});



    });


});

