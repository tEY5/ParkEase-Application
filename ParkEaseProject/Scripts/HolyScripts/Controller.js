app.controller("ParkEaseProjectController", function ($scope, ParkEaseProjectService) {

    $scope.userarray = ParkEaseProjectService.getUsers();
    $scope.isLoggedIn = false;
    $scope.currentUserRole = '';
    $scope.currentPage = 'home';

    var sessionUser = ParkEaseProjectService.getCurrentUser();
    if (sessionUser) {
        $scope.isLoggedIn = true;
        $scope.currentUser = sessionUser;
        $scope.currentUserRole = sessionUser.Role;

        $scope.clientProfile = {
            FName: sessionUser.Fname,
            LName: sessionUser.Lname,
            Email: sessionUser.Email,
            PlateNumber: sessionUser.PlateNumber
        };

        var allViolations = ParkEaseProjectService.getViolations();
        $scope.clientViolations = allViolations.filter(function (v) {
            return v.Username === sessionUser.Username;
        }).map(function (v) {
            return {
                ViolationType: v.Type,
                DateIssued: v.DateIssued,
                FineAmount: v.Fine,
                Status: "Pending"
            };
        });
    }

    $scope.passwordForm = {};
    $scope.loginData = {};

    $scope.updateNavLinks = function () {
        var activeUser = $scope.currentUser || ParkEaseProjectService.getCurrentUser();
        var role = activeUser ? activeUser.Role : '';
        var loggedIn = $scope.isLoggedIn || (activeUser ? true : false);

        if (loggedIn && role === 'admin') {
            $scope.navLinks = [
                { title: "Admin Dashboard", url: "/Main/AdminDashboardPage", key: "Admin Dashboard" },
                { title: "Home", url: "/Main/HomePage", key: "Home" },
                { title: "About Us", url: "/Main/AboutPage", key: "About Us" },
                { title: "Contact", url: "/Main/ContactPage", key: "Contact" }
            ];
        } else if (loggedIn && role === 'user') {
            $scope.navLinks = [
                { title: "Dashboard", url: "/Main/UserDashboardPage", key: "Dashboard" },
                { title: "Home", url: "/Main/HomePage", key: "Home" },
                { title: "About Us", url: "/Main/AboutPage", key: "About Us" },
                { title: "Contact", url: "/Main/ContactPage", key: "Contact" }
            ];
        } else {
            $scope.navLinks = [
                { title: "Home", url: "/Main/HomePage", key: "Home" },
                { title: "About Us", url: "/Main/AboutPage", key: "About Us" },
                { title: "Contact", url: "/Main/ContactPage", key: "Contact" }
            ];
        }
    };

    $scope.updateNavLinks();

    // Validation & SweetAlert

    function showAlert(icon, title, message, callback) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: icon,
                title: title,
                text: message,
                confirmButtonColor: '#7c3aed',
                confirmButtonText: 'OK'
            }).then(function (result) {
                if (callback && result.isConfirmed) {
                    callback();
                }
            });
        } else {
            alert(message);
            if (callback) callback();
        }
    }

    function showValidationError(message) {
        showAlert('error', 'Validation Error', message);
    }

    function showSuccess(title, message, callback) {
        showAlert('success', title, message, callback);
    }

    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var platePattern = /^[A-Za-z]{2,3}[\s-]?[0-9]{3,4}$/i;
    var usernamePattern = /^[a-zA-Z0-9_]+$/;

    function validateEmail(email) {
        if (!email || String(email).trim() === '') {
            return { valid: false, message: "Email is required." };
        }
        var trimmed = String(email).trim();
        if (!emailPattern.test(trimmed)) {
            return { valid: false, message: "Please enter a valid email address." };
        }
        return { valid: true };
    }

    function validatePassword(password) {
        if (!password || String(password) === '') {
            return { valid: false, message: "Password is required." };
        }
        var str = String(password);
        var hasMinLength = str.length >= 8;
        var hasLetter = /[a-zA-Z]/.test(str);
        var hasNumber = /[0-9]/.test(str);

        if (!hasMinLength || !hasLetter || !hasNumber) {
            return {
                valid: false,
                message: "Password must be at least 8 characters long and contain both letters and numbers."
            };
        }
        return { valid: true };
    }

    // Registration

    $scope.registerFunc = function () {
        if (!$scope.firstname || String($scope.firstname).trim() === '') {
            showValidationError("First Name is required.");
            return;
        }
        if (!$scope.middlename || String($scope.middlename).trim() === '') {
            showValidationError("Middle Name is required.");
            return;
        }
        if (!$scope.lastname || String($scope.lastname).trim() === '') {
            showValidationError("Last Name is required.");
            return;
        }
        if (!$scope.platenumber || String($scope.platenumber).trim() === '') {
            showValidationError("Plate Number is required.");
            return;
        }
        if (!platePattern.test(String($scope.platenumber).trim())) {
            showValidationError("Please enter a valid plate number format (e.g., ABC 1234).");
            return;
        }

        if (!$scope.username || String($scope.username).trim() === '') {
            showValidationError("Username is required.");
            return;
        }
        var trimmedUsername = String($scope.username).trim();
        if (trimmedUsername.length < 4 || trimmedUsername.length > 20) {
            showValidationError("Username must be between 4 and 20 characters long.");
            return;
        }
        if (!usernamePattern.test(trimmedUsername)) {
            showValidationError("Username can only contain letters, numbers, and underscores.");
            return;
        }

        // Check to verify existing user
        if (ParkEaseProjectService.isUsernameTaken(trimmedUsername)) {
            showValidationError("Username already exists. Please choose a different username.");
            return;
        }

        var emailResult = validateEmail($scope.email);
        if (!emailResult.valid) {
            showValidationError(emailResult.message);
            return;
        }

        var passwordResult = validatePassword($scope.password);
        if (!passwordResult.valid) {
            showValidationError(passwordResult.message);
            return;
        }

        if ($scope.confirmpassword && $scope.password !== $scope.confirmpassword) {
            showValidationError("Passwords do not match.");
            return;
        }

        var userData = {
            Fname: String($scope.firstname).trim(),
            Mname: String($scope.middlename).trim(),
            Lname: String($scope.lastname).trim(),
            PlateNumber: String($scope.platenumber).trim().toUpperCase(),
            Username: trimmedUsername,
            Email: String($scope.email).trim().toLowerCase(),
            Password: $scope.password,
            Role: 'user'
        };

        $scope.userarray.push(userData);
        ParkEaseProjectService.saveUsers($scope.userarray);

        showSuccess("Registration Successful", "Your account has been created successfully!", function () {
            window.location.href = "/Main/LoginPage";
        });
    };

    $scope.clearFunc = function () {
        $scope.firstname = "";
        $scope.middlename = "";
        $scope.lastname = "";
        $scope.platenumber = "";
        $scope.username = "";
        $scope.email = "";
        $scope.password = "";
        $scope.confirmpassword = "";
    };

    // Login

    $scope.loginFunc = function () {
        if (!$scope.loginData || !$scope.loginData.username || String($scope.loginData.username).trim() === '') {
            showValidationError("Username is required.");
            return;
        }
        if (!$scope.loginData.password || String($scope.loginData.password) === '') {
            showValidationError("Password is required.");
            return;
        }

        var matchedUser = ParkEaseProjectService.authenticateUser(
            String($scope.loginData.username).trim(),
            $scope.loginData.password
        );

        if (matchedUser !== null) {
            $scope.isLoggedIn = true;
            $scope.currentUser = matchedUser;
            $scope.currentUserRole = matchedUser.Role || 'user';

            ParkEaseProjectService.setCurrentUser(matchedUser);
            $scope.updateNavLinks();

            showSuccess("Login Successful", "Logged in successfully!", function () {
                if ($scope.currentUserRole === 'admin') {
                    window.location.href = "/Main/AdminDashboardPage";
                } else {
                    window.location.href = "/Main/UserDashboardPage";
                }
            });
        } else {
            showValidationError("Please enter valid Credentials");
        }
    };

    $scope.clearLoginFunc = function () {
        $scope.loginData = {};
    };

    $scope.logoutFunc = function () {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'question',
                title: 'Logout',
                text: 'Are you sure you want to log out?',
                showCancelButton: true,
                confirmButtonColor: '#7c3aed',
                cancelButtonColor: '#94a3b8',
                confirmButtonText: 'Yes, Log out'
            }).then(function (result) {
                if (result.isConfirmed) {
                    ParkEaseProjectService.setCurrentUser(null);
                    $scope.isLoggedIn = false;
                    $scope.currentUser = null;
                    $scope.currentUserRole = '';
                    $scope.updateNavLinks();
                    window.location.href = "/Main/LoginPage";
                }
            });
        } else {
            ParkEaseProjectService.setCurrentUser(null);
            $scope.isLoggedIn = false;
            $scope.currentUser = null;
            $scope.currentUserRole = '';
            $scope.updateNavLinks();
            window.location.href = "/Main/LoginPage";
        }
    };

    // Admin Dashboard Logic

    $scope.currentModal = null;
    $scope.activeUser = {};
    $scope.violationData = {};

    $scope.openModal = function (type, user) {
        $scope.currentModal = type;
        $scope.activeUser = type === 'edit' ? Object.assign({}, user) : user;
        if (type === 'violation') {
            $scope.violationData = {};
        }
    };

    $scope.closeModal = function () {
        $scope.currentModal = null;
        $scope.activeUser = {};
        $scope.violationData = {};
    };

    $scope.saveUserEdit = function () {
        if (!$scope.activeUser.Fname || String($scope.activeUser.Fname).trim() === '') {
            showValidationError("First Name is required.");
            return;
        }
        if (!$scope.activeUser.Lname || String($scope.activeUser.Lname).trim() === '') {
            showValidationError("Last Name is required.");
            return;
        }
        if (!$scope.activeUser.PlateNumber || !platePattern.test(String($scope.activeUser.PlateNumber).trim())) {
            showValidationError("Please enter a valid plate number format.");
            return;
        }

        var emailResult = validateEmail($scope.activeUser.Email);
        if (!emailResult.valid) {
            showValidationError(emailResult.message);
            return;
        }

        for (var i = 0; i < $scope.userarray.length; i++) {
            if ($scope.userarray[i].Username === $scope.activeUser.Username) {
                $scope.userarray[i].Fname = String($scope.activeUser.Fname).trim();
                $scope.userarray[i].Mname = $scope.activeUser.Mname ? String($scope.activeUser.Mname).trim() : '';
                $scope.userarray[i].Lname = String($scope.activeUser.Lname).trim();
                $scope.userarray[i].PlateNumber = String($scope.activeUser.PlateNumber).trim().toUpperCase();
                $scope.userarray[i].Email = String($scope.activeUser.Email).trim().toLowerCase();
                $scope.userarray[i].Role = $scope.activeUser.Role;
                break;
            }
        }

        ParkEaseProjectService.saveUsers($scope.userarray);
        showSuccess("Updated", "User details updated successfully!");
        $scope.closeModal();
    };

    $scope.submitViolation = function () {
        if (!$scope.violationData.Type || String($scope.violationData.Type).trim() === '') {
            showValidationError("Please select a violation type.");
            return;
        }

        var fineNum = Number($scope.violationData.Fine);
        if (isNaN(fineNum) || fineNum <= 0) {
            showValidationError("Please enter a valid fine amount.");
            return;
        }

        var newViolation = {
            Username: $scope.activeUser.Username,
            PlateNumber: $scope.activeUser.PlateNumber,
            Type: $scope.violationData.Type,
            Fine: fineNum,
            Remarks: $scope.violationData.Remarks || "No remarks provided",
            DateIssued: new Date().toLocaleString()
        };

        var violationsList = ParkEaseProjectService.getViolations();
        violationsList.push(newViolation);
        ParkEaseProjectService.saveViolations(violationsList);

        showSuccess("Citation Issued", "Violation successfully issued to " + $scope.activeUser.Username);
        $scope.closeModal();
    };

    // User Dashboard Logic

    $scope.updateProfile = function () {
        if (!$scope.clientProfile) return;

        if (!$scope.clientProfile.FName || !$scope.clientProfile.LName) {
            showValidationError("First and Last Name are required.");
            return;
        }

        var emailResult = validateEmail($scope.clientProfile.Email);
        if (!emailResult.valid) {
            showValidationError(emailResult.message);
            return;
        }

        if (!$scope.clientProfile.PlateNumber || !platePattern.test(String($scope.clientProfile.PlateNumber).trim())) {
            showValidationError("Please enter a valid plate number format.");
            return;
        }

        if ($scope.currentUser) {
            $scope.currentUser.Fname = String($scope.clientProfile.FName).trim();
            $scope.currentUser.Lname = String($scope.clientProfile.LName).trim();
            $scope.currentUser.Email = String($scope.clientProfile.Email).trim().toLowerCase();
            $scope.currentUser.PlateNumber = String($scope.clientProfile.PlateNumber).trim().toUpperCase();

            ParkEaseProjectService.setCurrentUser($scope.currentUser);

            for (var i = 0; i < $scope.userarray.length; i++) {
                if ($scope.userarray[i].Username === $scope.currentUser.Username) {
                    $scope.userarray[i] = Object.assign({}, $scope.currentUser);
                    break;
                }
            }
            ParkEaseProjectService.saveUsers($scope.userarray);
            showSuccess("Profile Updated", "Your profile details have been updated successfully!");
        }
    };

    $scope.updatePassword = function () {
        if (!$scope.passwordForm || !$scope.passwordForm.CurrentPassword) {
            showValidationError("Current password is required.");
            return;
        }

        if ($scope.currentUser && $scope.passwordForm.CurrentPassword !== $scope.currentUser.Password) {
            showValidationError("Current password is incorrect.");
            return;
        }

        var passwordResult = validatePassword($scope.passwordForm.NewPassword);
        if (!passwordResult.valid) {
            showValidationError(passwordResult.message);
            return;
        }

        if ($scope.passwordForm.NewPassword !== $scope.passwordForm.ConfirmPassword) {
            showValidationError("Passwords do not match.");
            return;
        }

        if ($scope.currentUser) {
            $scope.currentUser.Password = $scope.passwordForm.NewPassword;
            ParkEaseProjectService.setCurrentUser($scope.currentUser);

            for (var i = 0; i < $scope.userarray.length; i++) {
                if ($scope.userarray[i].Username === $scope.currentUser.Username) {
                    $scope.userarray[i].Password = $scope.passwordForm.NewPassword;
                    break;
                }
            }
            ParkEaseProjectService.saveUsers($scope.userarray);
            $scope.passwordForm = {};
            showSuccess("Password Updated", "Your password has been changed successfully!");
        }
    };

    // 
    $scope.getBackendGreeting = function () {
        var getData = ParkEaseProjectService.GetusernameFunc();
        getData.then(function (returnedData) {
            showAlert('info', 'Backend Response', "C# returned: " + returnedData.data);
        });
    };

});