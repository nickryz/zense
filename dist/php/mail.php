<?php

$recepient1 = "nickryz@purpleleads.com";
// $recepient2 = "Rita@purpleleads.coms";
$sitename = "Zense";

$name = trim($_POST["name"]);
$phone = trim($_POST["phone"]);
$email = trim($_POST["email"]);
$text = trim($_POST["text"]);
$message = "Name: $name \nPhone: $phone \nEmail: $email \nMessage: $text";

$pagetitle = "New message from \"$sitename\"";
mail($recepient1, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient1");
// mail($recepient2, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient2");