
using Microsoft.EntityFrameworkCore;
using NSwag.AspNetCore;


var builder = WebApplication.CreateBuilder(args);
//Database
builder.Services.AddDbContext<CarDb>(opt => opt.UseInMemoryDatabase("CarList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

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

static async Task<IResult> GetReservedCars(CarDb db)
    => TypedResults
    .Ok(await db.Cars.Where(c => c.Reserved == true)
        .Select(x => new CarDTO(x)).ToListAsync()
    );


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
    Car car = await db.Cars.FindAsync(id);

    if (car is null) return TypedResults.NotFound($"The specificied car {car} is not found");
    else {
        car.Brand = inputCar.Brand;
        car.Model = inputCar.Model;
        car.Price = inputCar.Price;
        car.Reserved = inputCar.Reserved;
        car.Year = inputCar.Year;
    }

    await db.SaveChangesAsync();
    return TypedResults.Ok("Updates are succesful");
}

static async Task<IResult> RemoveCarById(int id, CarDb db){
    if (await db.Cars.FindAsync(id) is Car car){
        db.Cars.Remove(car);
        return TypedResults.Ok("Removed");
    } return TypedResults.NotFound("No such car found");
}

app.Run();
