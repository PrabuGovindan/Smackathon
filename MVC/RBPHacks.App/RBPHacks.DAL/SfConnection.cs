using RBPHacks.DAL.ServiceReference;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;

namespace RBPHacks.DAL
{
    public class SfConnection
    {
        private SoapClient soapClient = null;
        private SessionHeader sessionHeader = null;

        public bool IsSalesforceClientInitialized()
        {

            string username = "romaric.decker@renault.com.afafsdev";
            string password = "Sodicam3XtxMqWeeXY1LkAPbxf6CcDoFl";

            var loginClient = new SoapClient("Soap");
            LoginResult loginResult = null;
            bool isInitialized = false;


            try
            {
                try
                {
                    loginResult = loginClient.login(null, username, password);
                }

                catch (Exception ex)
                {
                }

                if (loginResult != null)
                {
                    soapClient = new SoapClient("Soap", new EndpointAddress(loginResult.serverUrl));

                    sessionHeader = new SessionHeader() { sessionId = loginResult.sessionId };

                    isInitialized = true;
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                if (loginClient != null)
                {
                    loginClient.Close();
                }
            }

            return isInitialized;
        }
        public List<SFObject> GetRecordsFromSF<SFObject>(string sfQuery) where SFObject : class
        {
            var l = new List<SFObject>();

            try
            {
                QueryResult queryResult = null;
                bool done = false;

                soapClient.query(sessionHeader, null, null, null, sfQuery, out queryResult);

                if (queryResult.size > 0)
                {
                    while (!done)
                    {

                        foreach (var x in queryResult.records)
                        {
                            l.Add(x as SFObject);
                        }

                        if (queryResult.done)
                        {
                            done = true;
                        }
                        else
                        {
                            soapClient.queryMore(sessionHeader, null, queryResult.queryLocator, out queryResult);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return l;
        }
    }
}
