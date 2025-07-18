FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["OnlineStore.AdminApi/OnlineStore.AdminApi.csproj", "OnlineStore.AdminApi/"]
RUN dotnet restore "OnlineStore.AdminApi/OnlineStore.AdminApi.csproj"
COPY . .
WORKDIR "/src/OnlineStore.AdminApi"
RUN dotnet build "./OnlineStore.AdminApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./OnlineStore.AdminApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OnlineStore.AdminApi.dll"]
