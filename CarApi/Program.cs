
//using System.Runtime.CompilerServices;
//using System.Text.Json;
using Microsoft.EntityFrameworkCore;
//using YamlDotNet.Core.Tokens;


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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();




//Data - SQLITE
var connectionString = builder.Configuration.GetConnectionString("Car-Database") ?? "Data Source=Car-Database.db";
builder.Services.AddSqlite<CarDb>(connectionString);

// 1) define a unique string
string MyAllowSpecificOrigins = "_myallowSpecificOrigins";

//2) define allowed domains, in this case "http://cars-db.com" and "*" = all domains, for testing purposes only
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, builder => 
    {
         builder.WithOrigins(
            "http://localhost:4200",
            "https://soezdemir23.github.io/car-database/"
            )
        .AllowAnyHeader()
        .AllowAnyMethod(); 
    });
});


var app = builder.Build();

//// use the cors capability 
app.UseCors(MyAllowSpecificOrigins);

app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();


// GroupMapping API
var carItems = app.MapGroup("/cars");
app.MapGet("/", () => Results.Ok("Welcome to the Car API"));
carItems.MapGet("/", GetAllCars);
carItems.MapGet("/reserved", GetReservedCars);
carItems.MapGet("/{id}", GetCarById);
carItems.MapPost("/", CreateNewCar);
carItems.MapPut("/{id}", UpdateCar);
carItems.MapDelete("/{id}", RemoveCarById);

static async Task<IResult> GetAllCars(CarDb db)
{ 
    try
    {
        var cars = await db.Cars.ToArrayAsync();
        var carDTOs = cars.Select(x => new CarDTO(x)).ToArray();
        return TypedResults.Ok(carDTOs);
    } catch(HttpRequestException e) {
        return TypedResults.BadRequest($"Error occured: {e.Message}");

    }
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

        // there is really no need to check for null when it comes to the date. 
        car.Year = DateTime.Parse(inputCar.Year!);
        car.Brand = inputCar.Brand;
        car.Model = inputCar.Model;
        car.Price = inputCar.Price;
        car.Reserved = inputCar.Reserved;
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
