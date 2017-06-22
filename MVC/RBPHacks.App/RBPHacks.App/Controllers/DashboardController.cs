using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RBPHacks.DAL;
namespace RBPHacks.App.Controllers
{
    public class DashboardController : Controller
    {
        //
        // GET: /Dashboard/



        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult BarChart()
        {
            try
            {
                DashBoardClass db = new DashBoardClass();
                string tempYearWise = string.Empty;
                string tempCampainCount = string.Empty;
                string tempCampainMonthWise = string.Empty;
                string tempNumberCount = string.Empty;

                db.CampaignDetails(out tempCampainCount, out tempYearWise, out tempCampainMonthWise, out tempNumberCount);

                ViewBag.MobileCount_List = tempCampainCount.Trim();

                ViewBag.Productname_List = tempYearWise.Trim();

                return View();
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpGet]
        public ActionResult DoughnutChart()
        {
            try
            {
                DashBoardClass db = new DashBoardClass();
                string tempYearWise = string.Empty;
                string tempCampainCount = string.Empty;
                string tempCampainMonthWise = string.Empty;
                string tempNumberCount = string.Empty;

                db.CampaignDetails(out tempCampainCount, out tempYearWise, out tempCampainMonthWise, out tempNumberCount);

                ViewBag.CampainMonthWise_List = tempCampainMonthWise.Trim();
                ViewBag.MobileCount_List = tempNumberCount.Trim();
                return View();
            }
            catch (Exception)
            {
                throw;
            }
        }

         [HttpGet]
        public ActionResult ProductDoughnutChart()
        {
            try
            {
                DashBoardClass db = new DashBoardClass();
                
                string tempCampaignCountList = string.Empty;
                string tempproductsaleWise = string.Empty;
                //string tempNumberCount = string.Empty;

                db.ProductSales(out tempCampaignCountList, out tempproductsaleWise);

                ViewBag.CampaignCount_List = tempCampaignCountList.Trim();
                ViewBag.productsaleWise_List = tempproductsaleWise.Trim();
                return View();
            }
            catch (Exception)
            {
                throw;
            }
        }

        
    }
}
