using System;

namespace MlsaGreenathon.Models
{
    public class Business : Entity
    {
        public string Name { get; set; }

        public string Industry { get; set; }

        public string LogoSource { get; set; }

        public string MissionStatement { get; set; }

        // Address
        public string AddressLine { get; set; }

        public string Town { get; set; }

        public string ZipCode { get; set; }

        public string CountryIsoCode { get; set; }

        // Position
        public double Longitude { get; set; }
        
        public double Latitude { get; set; }


        public bool IsApproved { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public Business(string countryIsoCode)
        {
            CountryIsoCode = countryIsoCode;
            PartitionKey = CountryIsoCode;
        }

        public Business()
        {
        }
    }
}