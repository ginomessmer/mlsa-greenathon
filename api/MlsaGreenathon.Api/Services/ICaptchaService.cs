using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MlsaGreenathon.Api.Services
{
    public interface ICaptchaService
    {
        public Task<bool> Verify(HttpRequest request);
    }
}
