<?php
	require_once("mysqlConnect.php");

	class fileManager {
		static public function getIdByPath ($path) {
			global $db;
			$path = fileManager::cleanPath($path);
			if (strpos($path, "/") === 0)
				$path = substr($path, 1);
			$array = explode("/", $path);
			$parent = 0;
			for($i = 0; $i < count($array) - 1; $i++) {
				$result = $db->query("SELECT `files`.`ID` AS `ID` FROM `files` INNER JOIN `fileTypes` ON `files`.`fileTypeFK`=`fileTypes`.`ID` WHERE `files`.`parentFK`=" . $parent . " AND `fileTypes`.`name`='directory' AND `files`.`name`='" . $db->real_escape_string($array[$i]) . "'");
				if (!$result->num_rows)
					throw new Exception("no such file or directory");
				$parent = $result->fetch_object()->ID;
			}
			$result = $db->query("SELECT `ID` FROM `files` WHERE `parentFK`=" . $parent . " AND `name`='" . $db->real_escape_string($array[count($array) - 1]) . "'");
			if (!$result->num_rows)
				throw new Exception("no such file or directory");
			return $result->fetch_object()->ID;
		}
		static public function cleanPath($path) {

			while (strpos($path, "//") !== false) {
				$path = str_replace("//", "/", $path);
			}

			$array = explode("/", $path);
			for($i = 0; $i < count($array); $i++) {
				$value = $array[$i];
				if ($value == "")
					array_splice($array, $i--, 1);
				if ($value == ".")
					array_splice($array, $i--, 1);
				if ($value == "..") {
					if ($i == 0)
						throw new Exception("invalid path");
					array_splice($array, $i - 1, 2);
					$i = $i - 2;
				}
			}
			return implode("/", $array);
		}
		static public function getFileById($ID) {
			global $db;
			$result = $db->query("SELECT 
						`files`.`ID` 		AS `ID`, 
						`files`.`parentFK` 	AS `parentFK`, 
						`files`.`name`		AS `name`,
						`files`.`userFK`	AS `userFK`,
						`files`.`groupFK`	AS `groupFK`,
						`files`.`rightsUser`	AS `rightsUser`,
						`files`.`rightsGroup`	AS `rightsGroup`,
						`files`.`rightsOther`	AS `rightsOther`,
						`files`.`created`	AS `created`,
						`files`.`changed`	AS `changed`,
						`files`.`content`	AS `content`,
						`fileTypes`.`name`	AS `fileType` 
					FROM `files` 
						INNER JOIN `fileTypes` ON `files`.`fileTypeFK`=`fileTypes`.`ID` 
					WHERE `files`.`ID`=" . $ID);
			if (!$result->num_rows)
				throw new Exception("no such file or directory");
			return $result->fetch_object();
		}
		static public function getPathById($id) {
			global $db;
			$array = array();
			while ($id) {
				$result = $db->query("SELECT `name`, `parentFK` FROM `files` WHERE `ID`=" . $id);
				$result = $result->fetch_object();
				$array[] = $result->name;
				$id = $result->parentFK;
			}
			$array = array_reverse($array);
			return "/" . implode("/", $array);
		}
		static public function getFilesByParentId($ID) {
			global $db;
			$tmp = $db->query("SELECT 
						`files`.`ID` 		AS `ID`, 
						`files`.`parentFK` 	AS `parentFK`, 
						`files`.`name`		AS `name`,
						`files`.`userFK`	AS `userFK`,
						`files`.`groupFK`	AS `groupFK`,
						`files`.`rightsUser`	AS `rightsUser`,
						`files`.`rightsGroup`	AS `rightsGroup`,
						`files`.`rightsOther`	AS `rightsOther`,
						`files`.`created`	AS `created`,
						`files`.`changed`	AS `changed`,
						`files`.`content`	AS `content`,
						`fileTypes`.`name`	AS `fileType` 
					FROM `files` 
						INNER JOIN `fileTypes` ON `files`.`fileTypeFK`=`fileTypes`.`ID` 
					WHERE `files`.`ID`!=0 
						AND `files`.`parentFK`=" . $ID);
			if (!$tmp->num_rows)
				return array();
			$result = array();
			while ($res = $tmp->fetch_object())
				$result[] = $res;
			return $result;
		}
		static public function getPermissionStringByFile($file) {
			$result = "";
			switch($file->fileType) {
			case "file":
				$result .= "-";
				break;
			case "directory":
				$result .= "d";
				break;
			case "commentBlock":
				$result .= "c";
				break;
			default:
				$result .= "?";
				break;
			}
			if ($file->rightsUser & 1 << 2)
				$result .= "r";
			else
				$result .= "-";
			if ($file->rightsUser & 1 << 1)
				$result .= "w";
			else
				$result .= "-";
			if ($file->rightsUser & 1 << 0)
				$result .= "x";
			else
				$result .= "-";
			if ($file->rightsGroup & 1 << 2)
				$result .= "r";
			else
				$result .= "-";
			if ($file->rightsGroup & 1 << 1)
				$result .= "w";
			else
				$result .= "-";
			if ($file->rightsGroup & 1 << 0)
				$result .= "x";
			else
				$result .= "-";
			if ($file->rightsOther & 1 << 2)
				$result .= "r";
			else
				$result .= "-";
			if ($file->rightsOther & 1 << 1)
				$result .= "w";
			else
				$result .= "-";
			if ($file->rightsOther & 1 << 0)
				$result .= "x";
			else
				$result .= "-";
			return $result;
		}
	}
?>
