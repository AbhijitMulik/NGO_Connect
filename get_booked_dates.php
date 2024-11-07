<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "admngos";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get booked dates
$sql = "SELECT booking_date ,timeslot FROM bookings"; // Adjust according to your table structure
$result = $conn->query($sql);

$bookedDates = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookedDates[] = $row['booking_date'];
         $timeslot = $row['timeslot'];// Make sure the format matches YYYY-MM-DD
          // Group time slots by date
        if (!isset($bookedDates[$date])) {
            $bookedDates[$date] = [];
        }

        $bookedDates[$date][] = $timeslot; // Append timeslot to the respective date

    }
}

$conn->close();

echo json_encode($bookedDates);
?>
