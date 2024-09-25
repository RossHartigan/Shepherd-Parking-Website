using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace Shepherd_Parking_Website.Pages
{
    public class TestPage : PageModel
    {
        private readonly ILogger<TestPage> _logger;

        public TestPage(ILogger<TestPage> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}