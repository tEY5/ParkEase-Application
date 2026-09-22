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

        public ActionResult AboutPage()
        {
            return View();
        }
    }
}