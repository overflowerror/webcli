<?php
	define("BETA",			true);
	define("ENABLE_SETUP",		false);

	define("LOG_FILE",		"/var/www/websites/webcli/internal.log");
	
	define("DB_HOST",		"localhost");
	define("DB_USER",		"webcli");
	define("DB_PASSWORD",		"password");
	define("DB_NAME",		"webcli");

	define("DEFAULT_USER",		3); 		// default value: 3 (nobody)
	define("DEFAULT_HOSTNAME", 	"webcli");
	define("SIZE_OF_DIRECTORY",	4096);

	// do not change anything below here

	define("FILE_FLAG_EXECUTE",	1 << 0);
	define("FILE_FLAG_WRITE",	1 << 1);	
	define("FILE_FLAG_READ",	1 << 2);
?>
