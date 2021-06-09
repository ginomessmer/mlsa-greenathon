using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MlsaGreenathon.Api.Services
{
    public class RecaptchaService : ICaptchaService
    {
        #region Implementation of ICaptchaService

        /// <inheritdoc />
        public Task<bool> Verify(HttpRequest request)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}