
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

app.MapGet("/caritems", async (CarDb db) =>
    await db.Cars.ToListAsync());

app.MapGet("/caritems/reserved", async (CarDb db) =>
    await db.Cars.Where(c => c.Reserved == true).ToListAsync());

app.MapGet("/caritems/{id}", async (int id, CarDb db) =>
{
    Car car = await db.Cars.FindAsync(id);
    if (car is not null) return  Results.Ok(car);
    else return Results.NotFound();
}
);

app.MapPost("/caritems", async (Car car, CarDb db) =>
{
    db.Cars.Add(car);
    await db.SaveChangesAsync();

    return Results.Created($"/caritems/{car.Id}", car);
} );

app.MapPut("caritems/{id}", async (int id, Car car, CarDb db) =>
{
    Car searchCar = await db.Cars.FindAsync(id);
    if (searchCar is null) return Results.NotFound();

    searchCar.Brand = car.Brand;
    searchCar.Model = car.Model;
    searchCar.Price = car.Price;
    searchCar.Reserved = car.Reserved;
    searchCar.Year = car.Year;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/caritems/{id}", async (int id, CarDb db) => 
{
    if (await db.Cars.FindAsync(id) is Car car)
    {
        db.Cars.Remove(car);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }return Results.NotFound();
});

app.Run();
