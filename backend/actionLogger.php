<?php
	require_once("mysqlConnect.php");
	require_once("errorManager.php");

	class actionLogger {
		static public function sessionInit($session) {
			global $db, $_SERVER;
			if ($db->query("INSERT INTO `logSessions` (`created`, `initialSessID`, `currentSessID`, `userAgent`) VALUES
				(" . $session['created'] . ", \"" . $session['initSessID'] . "\", \"" . $session['initSessID'] . "\", \"" . $db->real_escape_string($_SERVER['HTTP_USER_AGENT']) . "\")") !== true)
				errorManager::log("actionLogger", "unable to init db entry for current session", errorType::fatal, true, true);
			actionLogger::connectUpdate($session);
		}
		static public function sessionUpdate($session) {
			global $db, $_SERVER;
			$db->query("UPDATE `logSessions` SET `currentSessID`='" . session_id() . "' WHERE `ID`=" . actionLogger::getSessionFK($session));

			actionLogger::connectUpdate($session);
		}
		static public function connectUpdate($session) {
			global $db, $_SERVER;
			$tmp = actionLogger::getConnectFK($session);
			if ($tmp == -1) {
				$db->query("INSERT INTO `logConnect` (`sessionFK`, `IP`, `time`) VALUES (" . actionLogger::getSessionFK($session) . ", '" . $_SERVER['REMOTE_ADDR'] . "', " . time() . ")");
			}
		}
		static public function getSessionFK($session) {
			global $db;
			$result = $db->query("SELECT `ID` FROM `logSessions` WHERE `created`=" . $session['created'] . " AND `initialSessID`='" . $session["initSessID"] . "'");
			return $result->fetch_object()->ID;
		}
		static public function getConnectFK($session) {
			global $db, $_SERVER;
			$result = $db->query("SELECT `ID` FROM `logConnect` WHERE `sessionFK`=" . actionLogger::getSessionFK($session) . " AND `IP`='" . $_SERVER['REMOTE_ADDR'] . "'");
			if (!$result->num_rows)
				return -1;
			return $result->fetch_object()->ID;
		}
	}
?>
