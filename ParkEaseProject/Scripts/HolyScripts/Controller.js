app.controller("ParkEaseProjectController", function ($scope, ParkEaseProjectService) {

    $scope.userarray = ParkEaseProjectService.getUsers();
    $scope.isLoggedIn = (sessionStorage.getItem("isLoggedIn") === "true");
    $scope.isEditing = false;
    $scope.editIndex = -1;

    if (window.location.pathname.toLowerCase().includes("/main/homepage") && !$scope.isLoggedIn) {
        window.location.href = "/Main/LoginPage";
    }

    $scope.alertFunc = function () {
        alert("Yehey");
    };

    $scope.nameFunc = function (username) {
        alert(username);
    };

    $scope.getName = function () {
        alert($scope.username);
    };

    $scope.redirectFunc = function () {
        window.location.href = "/Main/AboutPage";
    };

    $scope.clearLoginFunc = function () {
        $scope.loginUsername = "";
        $scope.loginPassword = "";
    };

    $scope.loginFunc = function () {
        if (!$scope.loginUsername || $scope.loginUsername.trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Username or Email is required.'
            });
            return;
        }

        if (!$scope.loginPassword || $scope.loginPassword.trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Password is required.'
            });
            return;
        }

        var inputUser = $scope.loginUsername.trim();
        var inputPass = $scope.loginPassword.trim();
        var foundUser = false;

        for (var i = 0; i < $scope.userarray.length; i++) {
            var userdata = $scope.userarray[i];

            if ((userdata.Email && userdata.Email.toLowerCase() === inputUser.toLowerCase() ||
                userdata.FName && userdata.FName.toLowerCase() === inputUser.toLowerCase()) &&
                userdata.Password === inputPass) {
                foundUser = true;
                break;
            }
        }

        if (!foundUser) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid username/email or password.'
            });
            return;
        }

        $scope.isLoggedIn = true;
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.href = "/Main/HomePage";
    };

    $scope.logoutFunc = function () {
        $scope.isLoggedIn = false;
        sessionStorage.removeItem("isLoggedIn");
        window.location.href = "/Main/LoginPage";
    };

    $scope.clearFunc = function () {
        $scope.firstname = "";
        $scope.lastname = "";
        $scope.middlename = "";
        $scope.email = "";
        $scope.password = "";
        $scope.confirmPassword = "";
        $scope.position = "";
        $scope.isEditing = false;
        $scope.editIndex = -1;
    };

    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    $scope.registrationFunc = function () {
        if (!$scope.firstname || $scope.firstname.trim() === "") {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'First Name is required.' });
            return;
        }

        if ($scope.firstname.trim().length < 2) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'First Name must be at least 2 characters.' });
            return;
        }

        if (!$scope.lastname || $scope.lastname.trim() === "") {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Last Name is required.' });
            return;
        }

        if ($scope.lastname.trim().length < 2) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Last Name must be at least 2 characters.' });
            return;
        }

        if (!$scope.email || $scope.email.trim() === "") {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Email Address is required.' });
            return;
        }

        if (!validateEmail($scope.email.trim())) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please enter a valid email format.' });
            return;
        }

        var isDuplicate = $scope.userarray.some(function (item) {
            return item.Email && item.Email.toLowerCase() === $scope.email.trim().toLowerCase();
        });

        if (isDuplicate) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Email already exists in the system.' });
            return;
        }

        if (!$scope.password || $scope.password.trim() === "") {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Password is required.' });
            return;
        }

        if ($scope.password.trim().length < 8) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Password must be at least 8 characters long.' });
            return;
        }

        var newUser = {
            FName: $scope.firstname.trim(),
            MName: $scope.middlename ? $scope.middlename.trim() : "",
            LName: $scope.lastname.trim(),
            Email: $scope.email.trim(),
            Password: $scope.password.trim(),
            Position: $scope.position ? $scope.position.trim() : "Client",
            Avatar: ""
        };

        $scope.userarray.push(newUser);
        ParkEaseProjectService.saveUsers($scope.userarray);

        Swal.fire({
            icon: 'success',
            title: 'Account Registered!',
            text: 'Employee/Client record has been successfully created.',
            timer: 1500,
            showConfirmButton: false
        });

        $scope.clearFunc();
    };

    $scope.editFunc = function (index) {
        $scope.isEditing = true;
        $scope.editIndex = index;
        var userdata = $scope.userarray[index];
        $scope.firstname = userdata.FName;
        $scope.middlename = userdata.MName || "";
        $scope.lastname = userdata.LName;
        $scope.email = userdata.Email;
        $scope.position = userdata.Position || "";
        $scope.password = userdata.Password || "";

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    $scope.cancelEditFunc = function () {
        $scope.clearFunc();
    };

    $scope.updateFunc = function (userindex) {
        var idx = ($scope.isEditing && $scope.editIndex >= 0) ? $scope.editIndex : userindex;
        if (idx === undefined || idx < 0 || idx >= $scope.userarray.length) {
            return;
        }

        var userdata = $scope.userarray[idx];

        if ((userdata.FName === $scope.firstname) &&
            (userdata.MName === ($scope.middlename || "")) &&
            (userdata.LName === $scope.lastname) &&
            (userdata.Email === $scope.email) &&
            (userdata.Position === ($scope.position || ""))) {
            alert("Walang bago");
            return;
        }

        if (!$scope.firstname || $scope.firstname.trim().length < 2) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'First Name must be at least 2 characters.' });
            return;
        }

        if (!$scope.lastname || $scope.lastname.trim().length < 2) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Last Name must be at least 2 characters.' });
            return;
        }

        if (!$scope.email || !validateEmail($scope.email.trim())) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please enter a valid email format.' });
            return;
        }

        var isDuplicate = $scope.userarray.some(function (item, i) {
            return i !== idx && item.Email && item.Email.toLowerCase() === $scope.email.trim().toLowerCase();
        });

        if (isDuplicate) {
            Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Email is already used by another record.' });
            return;
        }

        userdata.FName = $scope.firstname.trim();
        userdata.MName = $scope.middlename ? $scope.middlename.trim() : "";
        userdata.LName = $scope.lastname.trim();
        userdata.Email = $scope.email.trim();
        userdata.Position = $scope.position ? $scope.position.trim() : userdata.Position;
        if ($scope.password && $scope.password.trim() !== "") {
            userdata.Password = $scope.password.trim();
        }

        ParkEaseProjectService.saveUsers($scope.userarray);

        Swal.fire({
            icon: 'success',
            title: 'Record Updated!',
            text: 'Client record changes have been saved.',
            timer: 1500,
            showConfirmButton: false
        });

        $scope.clearFunc();
    };

    $scope.deleteFunc = function (index) {
        Swal.fire({
            title: 'Delete Client Record?',
            text: "This record will be permanently deleted from the client list.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it'
        }).then(function (result) {
            if (result.isConfirmed) {
                $scope.userarray.splice(index, 1);
                ParkEaseProjectService.saveUsers($scope.userarray);
                $scope.$apply();
                Swal.fire('Deleted!', 'Client record has been removed.', 'success');
                if ($scope.editIndex === index) {
                    $scope.clearFunc();
                }
            }
        });
    };

});