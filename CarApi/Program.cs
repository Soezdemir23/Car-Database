
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

//Json
builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.WriteIndented = true;
    options.SerializerOptions.IncludeFields = true;
});


//Database - In Memory
//builder.Services.AddDbContext<CarDb>(opt => opt.UseInMemoryDatabase("CarList"));
//builder.Services.AddDatabaseDeveloperPageExceptionFilter();

//Data - SQLITE
var connectionString = builder.Configuration.GetConnectionString("Car-Database") ?? "Data Source=Car-Database.db";
builder.Services.AddSqlite<CarDb>(connectionString);



//Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "CarAPI";
    config.Title = "CarAPI v1";
    config.Version = "v1";
});

var app = builder.Build();
// do thing if in Development environment:
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "CarAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

// GroupMapping API
var carItems = app.MapGroup("/caritems");

carItems.MapGet("/", GetAllCars);
carItems.MapGet("/reserved", GetReservedCars);
carItems.MapGet("/{id}", GetCarById);
carItems.MapPost("/", CreateNewCar);
carItems.MapPut("/{id}", UpdateCar);
carItems.MapDelete("/{id}",RemoveCarById);

static async Task<IResult> GetAllCars(CarDb db)
    => TypedResults.Ok
    (await db.Cars.Select(
        x => new CarDTO(x))
        .ToArrayAsync()
    );

static async Task<IResult> GetReservedCars(CarDb db) {
    List<Car> cars = await db.Cars.Where(c => c.Reserved == true).ToListAsync();
    List<Car> reservedCars = cars.Where(car => car.Reserved).ToList();
    return reservedCars.Count > 1 ? TypedResults.Ok(reservedCars): TypedResults.NotFound("All cars are freely available");
} 

static async Task<IResult> GetCarById(int id, CarDb db)
{
    return await db.Cars.FindAsync(id) 
        is Car car 
        ? TypedResults.Ok(new CarDTO(car)) 
        : TypedResults.NotFound("No Such car found");
}

static async Task<IResult> CreateNewCar(Car car, CarDb db){
    await db.Cars.AddAsync(car);
    await db.SaveChangesAsync();
    CarDTO itemDTO = new CarDTO(car);
    return  TypedResults.Created($"/caritems/{car.Id}", itemDTO);
}


static async Task<IResult> UpdateCar(int id, CarDTO inputCar, CarDb db){
    Car? car = await db.Cars.FindAsync(id);

    if (car is null) return TypedResults.NotFound($"The specificied car with the id {id} is not found: {car}");
    else {
        car.Brand = inputCar.Brand;
        car.Model = inputCar.Model;
        car.Price = inputCar.Price;
        car.Reserved = inputCar.Reserved;
        car.Year = inputCar.Year;
    }

    await db.SaveChangesAsync();
    return TypedResults.Ok($"Updates are succesful:\n {car}");
}

static async Task<IResult> RemoveCarById(int id, CarDb db){
    if (await db.Cars.FindAsync(id) is Car car){
        db.Cars.Remove(car);
        await db.SaveChangesAsync();
        return TypedResults.Ok("Removed");
    } return TypedResults.NotFound($"No such car found with id {id}.");
}

app.Run();
