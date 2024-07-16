
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using YamlDotNet.Core.Tokens;


var builder = WebApplication.CreateBuilder(args);

//Json
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.WriteIndented = true;
    options.SerializerOptions.IncludeFields = true;
});


//Database - In Memory
//builder.Services.AddDbContext<CarDb>(opt => opt.UseInMemoryDatabase("CarList"));
//builder.Services.AddDatabaseDeveloperPageExceptionFilter();

//Data - SQLITE
var connectionString = builder.Configuration.GetConnectionString("Car-Database") ?? "Data Source=Car-Database.db";
builder.Services.AddSqlite<CarDb>(connectionString);

// 1) define a unique string
string MyAllowSpecificOrigins = "_myallowSpecificOrigins";

// 2) define allowed domains, in this case "http://cars-db.com" and "*" = all domains, for testing purposes only
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, builder => 
    {
         builder.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod(); 
    });
});

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
// use the cors capability 
app.UseCors(MyAllowSpecificOrigins);

// GroupMapping API
var carItems = app.MapGroup("/cars");

carItems.MapGet("/", GetAllCars);
carItems.MapGet("/reserved", GetReservedCars);
carItems.MapGet("/{id}", GetCarById);
carItems.MapPost("/", CreateNewCar);
carItems.MapPut("/{id}", UpdateCar);
carItems.MapDelete("/{id}", RemoveCarById);

static async Task<IResult> GetAllCars(CarDb db)
{
    var cars = await db.Cars.ToArrayAsync();
    var carDTOs = cars.Select(x=> new CarDTO(x)).ToArray();
    return TypedResults.Ok(carDTOs);
}


static async Task<IResult> GetReservedCars(CarDb db)
{
    List<Car> cars = await db.Cars.Where(c => c.Reserved == true).ToListAsync();
    List<Car> reservedCars = cars.Where(car => car.Reserved).ToList();
    return reservedCars.Count > 1 ? TypedResults.Ok(reservedCars) : TypedResults.NotFound("All cars are freely available");
}

static async Task<IResult> GetCarById(int id, CarDb db)
{
    return await db.Cars.FindAsync(id)
        is Car car
        ? TypedResults.Ok(new CarDTO(car))
        : TypedResults.NotFound("No Such car found");
}

static async Task<IResult> CreateNewCar(Car car, CarDb db)
{
    
    await db.Cars.AddAsync(car);
    await db.SaveChangesAsync();
    CarDTO itemDTO = new CarDTO(car);
    return TypedResults.Created($"/caritems/{car.Id}", itemDTO);
}


static async Task<IResult> UpdateCar(int id, CarDTO inputCar, CarDb db)
{
    Car? car = await db.Cars.FindAsync(id);

    if (car is null) return TypedResults.NotFound($"The specificied car with the id {id} is not found: {car}");
    else
    {
        Console.ForegroundColor = ConsoleColor.Blue;
        Console.WriteLine(inputCar.Year);
        Console.WriteLine(inputCar.Reserved);
        Console.ResetColor();
        // int[] yyyymmdd = inputCar.Year!.Split("-")
        //     .Select(x => Int32.Parse(x))
        //     .ToArray();
        car.Year = DateTime.Parse(inputCar.Year);
        car.Brand = inputCar.Brand;
        car.Model = inputCar.Model;
        car.Price = inputCar.Price;
        car.Reserved = inputCar.Reserved;
        
        // car.Year = new DateTime(yyyymmdd[0], yyyymmdd[1], yyyymmdd[2]);
    }

    await db.SaveChangesAsync();
    return TypedResults.Ok($"Updates are succesful:\n {car}");
}

static async Task<IResult> RemoveCarById(int id, CarDb db)
{
    if (await db.Cars.FindAsync(id) is Car car)
    {
        db.Cars.Remove(car);
        await db.SaveChangesAsync();
        return TypedResults.Ok("Removed");
    }
    return TypedResults.NotFound($"No such car found with id {id}.");
}

app.Run();
