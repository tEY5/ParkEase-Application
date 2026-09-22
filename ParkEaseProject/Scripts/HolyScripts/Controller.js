app.controller("ParkEaseProjectController", function($scope, ParkEaseProjectService) {

    $scope.userarray = [];


    $scope.alertFunc = function() {
        alert("Yehey");
    }

    $scope.nameFunc = function(username) {
        alert(username);
    }

    $scope.getName = function() {
        alert($scope.username);
    }

    $scope.registrationFunc = function() {

        if (($scope.firstname == undefined || $scope.firstname == "") ||
            ($scope.middlename == undefined || $scope.middlename == "") ||
            ($scope.lastname == undefined || $scope.lastname == "") ||
            ($scope.position == undefined || $scope.position == "")
) {
            alert ("Please fill up all the fields");
        } else {

        var userData = {
            FName: $scope.firstname,
            MName: $scope.middlename,
            LName: $scope.lastname,
            Position: $scope.position
        }

        $scope.userarray.push(userData);

        alert($scope.userarray.length);
    }
}

    $scope.deleteFunc = function(index) {
        $scope.userarray.splice(index, 1);
    }

    $scope.updateFunc = function(userindex) {
        var userdata = $scope.userarray[userindex];

        if ((userdata.FName !== $scope.firstname) ||
            (userdata.MName !== $scope.middlename) ||
            (userdata.LName !== $scope.lastname) ||
            (userdata.Position !== $scope.position))
        {
            userdata.FName = $scope.firstname;
            userdata.MName = $scope.middlename;
            userdata.LName = $scope.lastname;
            userdata.Position = $scope.position;   
        } else {
            alert("Walang bago");
        }
    }

    $scope.redirectFunc = function () {
        window.location.href = "/Main/AboutPage";
    }

});