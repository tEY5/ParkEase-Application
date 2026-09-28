app.controller("ParkEaseProjectController", function($scope, ParkEaseProjectService) {

    $scope.userarray = JSON.parse(localStorage.getItem('usersList')) || [];
    $scope.isLoggedIn = false;
    $scope.currentUserRole = '';
    $scope.currentPage = 'home';

    var sessionUser = JSON.parse(localStorage.getItem('currentUser'));
    if (sessionUser) {
        $scope.isLoggedIn = true;
        $scope.currentUser = sessionUser;
        $scope.currentUserRole = sessionUser.Role;
    }

    $scope.updateNavLinks = function() {
        var activeUser = $scope.currentUser || JSON.parse(localStorage.getItem('currentUser'));
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

    $scope.registerFunc = function() {

        if (($scope.firstname == undefined || $scope.firstname == "") ||
            ($scope.middlename == undefined || $scope.middlename == "") ||
            ($scope.lastname == undefined || $scope.lastname == "") ||
            ($scope.platenumber == undefined || $scope.platenumber == "") ||
            ($scope.username == undefined || $scope.username == "") ||
            ($scope.email == undefined || $scope.email == "") ||
            ($scope.password == undefined || $scope.password == "")
        ) {
            alert("Please fill up all the fields");
        } else {
            var userData = {
                Fname: $scope.firstname,
                Mname: $scope.middlename,
                Lname: $scope.lastname,
                PlateNumber: $scope.platenumber,
                Username: $scope.username,
                Email: $scope.email,
                Password: $scope.password,
                Role: 'user'

            }
            $scope.userarray.push(userData);
            localStorage.setItem('usersList', JSON.stringify($scope.userarray));
            alert($scope.userarray.length);
            window.location.href = "/Main/LoginPage";
        }

    }

    $scope.clearFunc = function() {
        $scope.firstname = "";
        $scope.middlename = "";
        $scope.lastname = "";
        $scope.platenumber = "";
        $scope.username = "";
        $scope.email = "";
        $scope.password = "";

    }

    $scope.loginFunc = function() {

        var savedUsers = JSON.parse(localStorage.getItem('usersList')) || [];
        var matchedUser = null;

        if (savedUsers && savedUsers.length > 0) {
            for (var i = 0; i < savedUsers.length; i++) {
                if (savedUsers[i].Username === $scope.loginData.username &&
                    savedUsers[i].Password === $scope.loginData.password) {
                    matchedUser = savedUsers[i];
                    break;
                }
            }
        }

        if (matchedUser !== null) {
            $scope.isLoggedIn = true;
            $scope.currentUser = matchedUser;
            $scope.currentUserRole = matchedUser.Role || 'admin';
            localStorage.setItem('currentUser', JSON.stringify(matchedUser));
            $scope.updateNavLinks();
            alert("Logged in");
            if ($scope.currentUserRole === 'admin') {
                window.location.href = "/Main/AdminDashboardPage";
                $scope.updateNavLinks();
            } else {
                window.location.href = "/Main/UserDashboardPage";
                $scope.updateNavLinks();
            }
        } else {
            alert("Please enter valid Credentials");
        }

    }

    $scope.clearLoginFunc = function() {
        $scope.loginData = {};
    }

    $scope.logoutFunc = function() {
        localStorage.removeItem('currentUser');
        $scope.isLoggedIn = false;
        $scope.currentUser = null;
        $scope.currentUserRole = '';
        $scope.updateNavLinks();
        window.location.href = "/Main/LoginPage";
    };

    $scope.adminEditFunc = function() {

    }












});