<?php
	require_once("fileManager.php");
	require_once("sessionManager.php");
	require_once("config.php");
	require_once("userManager.php");

	$path = $_GET['path'];

	$tmp;
	
	try {
		$tmp = fileManager::getFileById(fileManager::getIdByPath($path));
	} catch (Exception $e) {
		$tmp = array();
		$tmp['error'] = $e->getMessage();
		echo json_encode($tmp);
		exit();
	}
	if ($tmp->fileType == "directory") {
		$name = $tmp->name;
		$tmp = array();
		$tmp['error'] = $name . ": Is a directory";
		echo json_encode($tmp);
		exit();
	} 
	if (!(userManager::getRightsOnFile($_SESSION['uid'], fileManager::getFileById($tmp->parentFK)) & FILE_FLAG_READ)) {
		$name = $tmp->name;
		$tmp = array();
		$tmp['error'] = $name . ": Permission denied";
		echo json_encode($tmp);
		exit();
	}
	$result = array();
	$result['name'] = $tmp->name;
	$result['content'] = $tmp->content;
	echo json_encode($result);
?>
