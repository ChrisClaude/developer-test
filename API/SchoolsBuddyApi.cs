using System;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API;

internal static class SchoolsBuddyApi
{
    public static RouteGroupBuilder MapSchoolBuddyApi(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("api");

        api.MapGet("/Users", GetUsersAsync);
        api.MapGet("/Icons/{name}", GetIconByNameAsync);

        return api;
    }

    public static async Task<Ok<IEnumerable<UserDto>>> GetUsersAsync(IUserService userService)
    {
        var users = await userService.GetUsersAsync();
        return TypedResults.Ok(users);
    }

    public static async Task<Ok<byte[]?>> GetIconByNameAsync(string name, IIconService iconService)
    {
        var icon = await iconService.GetIconBytesAsync(name);
        return TypedResults.Ok<byte[]?>(icon);
    }
}
