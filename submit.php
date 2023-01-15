<?php
include "db.php";
$data = $_POST;

$return_arr = array();

$columns = implode(", ", array_keys($data));

$escaped_values = array_map(array($con, 'real_escape_string'), array_values($data));
$values  = implode("', '", $escaped_values);

// Compose the SQL Query
$sql = "INSERT INTO `addresses`($columns) VALUES ('$values')";

if (mysqli_query($con, $sql)) {
    echo json_encode([
        "success" => true,
        "error" => false
    ]);
} else {
    echo json_encode([
        "error" => true,
        "text" => "Could not insert record: " . mysqli_error($con)
    ]);
}

mysqli_close($con);
