public class CarDTO 
{
      public int Id {get;set;}
    public string? Brand {get;set;}
    public string? Model {get;set;}
    public int? Year {get;set;}
    public bool Reserved {get;set;}
    public Decimal Price {get;set;}

    public CarDTO() {}
    public CarDTO(Car carItem) =>
    (Id,Brand,Model,Price,Year) = (carItem.Id, carItem.Brand, carItem.Model, carItem.Price, carItem.Year);
}