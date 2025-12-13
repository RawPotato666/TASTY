using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ----------- CONNECTION STRING -----------
// 1. prebere iz appsettings.json (ConnectionStrings:TastyConnection)
// 2. če je ni, prebere iz environment variable ConnectionStrings__TastyConnection (Docker)
var connectionString =
    builder.Configuration.GetConnectionString("TastyConnection")
    ?? builder.Configuration["ConnectionStrings__TastyConnection"];

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'TastyConnection' ni nastavljen. " +
        "Preveri appsettings.json ali environment variable ConnectionStrings__TastyConnection."
    );
}

// DB kontekst
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Controllers + JSON nastavitve (IgnoreCycles da ne crkne pri navigacijskih lastnostih)
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS – dev + produkcija
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost",
                "https://tastyweb.duckdns.org"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Swagger bom pustil vedno vklopljen (lažje debugiranje v Dockerju)
app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowFrontend");

// če bi imel auth, bi šlo tu app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
