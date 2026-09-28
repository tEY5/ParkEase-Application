app.service("ParkEaseProjectService", function ($http) {

    this.GetUserFunc = function () {
        return $http.get("/Main/GetusernameFunc");
    }




});