using System;
using System.Text.Json;

namespace API.Services;

public class UserService : IUserService
{
    public async Task<IEnumerable<UserDto>> GetUsersAsync()
    {
        var userDtos = new List<UserDto>();
        var usersPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Users");
        var files = Directory.GetFiles(usersPath, "*.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        foreach (var file in files)
        {
            using var stream = File.OpenRead(file);
            var user = await JsonSerializer.DeserializeAsync<User>(stream, options);

            if (user is null)
                continue;

            var iconPath = user.IconName is null
                ? "unknown"
                : user.IconName;

            userDtos.Add(new UserDto(
                user.Name,
                user.Age,
                user.Registered,
                user.Email,
                user.Balance,
                iconPath));
        }


        return userDtos;
    }
}
