using System;
using System.Threading.Tasks;
using BitArmory.ReCaptcha;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace MlsaGreenathon.Api.Services
{
    public class GoogleReCaptcha3Service : ICaptchaService
    {
        private readonly ReCaptchaService _captchaApi;
        private readonly GoogleRecaptchaOptions _options;

        public GoogleReCaptcha3Service(IOptions<GoogleRecaptchaOptions> options)
        {
            _captchaApi = new ReCaptchaService();
            _options = options.Value;
        }

        public async Task<bool> VerifyAsync(HttpRequest request)
        {
            var clientIp = request.HttpContext.Connection.RemoteIpAddress.ToString();
            var response = await _captchaApi.Verify3Async(_options.Token, clientIp, _options.SecretKey);
            return response.IsSuccess;
        }
    }
}