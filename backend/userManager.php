<?php
	require_once("mysqlConnect.php");

	class userManager {
		static public function getUserById ($ID) {
			global $db;
			return $db->query("SELECT * FROM `users` WHERE `ID`=" . $ID)->fetch_object();
		}
		static public function getIdByUsername ($username) {
			global $db;
			return $db->query("SELECT `ID` FROM `users` WHERE `name`='" . $db->real_escape_string($username) . "'")->fetch_object()->ID;
		}
	}
?>
