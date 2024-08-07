public class CarDTO 
{
      public int Id {get;set;}
    public string? Brand {get;set;}
    public string? Model {get;set;}
    public string? Year {get;set;}
    public bool Reserved {get;set;}
    public Decimal Price {get;set;}

    public CarDTO() {}
    public CarDTO(Car carItem) {
      Id = carItem.Id;
      Brand = carItem.Brand;
      Model = carItem.Model;
      Price = carItem.Price;
      Year = ConvertDateForReturn(carItem.Year.ToString()!);
      Reserved = carItem.Reserved;
    }


    private string ConvertDateForReturn(string date)
    {
      var dateAndHour = date.Split(" ");
      var oldDateFormat = dateAndHour[0].Split(".");
      dateAndHour[0] = oldDateFormat[2] + "-" + oldDateFormat[1] + "-" + oldDateFormat[0];
      dateAndHour[0] += "T";
      dateAndHour[1] += ".000Z";
      return String.Join("",dateAndHour);
    }
}