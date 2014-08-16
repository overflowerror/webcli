<?php
	require_once("mysqlConnect.php");

	class userManager {
		static public function getUserById ($ID) {
			global $db;
			return $db->query("SELECT * FROM `users` WHERE `ID`=" . $ID)->fetch_object();
		}
		static public function getGroupById($id) {
			global $db;
			return $db->query("SELECT * FROM `groups` WHERE `ID`=" . $id)->fetch_object();
		}
		static public function getGroupsByUserId($ID) {
			global $db;
			$tmp = $db->query("SELECT 
					`groups`.`ID` 	AS `ID`,
					`groups`.`name` AS `name`
				FROM `groupMemberships`
					INNER JOIN `groups` ON `groups`.`ID`=`groupMemberships`.`groupFK`
				WHERE `userFK`=" . $ID . "
				UNION SELECT
					`groups`.`ID`	AS `ID`,
					`groups`.`name`	AS `name`
				FROM `users`
					INNER JOIN `groups` ON `users`.`groupFK`=`groups`.`ID`
				WHERE `users`.`ID`=" . $ID);
			$result = array();			
			while ($res = $tmp->fetch_object())
				$result[] = $res;
			return $result;
		}
		static public function userIdHasGroupId ($uid, $gid) {
			$array = userManager::getGroupsByUserId($uid);
			for ($i = 0; $i < count($array); $i++) {
				if ($array[$i]->ID == $gid)
					return true;
			}
			return false;
		}
		static public function getIdByUsername ($username) {
			global $db;
			$result = $db->query("SELECT `ID` FROM `users` WHERE `name`='" . $db->real_escape_string($username) . "'");
			if (!$result->num_rows)
				throw new Exception("No entry for user " . $username);
			return $result->fetch_object()->ID;
		}
		static public function getRightsOnFile($uid, $file) {
			if ($uid == $file->userFK)
				return $file->rightsUser;
			if (userManager::userIdHasGroupId($uid, $file->groupFK))
				return $file->rightsGroup;
			return $file->rightsOther;
		}
	}
?>
