public interface IIconService
{
    Task<byte[]?> GetIconBytesAsync(string name);
}
