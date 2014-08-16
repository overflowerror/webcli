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

	if ($tmp->fileType != "directory") {
		$name = $tmp->name;
		$tmp = array();
		$tmp['error'] = $name . ": Not a directory";
		echo json_encode($tmp);
		exit();
	}
	
	if (!(userManager::getRightsOnFile($_SESSION['uid'], $tmp) & FILE_FLAG_READ)) {
		$name = $tmp->name;
		$tmp = array();
		$tmp['error'] = $name . ": Not permitted";
		echo json_encode($tmp);
		exit();
	}

	$path = fileManager::getPathById($tmp->ID);
	$tmp = array();
	$tmp['path'] = $path;
	echo json_encode($tmp);
?>
