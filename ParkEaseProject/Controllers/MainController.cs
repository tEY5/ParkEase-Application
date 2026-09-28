using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ParkEaseProject.Controllers
{
    public class MainController : Controller
    {
        public ActionResult RegistrationPage()
        {
            return View();
        }

        public ActionResult LoginPage()
        {
            return View();
        }

        public ActionResult AboutPage()
        {
            return View();
        }

        public ActionResult ContactPage()
        {
            return View();
        }
        public ActionResult UserDashboardPage()
        {
            return View();
        }
        public ActionResult AdminDashboardPage()
        {
            return View();
        }

        public ActionResult HomePage()
        {
            ViewBag.WelcomeMessage = "Welcome to ParkEase Parking Management and Account Portal!";
            return View();
        }

        public string GetusernameFunc()
        {
            return "Hi";
        }
    }
}