<?php
    // Database configuration
    $host = "localhost"; // MySQL hostname
    $dbUserName = "root"; // MySQL database username
    $dbPwd = ""; // MySQL database password
    $dbName = "scoreboard"; // The name of the database
	$table = "game_table_name"; // The name of the table

    $tableFilterID = ''; // Filter ID
	$tableFilterUsers = "filter_users"; // The name of the filter table (users)
	$tableFilterScores = "filter_scores"; // The name of the filter table (scores)
    
    // Start connection to database server
    $conn = mysqli_connect($host, $dbUserName, $dbPwd);
	mysqli_set_charset($conn, 'utf8');

    if (!$conn) {
        die('Could not connect: ' . mysqli_connect_error());
    }

    // make connection to database
	$db_selected = mysqli_select_db($conn, $dbName);
    if (!$db_selected) {
        die ('Can\'t use database'.$dbName.' : ' . mysqli_connect_error());
    }

    $testMode = false;
	//mysql_close($link);
?>