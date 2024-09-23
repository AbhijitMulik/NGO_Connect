<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login @NGOCONNECT</title>
    <link rel="stylesheet" href="register.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
<div class="container">
<?php

    if(isset($_POST["login"])){
        $email=$_POST["email"];
        $pass=$_POST["password"];
        require_once "database.php";
        // $sql="SELECT * FROM users WHERE email = '$email'";
        // $result=mysqli_query($conn,$sql);
        // $user=mysqli_fetch_array($result,MYSQLI_ASSOC);
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if($user){
            if(password_verify($pass,$user["password"])){
                header("Location: index2.html");
                die();

            }else{
                echo "<div class='alert alert-danger'>Incorrect Password,Try Again</div>";
            }
        }else{
            echo "<div class='alert alert-danger'>Email doesn't Exist , Please Register First</div>";
        }
    }   
    ?> 
        <form action="newlogin.php" method="post">
        <div class="form-group">
                 <input type="email" class="form-control" name="email" placeholder="Email" required>
        </div>
        <div class="form-group">
                 <input type="password" class="form-control" name="password" placeholder="Password" required>
        </div>
        <div class="form-btn">
                 <input type="submit" class="btn btn-primary" name="login" value="LOGIN ">
        </div>
        </form>
    </div>
</body>
</html> 