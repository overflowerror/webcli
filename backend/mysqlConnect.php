<?php
	$db = new mysqli("localhost", "webcli", "password", "webcli");
	if ($db->connect_error)
		die("Connect Error (" . $db->connect_errno . ") " . $db->connect_error);
?>
