public class Car {
    public int Id {get;set;}
    public string? Brand {get;set;}
    public string? Model {get;set;}
    public DateTime? Year {get;set;}
    public bool Reserved {get;set;}
    public Decimal Price {get;set;}
    public string? Owner {get; set;}



public override string ToString() {
    return $"Id: {Id}, Brand: {Brand}, Model: {Model}, Year: {Year}, Reserved: {Reserved}, Price: {Price}";
}
}