<?php


require_once  __DIR__."/config/db.php";
require_once  __DIR__."/core/db/Z_MySQL.php";
require_once __DIR__."/mail_send.php";

class Z_Company
{

    private $db;

    /**
     * Z_Categories constructor.
     */
    public function __construct()
    {
        $this->db = new Z_MySQL();
    }

    /**
     * @return array
     */
    public function getCompanies(){
         return $this->db->queryNoDML("SELECT * FROM `company`");
     }

    /**
     * @param string $user_name
     * @param string $user_phone
     * @param string $user_email
     * @return bool
     */
    public function SaveLead($user_name,$user_phone,$user_email){

         $this->db->queryDML("INSERT INTO `leads`(`lead_id`, `name`, `user_name`, `user_phone`, `user_email`, `brand`, `package_id`) 
                                     VALUES (NULL,'Test Name','{$user_name}','{$user_phone}','{$user_email}','Test brand','1')");

         return TRUE;
     }

    /**
     * @param array $company
     * @return bool
     */
    public function SendCompanyMessage($company){

        $company = json_decode(json_encode($company), true);
        foreach ($company AS $key=>$value){
            $company_id = $value['company_id'];
            $from = $this->db->queryNoDML("SELECT `Email` as email 
                                          FROM `company` WHERE `company_id` = '{$company_id}'");

            if($from){
                $subject = "Test Subject";
                $message = "Test Message";
                sendMail($from,$subject, $message);
            }


        }

         return true;
     }


}
