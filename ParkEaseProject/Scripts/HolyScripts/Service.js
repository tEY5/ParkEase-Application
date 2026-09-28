app.service("ParkEaseProjectService", function ($http) {

    // Backend server call matching the original pattern
    this.GetusernameFunc = function () {
        return $http.get("/Main/GetusernameFunc");
    };

    // LocalStorage Management for Users
    this.getUsers = function () {
        return JSON.parse(localStorage.getItem('usersList')) || [];
    };

    this.saveUsers = function (usersArray) {
        localStorage.setItem('usersList', JSON.stringify(usersArray));
    };

    // LocalStorage Management for Current Session
    this.getCurrentUser = function () {
        return JSON.parse(localStorage.getItem('currentUser'));
    };

    this.setCurrentUser = function (user) {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    };

    // LocalStorage Management for Violations
    this.getViolations = function () {
        return JSON.parse(localStorage.getItem('violationsList')) || [];
    };

    this.saveViolations = function (violationsArray) {
        localStorage.setItem('violationsList', JSON.stringify(violationsArray));
    };

    // Authentication & Registration Business Logic Helpers
    this.isUsernameTaken = function (username) {
        var users = this.getUsers();
        return users.some(function (u) {
            return u.Username && u.Username.toLowerCase() === username.toLowerCase();
        });
    };

    this.authenticateUser = function (username, password) {
        var users = this.getUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].Username === username && users[i].Password === password) {
                return users[i];
            }
        }
        return null;
    };

});