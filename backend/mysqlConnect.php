<?php
	$connection = mysql_connect("localhost", "webcli", "password");
	mysql_select_db('webcli');
	echo mysql_error();
?>
