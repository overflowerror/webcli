<?php

	require_once("config.php");

	
	abstract class errorType {
		const fatal   = 0;
		const warning = 10;
		const server  = 500;
		const client  = 400;
	}

	class errorManager {
		static public function log($sender, $message, $type = errorType::warning, $display = false, $cancelExecution = false) {
			$fh = fopen(LOG_FILE, "a");
			$stype = "";
			switch($type) {
			case errorType::fatal:
				$stype = "fatal error";
				break;
			case errorType::warning:
				$stype = "warning";
				break;
			case errorType::server:
				$stype = "server error";
				break;
			case errorType::client:
				$stype = "client error";
				break;
			default:
				$stype = "unknown error (" . $type . ")";
				break;
			}
			fwrite($fh, time() . " - " . $stype . " : " . $sender . ": " . $message . " --- " . ($display ? "display" : "no display") . " . " . ($cancelExecution ? "cancel execution" : "continue execution") . "\n");
			fclose($fh);

			if ($display)
				echo "\n\n" . $stype . ": " . $sender . " says: " . $message . "\n\n";
			if ($cancelExecution)
				exit();
		}
	}
?>
