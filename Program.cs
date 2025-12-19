using StudentEnrollment.Shared;

var builder = WebApplication.CreateBuilder(args);

builder.Services.RegisterInfrastructureServices();
builder.Services.RegisterSecurityServices();
builder.Services.RegisterPersistenceServices(builder.Configuration);
builder.Services.RegisterApiServices();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi().AllowAnonymous();
    await app.InitializeDbAsync();
}

app.UseHttpsRedirection();

app.Run();

