<?php
	require_once("mysqlConnect.php");
	require_once("config.php");

	if (!ENABLE_SETUP)
		die("Setup disabled. Take a look at ./config.php");

	if ($db->query("SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO'") !== true)
		echo "seting mode <span style=\"color: red\">failed</span>.<br />";
	else
		echo "seting mode... success<br />";

	echo "<br />";
	echo "Droping all tables... ";

	if ($db->query("DROP TABLE IF EXISTS `commentBlocks`, `comments`, `files`, `fileTypes`, 
		`groupMemberships`, `groups`, `logCommands`, `logConnect`, `logInits`, `logLogins`, 
		`logSessions`, `users`") === true)
		echo "success";
	else
		echo "<span style=\"color: red\">fail</span>";

	echo "<br /><br />";

	echo "Generating table structure...<br /><br />";

	echo "Table `commentBlocks` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `commentBlocks` (
		`ID` int(11) NOT NULL,
		  `fileFK` int(11) NOT NULL,
		  `welcomeMessage` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `comments` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `comments` (
		`ID` int(11) NOT NULL,
		  `userFK` int(11) NOT NULL,
		  `commentBlockFK` int(11) NOT NULL,
		  `time` int(11) NOT NULL,
		  `text` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	/* Permission-bits:
	 * x = 0, w = 1, r = 2
	 */

	echo "Table `files` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `files` (
		`ID` int(11) NOT NULL,
		  `parentFK` int(11) NOT NULL,
		  `name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `userFK` int(11) NOT NULL,
		  `groupFK` int(11) NOT NULL,
		  `fileTypeFK` tinyint(4) NOT NULL,
		  `rightsUser` tinyint(4) NOT NULL,
		  `rightsGroup` tinyint(4) NOT NULL,
		  `rightsOther` tinyint(4) NOT NULL,
		  `created` int(11) NOT NULL,
		  `changed` int(11) NOT NULL,
		  `content` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `fileTypes` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `fileTypes` (
		`ID` int(11) NOT NULL,
		  `name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `comment` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
		) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `groupMemberships` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `groupMemberships` (
		`ID` int(11) NOT NULL,
		  `userFK` int(11) NOT NULL,
		  `groupFK` int(11) NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `groups` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `groups` (
		`ID` int(11) NOT NULL,
		  `name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
		) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `logCommands` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `logCommands` (
		`ID` int(11) NOT NULL,
		  `time` int(11) NOT NULL,
		  `connectFK` int(11) NOT NULL,
		  `userFK` int(11) NOT NULL,
		  `command` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `logConnect` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `logConnect` (
		`ID` int(11) NOT NULL,
		  `sessionFK` int(11) NOT NULL,
		  `IP` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `time` int(11) NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `logInits` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `logInits` (
		`ID` int(11) NOT NULL,
		  `userFK` int(11) NOT NULL,
		  `connectFK` int(11) NOT NULL,
		  `time` int(11) NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `logLogins` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `logLogins` (
		`ID` int(11) NOT NULL,
		  `currentUserFK` int(11) NOT NULL,
		  `newUserFK` int(11) NOT NULL,
		  `connectFK` int(11) NOT NULL,
		  `time` int(11) NOT NULL,
		  `success` tinyint(1) NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `logSessions` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `logSessions` (
		`ID` int(11) NOT NULL,
		  `created` int(11) NOT NULL,
		  `initialSessID` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `currentSessID` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `userAgent` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "Table `users` ";
	if ($db->query("CREATE TABLE IF NOT EXISTS `users` (
		`ID` int(11) NOT NULL,
		  `name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `groupFK` int(11) NOT NULL,
		  `needLogin` tinyint(1) NOT NULL DEFAULT '1',
		  `password` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `homeFK` int(11) NOT NULL
		) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "created successfully. <br />";

	echo "<br />";
	echo "Populating tables... <br /><br />";

	echo "Table `filesTypes` ";
	if ($db->query("INSERT INTO `fileTypes` (`ID`, `name`, `comment`) VALUES
		(1, 'file', ''),
		(2, 'directory', ''),
		(3, 'commentBlock', '')") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "populated. <br />";

	echo "Table `groups` ";
	if ($db->query("INSERT INTO `groups` (`ID`, `name`) VALUES
		(1, 'root'),
		(2, 'admins'),
		(3, 'users'),
		(4, 'nobodys')") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "populated. <br />";

	echo "Table `users` ";
	if ($db->query("INSERT INTO `users` (`ID`, `name`, `groupFK`, `needLogin`, `password`, `homeFK`) VALUES
		(1, 'root', 1, 1, '" . hash("sha256", hash("sha256", "toor")) . "', 1),
		(2, 'admin', 2, 1, '', 3),
		(3, 'nobody', 3, 0, '', 2)") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "populated. <br />";

	echo "Table `files` ";
	if ($db->query("INSERT INTO `files` (`ID`, `name`, `parentFK`, `userFK`, `groupFK`, `fileTypeFK`, `rightsUser`, `rightsGroup`, `rightsOther`, `created`, `changed`, `content`) VALUES
		(0, '',         0, 1, 1, 2, 7, 5, 5, " . time() . ", " . time() . ", ''),
		(1, 'root',     0, 1, 1, 2, 7, 0, 0, " . time() . ", " . time() . ", ''),
		(2, 'home',     0, 1, 1, 2, 7, 5, 5, " . time() . ", " . time() . ", ''),
		(3, 'admin',    2, 2, 2, 2, 7, 5, 5, " . time() . ", " . time() . ", ''),
		(4, 'etc',      0, 1, 1, 2, 7, 5, 5, " . time() . ", " . time() . ", ''),
		(5, 'hostname', 4, 1, 1, 1, 7, 5, 5, " . time() . ", " . time() . ", '" . DEFAULT_HOSTNAME . "')
") !== true)
		echo ("<span style=\"color: red\">not</span> ");
	echo "populated. <br />";

	echo "<br />";

	echo "Setting indexes... <br />";

	echo " ... `commentBlocks`.`ID` ... ";
	if ($db->query("ALTER TABLE `commentBlocks`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `comments`.`ID` ... ";
	if ($db->query("ALTER TABLE `comments`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `files`.`ID` ... ";
	if ($db->query("ALTER TABLE `files`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `fileTypes`.`ID` ... ";
	if ($db->query("ALTER TABLE `fileTypes`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `groupMemberships`.`ID` ... ";
	if ($db->query("ALTER TABLE `groupMemberships`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `groups`.`ID` ... ";
	if ($db->query("ALTER TABLE `groups`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logCommands`.`ID` ... ";
	if ($db->query("ALTER TABLE `logCommands`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logConnect`.`ID` ... ";
	if ($db->query("ALTER TABLE `logConnect`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logInits`.`ID` ... ";
	if ($db->query("ALTER TABLE `logInits`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logLogins`.`ID` ... ";
	if ($db->query("ALTER TABLE `logLogins`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logSessions`.`ID` ... ";
	if ($db->query("ALTER TABLE `logSessions`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `users`.`ID` ... ";
	if ($db->query("ALTER TABLE `users`
		 ADD PRIMARY KEY (`ID`);") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo "<br />";
	echo "Setting auto-increment-flags...<br />";

	echo " ... `commentBlocks`.`ID` ... ";
	if ($db->query("ALTER TABLE `commentBlocks`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `comments`.`ID` ... ";
	if ($db->query("ALTER TABLE `comments`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `commentBlocks`.`ID` ... ";
	if ($db->query("ALTER TABLE `commentBlocks`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `files`.`ID` ... ";
	if ($db->query("ALTER TABLE `files`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `fileTypes`.`ID` ... ";
	if ($db->query("ALTER TABLE `fileTypes`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `groupMemberships`.`ID` ... ";
	if ($db->query("ALTER TABLE `groupMemberships`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `groups`.`ID` ... ";
	if ($db->query("ALTER TABLE `groups`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logCommands`.`ID` ... ";
	if ($db->query("ALTER TABLE `logCommands`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logConnect`.`ID` ... ";
	if ($db->query("ALTER TABLE `logConnect`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logInits`.`ID` ... ";
	if ($db->query("ALTER TABLE `logInits`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logLogins`.`ID` ... ";
	if ($db->query("ALTER TABLE `logLogins`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `logSessions`.`ID` ... ";
	if ($db->query("ALTER TABLE `logSessions`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo " ... `users`.`ID` ... ";
	if ($db->query("ALTER TABLE `users`
		MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4") !== true)
		echo ("<span style=\"color: red\">fail</span><br />");
	else 
		echo "success<br />";

	echo "<br />";

	echo "Setup finished.";
?>
