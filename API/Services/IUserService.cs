public interface IUserService
{
    Task<IEnumerable<UserDto>> GetUsersAsync();
}
