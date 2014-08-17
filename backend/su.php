<?php
	require_once("fileManager.php");
	require_once("sessionManager.php");
	require_once("actionLogger.php");
	require_once("config.php");
	require_once("userManager.php");

	$result = array();
	$user = $_GET['user'];
	$tmp;
	try {
		$tmp = userManager::getUserById(userManager::getIdByUsername($user));
	} catch (Exception $e) {
		$tmp = array();
		$tmp['error'] = $e->getMessage();
		echo json_encode($tmp);
		exit();
	}
	if (!$tmp->needLogin || ($_SESSION['uid'] == 0)) {
		$result['loggedIn'] = true;
		$_SESSION['uid'] = $tmp->ID;
		$result['username'] = $tmp->name;
		$result['uid'] = $tmp->ID;
		$result['home'] = fileManager::getPathById($tmp->homeFK);
	}
	$result['okay'] = true;

	if (isset($_GET['password'])) {
		if ($tmp->password != hash("sha256", $_GET['password'])) {
			$result['error'] = "Authentication failure";
			actionLogger::login($tmp->ID, $_SESSION, 0);
		} else {
			$result['loggedIn'] = true;
			$_SESSION['uid'] = $tmp->ID;
			$result['username'] = $tmp->name;
			$result['uid'] = $tmp->ID;
			$result['home'] = fileManager::getPathById($tmp->homeFK);
			actionLogger::login($tmp->ID, $_SESSION, 1);
		}
	}
	echo json_encode($result);
?>
