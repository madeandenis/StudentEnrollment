using StudentEnrollment.Features.Common.Configuration;
using StudentEnrollment.Shared.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.RegisterInfrastructureServices();
builder.Services.RegisterSecurityServices(builder.Configuration);
builder.Services.RegisterPersistenceServices(builder.Configuration);
builder.Services.RegisterApiServices();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi().AllowAnonymous();
    await app.InitializeDbAsync();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1Api");
        c.RoutePrefix = ""; 
    });
    app.MapGet("/swagger/v1/swagger.json", () => Results.Redirect("/swagger/v1/swagger.json"))
        .AllowAnonymous();
}

app.UseAuthentication(); 
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapAllEndpoints();

app.Run();