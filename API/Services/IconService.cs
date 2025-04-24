using System;

namespace API.Services;

public class IconService : IIconService
{
    public async Task<byte[]?> GetIconBytesAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return null;

        var iconsPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Icons");
        var iconPath = Path.Combine(iconsPath, $"{name}.png");

        if (!File.Exists(iconPath))
            return null;

        return await File.ReadAllBytesAsync(iconPath);
    }
}
