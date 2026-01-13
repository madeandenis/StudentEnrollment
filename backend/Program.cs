using StudentEnrollment.Features.Common.Configuration;
using StudentEnrollment.Shared.Configuration;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services.RegisterInfrastructureServices(configuration);
builder.Services.RegisterSecurityServices(configuration);
builder.Services.RegisterPersistenceServices(configuration);
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

app.UseCors("CorsPolicy");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapAllEndpoints();

app.Run();
