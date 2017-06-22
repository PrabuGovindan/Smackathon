export class Datapoint 
    {

  //public static Accounts: Array<Account>;
        constructor(Acctname, Qty,Proname,Procode,Campname,IdTresor,Phone,Type,CommercialName,RenaultName,ClientAccount,R1Account,Status){
        this.AcctName = Acctname;
        this.Qty = Qty;
         this.ProName = Proname;
        this.ProCode = Procode;
         this.CampName = Campname;
     
    }

     public  AcctName :string
        public  Qty :number
         public  ProName :string
        public  ProCode :string
         public  CampName :string
  
       


}
