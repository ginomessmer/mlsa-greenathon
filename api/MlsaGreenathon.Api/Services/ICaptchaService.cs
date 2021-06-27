using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MlsaGreenathon.Api.Services
{
    public interface ICaptchaService
    {
        Task<bool> VerifyAsync(HttpRequest request);
    }

    public static class CaptchaExtensions
    {
        public static async Task RequireVerificationAsync(this ICaptchaService captcha, HttpRequest request)
        {
            if (!await captcha.VerifyAsync(request))
                throw new Exception("Captcha not passed");
        }
    }
}
