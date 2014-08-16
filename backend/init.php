<?php
	require_once("actionLogger.php");
	require_once("sessionManager.php");
	require_once("userManager.php");
	require_once("fileManager.php");

	$result = array();
	$result['uid'] = $_SESSION['uid'];
	$user = userManager::getUserById($_SESSION['uid']);
	$result['username'] = $user->name;
	$result['home'] = fileManager::getPathById($user->homeFK);
	$result['hostname'] = fileManager::getFileById(fileManager::getIdByPath("/etc/hostname"))->content;

	actionLogger::init($_SESSION);	

	echo json_encode($result);
?>
