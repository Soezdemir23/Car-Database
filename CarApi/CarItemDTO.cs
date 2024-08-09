public class CarDTO
{
    public int Id { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Year { get; set; }
    public bool Reserved { get; set; }
    public Decimal Price { get; set; }

    public CarDTO() { }
    public CarDTO(Car carItem)
    {
        Id = carItem.Id;
        Brand = carItem.Brand;
        Model = carItem.Model;
        Price = carItem.Price;
        Year = ConvertDateForReturn(carItem.Year.ToString()!);
        Reserved = carItem.Reserved;
    }

    /**
     * "7/26/2024 12:00:00 AM" is splitted into three parts:
     * - 7/26/2024
     * - 12:00:00
     * - AM
     * 
     * Then we split the first part into three parts and assign them the values:
     * - var year
     * - var month
     * - var day
     * 
     * We can tthen return the date after converting it into the forrmat YYYY-MM-DDTHH:mm:ss.sssZ
     */
    private string ConvertDateForReturn(string date)
    {
        var dateAndHour = date.Split(" ");
        var toModifyDate = dateAndHour[0].Split("/");
        var toAddTime = dateAndHour[1];

        var year = toModifyDate[2];
        var month = toModifyDate[1].Length > 1? toModifyDate[1]: "0" + toModifyDate[1];
        var day = toModifyDate[0].Length > 1? toModifyDate[0]: "0" + toModifyDate[0];
        var toReturn = $"{year}-{month}-{day}T{toAddTime}.000Z";
        return toReturn;




    }
}