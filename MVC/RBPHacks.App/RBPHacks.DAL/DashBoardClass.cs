using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using sf = RBPHacks.DAL.ServiceReference;
namespace RBPHacks.DAL
{
    public class DashBoardClass
    {

        public void CampaignDetails(out string CampaignCountList, out string MonthYearNamesList, out string CampaignMonthwiseList, out string NumberCountList)
        {
            SfConnection sfconn = new SfConnection();
            sfconn.IsSalesforceClientInitialized();

            var sfCampaignlist = sfconn.GetRecordsFromSF<sf.Campaign>("Select Id,Name,StartDate, Enddate FROM Campaign Where IsDeleted = false");

            var noticesGrouped = sfCampaignlist.GroupBy(n => n.Name).
                        Select(group =>
                            new
                            {
                                NoticeName = group.Key,
                                Notices = group.ToList(),
                                Count = group.Count()
                            });

            var y = sfconn.GetRecordsFromSF<dynamic>("SELECT name,StartDate FROM Campaign Where IsDeleted = false group by StartDate ");

            var months = sfCampaignlist.AsEnumerable().Select(c => new
            {
                MonthId = c.StartDate.Value.Month,
                MonthName = string.Format("{0:MMMM}", c.StartDate),
                Year = string.Format("{0:yyyy}", c.StartDate),
                MonthYear = string.Format("{0:MMMM}", c.StartDate) + "-" + string.Format("{0:yyyy}", c.StartDate),
                Capname = c.Name,
                campid=c.Id
            }).ToList().OrderBy(c => c.Year).ThenBy(a => a.MonthId);


            var campaig = months.GroupBy(n => n.MonthYear).
                     Select(group =>
                         new
                         {
                             MonthYear = group.Key,
                             //Notices = group.ToList(),
                             Count = group.Count()
                         });

            var campaignMonwiseDetails = (from mon in months
                                          select new
                                          {
                                              campId=mon. campid,
                                              CampainName = mon.Capname,
                                              Monthyear = mon.MonthYear
                                          }).Where(x => x.Monthyear == "September-2015");


            List<int> num = new List<int>();
            num.Add(1);
            num.Add(1);

            var CampaignCount = (from temp in campaig
                                 select temp.Count).ToList();
            //var AccountNames = (from temp in l
            //                    select "'" + campaig.Name.Replace("'", "") + "'").Take(5).ToList();

            var MonthYearNames = (from temp in campaig
                                  select "'" + temp.MonthYear + "'").ToList();

            var CampaignMonthwise = (from temp in campaignMonwiseDetails
                                     select "'" + temp.CampainName + "'").ToList();

            CampaignCountList = string.Join(",", CampaignCount);
            MonthYearNamesList = string.Join(",", MonthYearNames);
            NumberCountList = string.Join(",", num);
            CampaignMonthwiseList = string.Join(",", CampaignMonthwise);
        }
        public void ProductSales(out string CampaignproductCountList, out string productsaleList)
        {
            SfConnection sfconn = new SfConnection();
            sfconn.IsSalesforceClientInitialized();
            var sfoppLinelist = sfconn.GetRecordsFromSF<sf.OpportunityLineItem>("SELECT Discount_Rate__c,Fleet_Rate__c,Id,LastModifiedDate,Net_Unit_Price__c,OpportunityId,Product2Id,PricebookEntryId,Quantity,Quantity_1__c,Quantity_2__c,Quantity_3__c,Quantity_4__c,Quantity_5__c,Quantity_6__c,Quantity_7__c,Quantity_8__c,Quantity_9__c,Quantity_10__c,Quantity_11__c,Quantity_12__c,Quantity_total__c,R1_Rate__c,R2_Rate__c,R3_Rate__c,Total_Net_Price__c,Type__c FROM OpportunityLineItem  WHERE  IsDeleted = false AND OpportunityId in (Select Id from Opportunity WHERE Tech_UpdateType__c != 'D') AND Tech_UpdateType__c != 'D' ");
            var sfopplist = sfconn.GetRecordsFromSF<sf.Opportunity>("Select Id, AccountId,CampaignId, Total_amount__c,Name FROM Opportunity Where IsDeleted = false and Tech_UpdateType__c != 'D' ");
       var sfCampaignlist = sfconn.GetRecordsFromSF<sf.Campaign>("Select Id,Name,StartDate, Enddate FROM Campaign Where IsDeleted = false");
       //var sfPricebookEntrylist = sfconn.GetRecordsFromSF<sf.PricebookEntry>("Select Id,Product2Id,Pricebook2Id FROM PricebookEntry  where Product2Id in (SELECT Id FROM Product2 where FamilyProductId__r.Family_animate_BtoB__c = true) AND IsDeleted = false AND IsActive = true");


       //var productwise = from oppline in sfoppLinelist
       //         join oppblist in sfopplist on oppline.OpportunityId equals oppblist.Id
       //         join camp in sfCampaignlist on oppblist.CampaignId equals camp.Id
       //         //join pbe in sfPricebookEntrylist on camp.Id equals pbe.Cam
       //         where camp.Id == "701260000000mmKAAQ"
       //         select new { oppline.Product2Id, oppline.Quantity };


            
       var productwise = from oppline in sfoppLinelist
                join oppblist in sfopplist on oppline.OpportunityId equals oppblist.Id
                join camp in sfCampaignlist on oppblist.CampaignId equals camp.Id
                //join pbe in sfPricebookEntrylist on camp.Id equals pbe.Cam
                         where camp.Id == "70126000000QAdfAAG"
                select new { oppblist.Id, oppblist.Total_amount__c,oppblist.Name};


       //var prdsum = productwise.GroupBy(n => n.).
       //        Select(group =>
       //            new
       //            {
       //                //MonthYear = group.Key,
       //                //Notices = group.ToList(),
       //                procode=group
       //                Count = group.Count()
       //            });

       var productwiseList = (from temp in productwise
                              select "'" + temp.Name.Replace("'", "") + "'").ToList();

       var CampaignproductCounteList = (from temp in productwise
                              select "'" + temp.Total_amount__c + "'").ToList();

       CampaignproductCountList = string.Join(",", CampaignproductCounteList);
       productsaleList = string.Join(",", productwiseList);
        }

        //public void ProductSales(out string CampaignCountList, out string AccountList)
        //{

        //    SfConnection sfconn = new SfConnection();
        //    sfconn.IsSalesforceClientInitialized();
        //    var productlist = sfconn.GetRecordsFromSF<sf.Product2>("Select Id, Name, ProductCode FROM Product2 Where FamilyProductId__c in (SELECT Id FROM Family_product__c where Family_animate_BtoB__c = true) AND IsDeleted = false");
        //    var PricebookEntrylist = sfconn.GetRecordsFromSF<sf.PricebookEntry>("Select Id,Product2Id,Pricebook2Id FROM PricebookEntry  where Product2Id in (SELECT Id FROM Product2 where FamilyProductId__r.Family_animate_BtoB__c = true) AND IsDeleted = false AND IsActive = true");

        //    var ss = from pl in productlist
        //             join pblist in PricebookEntrylist on pl.Id equals pblist.Product2Id
        //             select new { pl.Id ,pl.Name};
        //}
    }
}
