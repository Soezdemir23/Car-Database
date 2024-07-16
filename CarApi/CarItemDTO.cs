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
      Year = carItem.Year.ToString();
      Reserved = carItem.Reserved;

    }
}