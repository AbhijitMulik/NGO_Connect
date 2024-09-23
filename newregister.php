<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="newregister.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>Registeration @ NGOCONNECT</title>
</head>
<body>
<div class="container">
 <?php
    if(isset($_POST["submit"])) {
        $fullName = $_POST["Fullname"];
        $email = $_POST["Email"];
        $pass = $_POST["password"];
        $passwordRepeat = $_POST["repeat_password"];
        $pass_hash=password_hash($pass,PASSWORD_DEFAULT);
        $errors = array(); //Array to validate fields entered by user

        if(empty($fullName) || empty($email) || empty($pass) || empty($passwordRepeat)){ //To check All fields are filled
            array_push($errors,"All Fields are Required");
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            array_push($errors,"Email is not Valid"); //to check valid email ID
        }
        if(strlen($pass) < 8){
            array_push($errors,"Password must contain minimum 8 Characters long"); //to check whether length of password is appropriate
        }
        if($pass !== $passwordRepeat){
            array_push($errors,"Password does not match"); //to check whether repeat Password value is same as the Password value
        }
        require_once "database.php";
        $sql="SELECT * FROM users WHERE email='$email' ";
        $result=mysqli_query($conn,$sql);
        $rowCount=mysqli_num_rows($result);
        if($rowCount>0){
        array_push($errors,"Email already exists ");
        }
        if(count($errors) > 0){
            foreach($errors as $error){
                echo "<div class='alert alert-danger'>$error</div>";
            }
        } else {
          
           $sql="INSERT INTO users(full_name,email,password) VALUES (? , ?, ?)";
           $stmt=mysqli_stmt_init($conn);
          $prepareStmt= mysqli_stmt_prepare($stmt,$sql);
          if($prepareStmt){
            mysqli_stmt_bind_param($stmt,"sss", $fullName, $email,$pass_hash);
            mysqli_stmt_execute($stmt);
            echo "<div class='alert alert-success'>Registeration Successfully</div>";
          }else{
            die("Something went wrong");
          }
        }
    }

    ?>
  
        <form action="newregister.php" method="post">
            <div class="form-group">
                 <input type="text" class="form-control" name="Fullname" placeholder="Full Name">
            </div>
            <div class="form-group">
                 <input type="email" class="form-control" name="Email" placeholder="Email">
            </div>
            <div class="form-group">
                 <input type="password" class="form-control" name="password" placeholder="Password">
            </div>
            <div class="form-group">
                 <input type="password" class="form-control" name="repeat_password" placeholder="Repeat Password">
            </div>
            <div class="form-btn">
                 <input type="submit" class="btn btn-primary" name="submit" value="Register">
            </div>
        </form>
    </div>
</body>
</html>
