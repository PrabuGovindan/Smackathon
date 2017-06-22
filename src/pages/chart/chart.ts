import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite } from "ionic-native";
import { Datapoint } from '../../../src/models/datapoint';
//import { AlertController, Loading, LoadingController } from 'ionic-angular';
//import { Chart } from './chart';
/**
 * Generated class for the Chart page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//declare var Chart: any;
//@IonicPage()
declare var jsforce: any;
declare var Chart: any;

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  public totproduct: number;
  public totqtysoldprd: number;
  public totprodsold: number;

  public campName: string;
  public database: SQLite;
  public dataitem: Array<Datapoint>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform) {
    this.dataitem = [];
    this.platform.ready().then(() => {
      this.database = new SQLite();
      this.database.openDatabase({ name: "Rbp.db", location: "default", createFromLocation: 1, existingDatabase: true }).then(() => {
        console.log("RBP DB connection Established.... ");
        this.dbdata();
      }, (error) => {
        console.log("ERROR: ", error);
      });
    });
  }

  ionViewDidLoad() {



  }

  public dbdata() {
    this.getdata().then((result) => {
      this.dataitem = <Array<Datapoint>>result;
      console.log("Length of people: ");
      if (this.dataitem.length > 0) {
        console.log("List of top 6 product")
        console.log(this.dataitem[0].ProCode + this.dataitem[1].Qty)
      }

    }, (error) => {
      console.log("ERROR: ", error);
    });

    this.totalsales().then((result) => {

      console.log("Total product List to campaign")
      console.log("Total product in camp :" + this.totproduct + "Total count sold :" + this.totqtysoldprd)


    }, (error) => {
      console.log("ERROR: ", error);
    });

    this.totalprod().then((result) => {
      console.log("Tot product sold ");
      console.log("Total product list sold" + this.totprodsold)


    }, (error) => {
      console.log("ERROR: ", error);
    });


  }


  public getdata() {

    return new Promise((resolve, reject) => {
      this.database.executeSql("Select [Account].[Name] Accname, [OpportunityLineItem].[OpportunityID], [OpportunityLineItem].Quantity,Product2.Name PN, Product2.[ProductCode] PC,campaign.[Name] campname from campaign join [Opportunity] on [Campaign].SFID =  [Opportunity].[CampaignId] join [OpportunityLineItem] on [Opportunity].SFID = [OpportunityLineItem].[OpportunityID] join product2 on [OpportunityLineItem].Product2Id = [Product2].SFID join Account on [Opportunity].AccountId = [Account].SFID where [Opportunity].[Type] != 'PULL' AND campaign.PricebookId= '01s24000000JK3TAAW' order by Quantity desc limit 6", []).then((data) => {
        //Select [Account].[Name] Accname, [OpportunityLineItem].[OpportunityID], [OpportunityLineItem].Quantity,Product2.Name, Product2.[ProductCode],campaign.[Name] campname from campaign join [Opportunity] on [Campaign].SFID =  [Opportunity].[CampaignId] join [OpportunityLineItem] on [Opportunity].SFID = [OpportunityLineItem].[OpportunityID] join product2 on [OpportunityLineItem].Product2Id = [Product2].SFID join Account on [Opportunity].AccountId = [Account].SFID where [Opportunity].[Type] != 'PULL' AND campaign.PricebookId= '01s0E0000004UM8QAM'
        let datapoint = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            datapoint.push({
              AcctName: data.rows.item(i).Accname,
              Qty: data.rows.item(i).Quantity,
              ProName: data.rows.item(i).PN,
              ProCode: data.rows.item(i).PC,
              CampName: data.rows.item(i).campname,

            });
            this.campName = data.rows.item(i).campname

            console.log("Account from DB: ", data.rows.item(i).Accname);
            console.log("Qty from DB: ", data.rows.item(i).Quantity);

          }
        }
        else {
          console.log("false");
        }
        resolve(datapoint);
      }, (error) => {
        reject(error);
      });
    });



  }

  public totalsales() {

    return new Promise((resolve, reject) => {
      this.database.executeSql("select count() sold from [Product2] join PriceBookEntry on Product2.SFID = PriceBookEntry.Product2 join PriceBook on PriceBookEntry.Pricebook2 = [PriceBook].[SFID] join FamilyProduct on Product2.FamilyProductId = FamilyProduct.SFID where  PriceBookEntry.Pricebook2 = '01s24000000JK3TAAW' union select  count() sold from [OpportunityLineItem] join [Opportunity] on [OpportunityLineItem].OpportunityId = [Opportunity].[SFID] join campaign on [Opportunity].campaignId = [Campaign].[SFID] where campaign.[SFID] = '70124000000WQVQAA4'", []).then((data) => {
        //select count() sold from [Product2] join PriceBookEntry on Product2.SFID = PriceBookEntry.Product2 join PriceBook on PriceBookEntry.Pricebook2 = [PriceBook].[SFID] join FamilyProduct on Product2.FamilyProductId = FamilyProduct.SFID where  PriceBookEntry.Pricebook2 = "01s24000000JK3TAAW" union select  count() Total from [OpportunityLineItem] join [Opportunity] on [OpportunityLineItem].OpportunityId = [Opportunity].[SFID] join campaign on [Opportunity].campaignId = [Campaign].[SFID] where campaign.[SFID] = "70124000000WQVQAA4"       

        if (data.rows.length > 0) {
          this.totproduct = data.rows.item(0).sold
          this.totqtysoldprd = data.rows.item(1).sold

        }
        else {
          console.log("false");
        }
        resolve(this.totqtysoldprd);
      }, (error) => {
        reject(error);
      });
    });



  }

  public totalprod() {

    return new Promise((resolve, reject) => {
      this.database.executeSql("select distinct [OpportunityLineItem].[Product2ID] from [OpportunityLineItem] join [Opportunity] on [OpportunityLineItem].OpportunityId = [Opportunity].[SFID] join campaign on [Opportunity].campaignId = [Campaign].[SFID] where campaign.[SFID] = '70124000000WQVQAA4'", []).then((data) => {
        //select distinct [OpportunityLineItem].[Product2ID] from [OpportunityLineItem] join [Opportunity] on [OpportunityLineItem].OpportunityId = [Opportunity].[SFID] join campaign on [Opportunity].campaignId = [Campaign].[SFID] where campaign.[SFID] = "70124000000WQVQAA4"
        if (data.rows.length > 0) {

          this.totprodsold = data.rows.length

        }
        else {
          console.log("false");
        }
        resolve(this.totprodsold);
      }, (error) => {
        reject(error);
      });
    });



  }

  public Display() {
    this.graphdisplay()

  }

  public graphdisplay() {

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], //ProCode AcctName
        labels: [this.dataitem[0].ProCode, this.dataitem[1].ProCode, this.dataitem[2].ProCode, this.dataitem[3].ProCode, this.dataitem[4].ProCode, this.dataitem[5].ProCode],
        datasets: [{
          label: 'Campaign Name : ' + this.campName,
          //data: [12, 19, 3, 5, 2, 3],
          data: [this.dataitem[0].Qty, this.dataitem[1].Qty, this.dataitem[2].Qty, this.dataitem[3].Qty, this.dataitem[4].Qty, this.dataitem[5].Qty],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },

      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }

      }

    });



    // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

    //   type: 'doughnut',
    //   data: {
    //     //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //     labels: [this.dataitem[0].ProCode, this.dataitem[1].ProCode, this.dataitem[2].ProCode, this.dataitem[3].ProCode, this.dataitem[4].ProCode, this.dataitem[5].ProCode],
    //     datasets: [{
    //       label: this.campName,
    //       // data: [12, 19, 3, 5, 2, 3],
    //       data: [this.dataitem[0].Qty, this.dataitem[1].Qty, this.dataitem[2].Qty, this.dataitem[3].Qty, this.dataitem[4].Qty, this.dataitem[5].Qty],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       hoverBackgroundColor: [
    //         "#FF6384",
    //         "#36A2EB",
    //         "#FFCE56",
    //         "#FF6384",
    //         "#36A2EB",
    //         "#FFCE56"
    //       ]
    //     }]
    //   }

    // });


      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        labels: ["Qty of Prod: " + this.totqtysoldprd, "Tot Product: " + this.totproduct, "Product sold: " + this.totprodsold, "Product Not sold: " + (this.totproduct - this.totprodsold)],
        datasets: [{
          label: this.totproduct,
          // data: [12, 19, 3, 5, 2, 3],
          data: [this.totqtysoldprd, this.totproduct, this.totprodsold, this.totproduct - this.totprodsold],
          backgroundColor: [
            'rgba(144,238,144, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(239, 239, 119, 0.8)',
             'rgba(255,122,136, 0.8)'
           
          ],
          hoverBackgroundColor: [
            "#32CD32",
            "#36A2EB",
            "#FFFF00",
            "#FF0A23"
            ]
        }]
      }

    });







  }

  public SFsync() {


    var syncstat: boolean = false;
    var nav = this.navCtrl;
    var chartmodule = this;

    callSyncfunc(function () {
      console.log('Pass2');
      chartmodule.graphdisplay();
    });

    function callSyncfunc(callback) {
      var conn;
      conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://test.salesforce.com'
      });
      // conn.login('romaric.decker@renault.com.afafsdev', 'Sodicam3XtxMqWeeXY1LkAPbxf6CcDoFl', function (err, res) {      
      conn.login('romaric.decker@renault.com.afafsdev', 'Sodicam3XtxMqWeeXY1LkAPbxf6CcDoFl', function (err, res) {

        //#region account
        // conn.sobject("account")
        //   .select('*')
        //   .limit(10)
        //   .execute(function (err, records) {
        //     //pgtext.innerHTML = "Account Record" + records.length;
        //     for (var i = 0; i < records.length; i++) {
        //       var accountrecord = records[i];
        //       // LoginPage.AddAccount(record.Id, record.Name, record.BillingStreet, record.BillingCountry, record.BillingCity, record.Id_Tresor__c, record.Phone, record.Type, record.Commercial_name__c, record.Usual_name__c, record.Client_account__c, record.R1_account__c, record.Status__c); //Id_Tresor__c Id Tresor
        //       console.log("account INSERTED ID: " + accountrecord.Id + "--" + accountrecord.Name + "--" + accountrecord.Client_account__c + "--" + accountrecord.R1_account__c);
        //     //  db.executeSql("INSERT INTO Account (SFID, Name,BillingStreet,BillingCountry,BillingCity,IdTresor,Phone,Type,CommercialName,RenaultName,ClientAccount,R1Account,Status) VALUES ('" + accountrecord.Id + "', '" + accountrecord.Name + "' ,'" + accountrecord.BillingStreet + "' ,'" + accountrecord.BillingCountry + "','" + accountrecord.BillingCity + "','" + accountrecord.Id_Tresor__c + "','" + accountrecord.Phone + "','" + accountrecord.Type + "','" + accountrecord.Commercial_name__c + "','" + accountrecord.Usual_name__c + "','" + accountrecord.Client_account__c + "','" + accountrecord.R1_account__c + "','" + accountrecord.Status__c + "'  )", []).then((data) => {
        //     //   //  console.log(" account INSERTED " + JSON.stringify(data));

        //     //   }, (error) => {
        //     //     console.log(" account ERROR: " + JSON.stringify(error.err));
        //     //   });

        //     }
        //    // elem1.style.width = 100 + '%';
        //     callback();
        //     if (err) {
        //       console.error(err);
        //       //LoginPage.executionstatus = "false";
        //     }
        //     else {
        //       // callback();
        //     }

        //   });
        //#endregion 

        //Join qry


        var records = [];
        conn.query("SELECT Account.Name,(SELECT Contact.Name FROM contacts) FROM Account limit 5", function (err, result) {
          if (err) { return console.error(err); }
          for (var i = 0; i < result.records.length; i++) {
            var record = result.records[i];
            console.log("total : " + result.records[i].contacts[1]);
            console.log("total : " + record.Name);
            for (var con = 0; con < record.contacts.length; con++) {
              var contactrec = record.contacts[con];
              console.log("total : " + contactrec.Name);
            }

          }
          console.log("total : " + result.totalSize);
          console.log("fetched : " + result.records.length);
          console.log("done ? : " + result.done);
          callback();
          if (!result.done) {
            // you can use the locator to fetch next records set.
            // Connection#queryMore()
            console.log("next records URL : " + result.nextRecordsUrl);
          }
        });

        //JOin qry end


      });


      console.log('Pass1');
    }
  } //sfsync 

}
