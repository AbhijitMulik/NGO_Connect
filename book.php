<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "admngos";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $ngo_type = mysqli_real_escape_string($conn, $_POST['ngo_type']);
    $ngo_name = mysqli_real_escape_string($conn, $_POST['ngo_name']);
    $booking_date = mysqli_real_escape_string($conn, $_POST['booking_date']);
     $timeslot = mysqli_real_escape_string($conn, $_POST['timeslot']);

     $sql = "INSERT INTO bookings (ngo_type, ngo_name, booking_date, timeslot) VALUES ('$ngo_type', '$ngo_name', '$booking_date', '$timeslot')";
    
    if (mysqli_query($conn, $sql)) {
        echo json_encode(['status' => 'success', 'message' => 'Booking confirmed!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . mysqli_error($conn)]);
    }
}

mysqli_close($conn);
?>
