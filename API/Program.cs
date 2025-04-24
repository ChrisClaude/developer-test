using API;
using API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IIconService, IconService>();

var app = builder.Build();

app.MapSchoolBuddyApi();

app.Run();
