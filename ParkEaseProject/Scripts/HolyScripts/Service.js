app.service("ParkEaseProjectService", function () {
    var defaultUsers = [
        { FName: "Maria", LName: "Santos", Email: "maria@maria.santos.com", Avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", Position: "Designer" },
        { FName: "Juan", LName: "Cruz", Email: "juan@juan.cruz.com", Avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", Position: "Developer" },
        { FName: "Robert", LName: "Chen", Email: "robert@kobertchen.com", Avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", Position: "Manager" },
        { FName: "Aisha", LName: "Khan", Email: "aisha@aishakhan.com", Avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", Position: "Analyst" },
        { FName: "Jokin", LName: "Gace", Email: "funot@tarks.email.com", Avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", Position: "Supervisor" },
        { FName: "Juaz", LName: "Chen", Email: "robert@tulcr.temail.com", Avatar: "", Position: "Officer" },
        { FName: "Mina", LName: "Khan", Email: "robert@gmail7.com.com", Avatar: "", Position: "Staff" },
        { FName: "Johe", LName: "Nolsz", Email: "jade@prunid.temail.com", Avatar: "", Position: "Coordinator" }
    ];

    this.getUsers = function () {
        var stored = localStorage.getItem("parkease_users");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return defaultUsers;
            }
        }
        localStorage.setItem("parkease_users", JSON.stringify(defaultUsers));
        return defaultUsers;
    };

    this.saveUsers = function (users) {
        localStorage.setItem("parkease_users", JSON.stringify(users));
    };
});