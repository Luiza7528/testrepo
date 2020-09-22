<?php

require_once __DIR__."/Z_Company.php";

//from JavaScript
$all_data = file_get_contents('php://input');
$income_data = json_decode($all_data);
$params = $income_data->params;
$command = $income_data->command;

$answer = ["user_id" => intval($income_data->user_id), "host_id" => intval($income_data->host_id), "token" => strval($income_data->token), "lang_id" => intval($income_data->lang_id), "info" => '', "error_code" => 0, "error_text" => '', "command" => strval($income_data->command),];

    switch ($command) {
        case "get_companies":
            $companies = new Z_Company();
            $answer['info'] = $companies->getCompanies();
            break;
        case "save_lead":
            $companies = new Z_Company();
            $answer['info'] = $companies->SaveLead($params->user_name,$params->user_phone,$params->user_email);
            break;
        case "send_mail":
            $companies = new Z_Company();
            $answer['info'] = $companies->SendCompanyMessage($params->company);
            echo $answer['info'] ;
            break;
    }


echo json_encode($answer);


