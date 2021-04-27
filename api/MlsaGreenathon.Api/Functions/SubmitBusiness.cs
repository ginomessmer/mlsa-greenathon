using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Web.Http;
using AzureMapsToolkit;
using AzureMapsToolkit.Search;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using MlsaGreenathon.Api.Requests;
using MlsaGreenathon.Models;
using Newtonsoft.Json;
using Exception = System.Exception;

namespace MlsaGreenathon.Api.Functions
{
    public class SubmitBusiness
    {
        private readonly IAzureMapsServices _azureMapsServices;

        public SubmitBusiness(IAzureMapsServices azureMapsServices)
        {
            _azureMapsServices = azureMapsServices;
        }

        [FunctionName("SubmitBusiness")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            [Table("Businesses", Connection = Defaults.DefaultStorageConnection)] CloudTable table,
            [Blob("logos/{rand-guid}", FileAccess.Write)] ICloudBlob logoBlob,
            [Queue("businesses", Connection = Defaults.DefaultStorageConnection)] ICollector<string> queue,
            ILogger log)
        {
            if (!req.HasFormContentType)
                return new BadRequestErrorMessageResult("Request must be form-data");

            var request = BindModel(req.Form);


            // Validate
            var validationResult = await new CreateBusinessDto.Validator().ValidateAsync(request);
            if (!validationResult.IsValid)
                return new BadRequestErrorMessageResult(validationResult.ToString());

            // Map
            var entity = Defaults.Mapper.Map<Business>(request);

            // Retrieve position
            try
            {
                await ApplyGeoPositionAsync($"{request.Name} {request.AddressLine} {request.ZipCode} {request.Town}",
                    entity);
            }
            catch
            {
                return new BadRequestErrorMessageResult("Couldn't find business");
            }

            // Upload logo to blob
            if (request.Logo != null)
                entity.LogoSource = (await UploadLogoAsync(request.Logo, logoBlob)).ToString();

            // Insert into table
            try
            {
                await table.ExecuteAsync(TableOperation.Insert(entity));
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Table insert operation failed");
                return new InternalServerErrorResult();
            }

            try
            {
                queue.Add(JsonConvert.SerializeObject(entity));
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Couldn't add business to queue");
            }

            return new OkResult(); // TODO: Return created at result
        }

        private async Task ApplyGeoPositionAsync(string query, Business entity)
        {
            var mapResponse = await _azureMapsServices.GetSearchAddress(new SearchAddressRequest {Query = query});

            if (!mapResponse.Result.Results.Any())
                throw new Exception("No suitable position found");

            var mapResult = mapResponse.Result.Results.First();
            entity.Latitude = mapResult.Position.Lat;
            entity.Longitude = mapResult.Position.Lon;
        }

        private static CreateBusinessDto BindModel(IFormCollection form) =>
            new CreateBusinessDto
            {
                Name = form["name"],
                Industry = form["industry"],
                MissionStatement = form["missionStatement"],
                AddressLine = form["addressLine"],
                Town = form["town"],
                CountryIsoCode = form["countryIsoCode"],
                ZipCode = form["zipCode"],
                Logo = form.Files.GetFile("logo")
            };

        private static async Task<Uri> UploadLogoAsync(IFormFile logo, ICloudBlob logoBlob)
        {
            await using var stream = logo.OpenReadStream();
            logoBlob.Properties.ContentType = logo.ContentType;
            await logoBlob.UploadFromStreamAsync(stream);
            return logoBlob.Uri;
        }
    }
}

