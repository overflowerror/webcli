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
		return json_encode($tmp);
		exit();
	}
	if ($tmp->fileType == "directory") {
		if (userManager::getRightsOnFile($_SESSION['uid'], $tmp) & 1<<2)
			$tmp = fileManager::getFilesByParentId($tmp->ID);
		else {
			$tmp = array();
			$tmp['error'] = "cannot open directory " + $path + ": Permission denied";
			return json_encode($tmp);
			exit();
		}
	} else {
		if (userManager::getRightsOnFile($_SESSION['uid'], fileManager::getFileById($tmp->parentFK)) & 1<<2)
			$tmp = array($tmp);
		else {
			$tmp = array();
			$tmp['error'] = "cannot open file " + $path + ": Permission denied";
			return json_encode($tmp);
			exit();
		}
	}
	
	$result = array();

	for ($i = 0; $i < count($tmp); $i++) {
		$result[$i] = array();
		$result[$i]['permission'] = fileManager::getPermissionStringByFile($tmp[$i]);
		$result[$i]['hardlinks'] = "1"; // not implemented
		$result[$i]['owner'] = userManager::getUserById($tmp[$i]->userFK)->name;
		$result[$i]['group'] = userManager::getGroupById($tmp[$i]->groupFK)->name;
		$result[$i]['size'] = ($tmp[$i]->fileType == "directory" ? SIZE_OF_DIRECTORY : strlen($tmp[$i]->content)) . "";
		$result[$i]['created'] = $tmp[$i]->created;
		$result[$i]['changed'] = $tmp[$i]->changed;
		$result[$i]['name'] = $tmp[$i]->name;
	}
	echo json_encode($result);
?>
