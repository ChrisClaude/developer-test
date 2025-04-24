using System;

namespace API.Services;

public class UserService : IUserService
{
    public Task<IEnumerable<UserDto>> GetUsersAsync()
    {
        throw new NotImplementedException();
    }
}
