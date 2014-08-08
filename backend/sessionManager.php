<?php
	@session_start();
	
	require_once("actionLogger.php");
	require_once("config.php");

	session_regenerate_id();

	if (!isset($_SESSION['active']) || !$_SESSION['active']) {
		$_SESSION['active'] = true;
		$_SESSION['created'] = time();
		$_SESSION['uid'] = DEFAULT_USER;
		$_SESSION['initSessID'] = session_id();
		actionLogger::sessionInit($_SESSION);
	} else {
		actionLogger::sessionUpdate($_SESSION);
	}
?>
