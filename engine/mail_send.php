<?php

include 'config/mail.php';
include 'PHPMailer/PHPMailerAutoload.php';

function sendMail($to,$subject,$message)
{
$mail = new PHPMailer(); // create a new object
$mail->IsSMTP(); // enable SMTP
$mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
$mail->SMTPAuth = true; // authentication enabled
$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
$mail->Host = "smtp.gmail.com";
$mail->Port = 465; // or 587
$mail->IsHTML(true);
$mail->Username = M_USERNAME;
$mail->Password = M_PASSWORD;
$mail->SetFrom($to);
$mail->Subject = $subject;
$mail->Body = $message;
$mail->AddAddress($to);

if(!$mail->Send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
} else {
    echo "Message has been sent";
}


}


