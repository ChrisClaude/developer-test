using API;
using API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IIconService, IconService>();

var policyName = "allowClient";

builder.Services.AddCors(options =>
        {
            options.AddPolicy(policyName,
                b =>
                {
                    var appSettings = builder.Configuration
                        .GetSection("AllowedCorsOrigins").Get<string[]>();

                    if (appSettings != null)
                    {
                        b.WithOrigins(appSettings);
                    }

                    b.AllowAnyHeader()
                           .AllowAnyMethod();
                });
        });

var app = builder.Build();

app.MapSchoolBuddyApi();

app.UseCors(policyName);
app.Run();
