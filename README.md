# Aplicație de Înregistrare Studenți

## Cuprins

- [Cerințe de Sistem](#cerințe-de-sistem)
- [Instalare și Configurare](#instalare-și-configurare)
  - [1. Configurarea Proiectului](#1-configurarea-proiectului)
  - [2. Configurarea Bazei de Date](#2-configurarea-bazei-de-date)
  - [3. Configurarea Backend-ului](#3-configurarea-backend-ului)
  - [4. Configurarea Frontend-ului](#4-configurarea-frontend-ului)
- [Executarea Aplicației](#executarea-aplicației)
- [Arhitectură](#arhitectură)
- [Depanare](#depanare)

---

## Cerințe de Sistem

### Software Necesar

1. **Node.js** (versiunea 18.0 sau superioară)
   - Descărcare: https://nodejs.org/

2. **.NET SDK** (versiunea 10.0)
   - Descărcare: https://dotnet.microsoft.com/download/dotnet/10.0

3. **SQL Server** (una dintre următoarele opțiuni):
   - SQL Server 2022 sau versiunea ulterioară (instalare locală)
   - SQL Server 2022 (container Docker)

4. **Git** (pentru clonarea repository-ului)
   - Descărcare: https://git-scm.com/

---

## Instalare și Configurare

### 1. Configurarea Proiectului

Clonați repository-ul și navigați în directorul proiectului:

```bash
git clone https://github.com/madeandenis/StudentEnrollment.git
cd StudentEnrollment
```

---

### 2. Configurarea Bazei de Date

Sunt disponibile două opțiuni de deployment pentru serverul de baze de date.

#### Opțiunea A: SQL Server Express (Instalare Locală)

**Pasul 1: Instalarea SQL Server Express**

Descărcați și instalați SQL Server Express de pe site-ul oficial Microsoft.  
Porniți installerul și alegeți **Custom** (nu Basic).  

În timpul instalării:
- La **Instance Configuration**, selectați:
  - **Named instance:** `SQLEXPRESS`
- La **Database Engine Configuration**:
  - Selectați **Authentication Mode | Mixed Mode (SQL Server and Windows Authentication)**
  - Introduceți o parolă pentru contul **sa**, ex: `ParolaPuternica123!`
  - Apăsați **Add Current User** pentru a vă adăuga ca administrator SQL

Finalizați instalarea.

---

**Pasul 2: Conectarea la SQL Server folosind connection string**

După instalare, puteți testa conexiunea folosind următorul **connection string**:

Data Source=localhost,1433;
Initial Catalog=StudentEnrollmentDb;
Persist Security Info=False;
User ID=sa;
Password=ParolaPuternica123!;
Pooling=True;
MultipleActiveResultSets=True;
Encrypt=True;
TrustServerCertificate=True;
Application Name="StudentEnrollmentWebApp";
Command Timeout=30

- Notă: Connection string-ul trebuie introdus **într-o singură linie**, nu pe mai multe rânduri.  

Puteți folosi acest connection string direct în aplicații .NET, SSMS sau orice tool compatibil SQL Server.

---

#### Opțiunea B: SQL Server în Container Docker

**Pasul 1: Instalarea Docker**

Instalați Docker Desktop pentru sistemul dumneavoastră de operare:
- Windows/macOS: https://www.docker.com/products/docker-desktop
- Linux: https://docs.docker.com/engine/install/

**Pasul 2: Deployment Container SQL Server**

Executați următoarea comandă pentru a crea și porni containerul SQL Server:

**Linux/macOS:**
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=ParolaPuternica123!" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

**Windows PowerShell:**
```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=ParolaPuternica123!" `
   -p 1433:1433 --name sqlserver `
   -d mcr.microsoft.com/mssql/server:2022-latest
```

**Pasul 3: Verificarea Stării Containerului**

```bash
docker ps
```

Output-ul ar trebui să afișeze un container activ denumit `sqlserver`.

**Pasul 4: Gestionarea Containerului**

```bash
# Oprire container
docker stop sqlserver

# Pornire container existent
docker start sqlserver

# Ștergere container (datele vor fi pierdute)
docker rm -f sqlserver

# Vizualizare log-uri container
docker logs sqlserver
```

---

### 3. Configurarea Backend-ului

#### 3.1. Navigare în Directorul Backend

```bash
cd backend
```

#### 3.2. Restaurarea Pachetelor NuGet

```bash
dotnet restore
```

#### 3.3. Configurarea User Secrets

ASP.NET Core User Secrets oferă un mecanism securizat pentru stocarea datelor de configurare sensibile în timpul dezvoltării.

### 3.1. Contul SuperAdmin implicit

Aplicația creează automat un cont de SuperAdmin la primul startup:

- Email: `admin@local.test`
- Parolă: `ParolaPuternica123!`

Executați următoarele comenzi pentru a configura toate secretele necesare:

```bash
# Credențiale SuperAdmin
dotnet user-secrets set "SuAdmin:Email" "admin@local.test"
dotnet user-secrets set "SuAdmin:Password" "ParolaPuternica123!"

# Configurare JWT
dotnet user-secrets set "JwtSettings:TokenExpirationInMinutes" "60"
dotnet user-secrets set "JwtSettings:SecretKey" "CheiaTaSecretaComplexa"
dotnet user-secrets set "JwtSettings:RefreshTokenExpirationInDays" "7"
dotnet user-secrets set "JwtSettings:Authority" "https://localhost:7266"
dotnet user-secrets set "JwtSettings:Audience" "https://localhost:7266"

# Connection string bază de date
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Data Source=localhost,1433;Initial Catalog=StudentEnrollmentDb;Persist Security Info=False;User ID=sa;Password=ParolaPuternica123!;Pooling=True;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=True;Application Name=StudentEnrollmentWebApp;Command Timeout=30"
```

**Explicații:**
- `JwtSettings:TokenExpirationInMinutes` - durata de valabilitate a token-ului JWT principal (în minute).  
- `JwtSettings:SecretKey` - cheia secretă folosită pentru semnarea și validarea JWT-urilor; lungă, complexă și unică.  
- `JwtSettings:RefreshTokenExpirationInDays` - durata de valabilitate a refresh token-urilor (în zile).  
- `JwtSettings:Authority` - URL-ul aplicației/serverului care emite token-urile.  
- `JwtSettings:Audience` - destinatarii token-urilor; aplicația care le va consuma.
- `ConnectionStrings:DefaultConnection` - connection string-ul folosit pentru conexiunea la baza de date.

#### 3.4. Verificarea Configurării User Secrets

```bash
dotnet user-secrets list
```

Această comandă ar trebui să afișeze toate valorile secretelor configurate.

#### 3.5. Migrarea Bazei de Date

Aplicația este configurată să aplice automat migrările Entity Framework Core și să creeze contul de administrator la primul startup în modul Development.

Pentru aplicarea manuală a migrărilor:

```bash
# Listarea migrărilor existente
dotnet ef migrations list

# Aplicarea migrărilor în baza de date
dotnet ef database update
```

#### 3.6. Verificarea Fișierelor de Configurare

Asigurați-vă că `appsettings.Development.json` conține următoarea configurație:

```json
{
  "AllowedOrigins": [
    "http://localhost:5173",
    "https://localhost:5173"
  ],
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

---

### 4. Configurarea Frontend-ului

#### 4.1. Navigare în Directorul Frontend

```bash
cd ../frontend
```

#### 4.2. Instalarea Dependențelor

```bash
npm install
```

#### 4.3. Verificarea Configurării Vite

Fișierul `vite.config.ts` ar trebui să conțină următoarea configurație:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      overlay: true,
    },
    cors: true,
  },
})
```

#### 4.4. Configurarea Endpoint-ului API

Dacă backend-ul rulează pe un port diferit, actualizați URL-ul de bază al API în `src/lib/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'https://localhost:7266/api',
  // Configurație suplimentară...
});
```

---

## Executarea Aplicației

### Metoda 1: Executare Manuală (Recomandată pentru Dezvoltare)

Această metodă necesită două sesiuni de terminal separate.

#### Terminal 1: Server Backend

```bash
cd backend
dotnet run
```

Serverul backend va porni pe următoarele URL-uri:
- HTTPS: `https://localhost:7266`
- HTTP: `http://localhost:5266`

Documentația Swagger UI este disponibilă la: `https://localhost:7266`

#### Terminal 2: Server de Dezvoltare Frontend

```bash
cd frontend
npm run dev
```

Serverul de dezvoltare frontend va porni pe:
- `http://localhost:5173`

Accesați aplicația navigând la `http://localhost:5173` într-un browser web.

---

## Arhitectură

### Arhitectura Backend: Vertical Slice

Backend-ul implementează arhitectura Vertical Slice, organizând codul pe funcționalități în loc de straturi tehnice. Fiecare funcționalitate încapsulează toate componentele necesare pentru o capabilitate de business specifică.

```
backend/
├── Features/
│   ├── Auth/                    # Funcționalități autentificare
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Logout/
│   │   └── RefreshToken/
│   ├── Students/                # Gestionare studenți
│   │   ├── CreateStudent/
│   │   ├── GetStudentList/
│   │   ├── GetStudentDetails/
│   │   ├── UpdateStudent/
│   │   └── DeleteStudent/
│   ├── Courses/                 # Gestionare cursuri
│   │   ├── CreateCourse/
│   │   ├── GetCourseList/
│   │   ├── GetCourseDetails/
│   │   ├── UpdateCourse/
│   │   └── DeleteCourse/
│   ├── Enrollments/             # Gestionare înscrieri cursuri
│   │   ├── EnrollStudent/
│   │   ├── GetStudentEnrollments/
│   │   └── UnenrollStudent/
│   └── Common/                  # Configurări comune funcționalități
├── Shared/                      # Componente partajate între features
│   ├── Configuration/           # Extensii configurare servicii
│   │   ├── ServiceCollectionExtensions.cs
│   │   └── WebApplicationExtensions.cs
│   ├── Domain/                  # Entități și obiecte de domeniu
│   │   ├── Entities/            # Entități bază de date (Student, Course, Enrollment, etc.)
│   │   └── ValueObjects/        # Obiecte valoare (Address, etc.)
│   ├── ErrorHandling/           # Gestionare excepții globale
│   │   └── GlobalExceptionHandler.cs
│   ├── Persistence/             # Infrastructură bază de date
│   │   ├── ApplicationDbContext.cs
│   │   ├── ApplicationDbContextInitializer.cs
│   │   ├── Configurations/      # Configurări EF Core pentru entități
│   │   ├── Interceptors/        # Interceptori EF Core (audit, soft delete)
│   │   ├── Migrations/          # Migrări Entity Framework
│   │   └── Seeders/             # Date inițiale (admin, date test)
│   ├── Security/                # Securitate și autentificare
│   │   ├── Common/              # Clase comune securitate
│   │   ├── Configuration/       # Configurare Identity și JWT
│   │   ├── Policies/            # Politici autorizare personalizate
│   │   └── Services/            # Servicii securitate (CurrentUserService, etc.)
│   └── Utilities/               # Utilități generale
└── Program.cs                   # Punct de intrare aplicație
```

Fiecare slice de funcționalitate conține:
- `Endpoint.cs`: Definiție endpoint Minimal API
- `Handler.cs`: Implementare logică de business
- `Validator.cs`: Reguli FluentValidation
- `Models.cs`: DTO-uri request și response

### Arhitectura Frontend: Bazată pe Funcționalități

Frontend-ul urmează un pattern de organizare bazat pe funcționalități:

```
frontend/src/
├── features/                    # Funcționalități aplicație
│   ├── _common/                 # Componente și utilități partajate
│   │   ├── components/          # Componente UI reutilizabile
│   │   ├── hooks/               # Custom hooks comune
│   │   ├── types/               # Tipuri TypeScript partajate
│   │   └── utils/               # Funcții utilitate
│   ├── auth/                    # Autentificare și autorizare
│   ├── students/                # Gestionare studenți
│   ├── courses/                 # Gestionare cursuri
│   └── profile/                 # Profil utilizator
├── lib/                         # Biblioteci și configurări
│   ├── api.ts                   # Instanță Axios configurată
│   ├── auth-header.ts           # Gestionare header autentificare
│   ├── auto-refresh.ts          # Mecanism refresh automat token
│   └── token-store.ts           # Stocare în memorie token-uri
├── router.tsx                   # Configurare TanStack Router
├── App.tsx                      # Componentă rădăcină
└── main.tsx                     # Punct de intrare aplicație
```

Fiecare feature urmează pattern-ul:
- **Pagini** (`.tsx`): Componente pagină principale
- **Componente** (`components/`): Componente UI reutilizabile specifice feature-ului
- **API** (`api.ts`): Funcții pentru apeluri HTTP
- **Types** (`types.ts`): Interfețe și tipuri TypeScript
- **Hooks** (`use*.ts`): Custom hooks pentru logică și state management cu TanStack Query

---

## Depanare

### Probleme de Conexiune la Baza de Date

**Simptom**: Eroare "Cannot connect to SQL Server"

**Rezolvare**:
1. Verificați că serviciul SQL Server rulează (Windows Services sau container Docker)
2. Validați connection string-ul din user secrets
3. Testați conexiunea folosind SSMS sau Azure Data Studio
4. Pentru deployment-uri Docker: Executați `docker ps` pentru a confirma starea containerului

### Eșecuri de Autentificare

**Simptom**: Eroare "Login failed for user 'sa'"

**Rezolvare**:
1. Verificați că parola din connection string corespunde configurației SQL Server
2. Asigurați-vă că modul SQL Server Authentication este activat
3. Pentru deployment-uri Docker: Confirmați că parola containerului este `ParolaPuternica123!`

### Conflicte de Porturi

**Simptom**: Eroare "Port 1433 already in use"

**Rezolvare**:
1. Opriți alte instanțe SQL Server
2. Modificați portul în connection string și comanda Docker
3. Utilizați `netstat -ano | findstr :1433` (Windows) sau `lsof -i :1433` (Linux/macOS) pentru identificarea proceselor conflictuale

### Erori CORS

**Simptom**: Frontend-ul nu se poate conecta la backend

**Rezolvare**:
1. Verificați că backend-ul rulează pe `https://localhost:7266`
2. Verificați configurarea CORS în `appsettings.Development.json`
3. Validați `baseURL` în `src/lib/api.ts`
4. Acceptați certificatul HTTPS self-signed în browser

### Erori de Validare Token JWT

**Simptom**: Eroare "JWT token invalid"

**Rezolvare**:
1. Verificați că `JwtSettings:SecretKey` este configurat corect în user secrets
2. Asigurați-vă că valorile `Authority` și `Audience` corespund URL-ului backend-ului
3. Ștergeți storage-ul browser-ului și reautentificați-vă

### Probleme cu Migrările

**Simptom**: Migrările nu se aplică automat

**Rezolvare**:
1. Verificați că aplicația rulează în modul Development
2. Aplicați migrările manual: `dotnet ef database update`
3. Validați configurarea connection string-ului

---

## Referință Comenzi

### Comenzi Backend

```bash
# Restaurare pachete NuGet
dotnet restore

# Build proiect
dotnet build

# Rulare aplicație
dotnet run

# Rulare cu hot reload
dotnet watch run

# Creare migrare nouă
dotnet ef migrations add <NumeMigrare>

# Aplicare migrări
dotnet ef database update

# Rollback la migrare anterioară
dotnet ef database update <NumeMigrareAnterioara>

# Ștergere bază de date
dotnet ef database drop

# Listare user secrets
dotnet user-secrets list

# Ștergere toate user secrets
dotnet user-secrets clear

# Ștergere user secret specific
dotnet user-secrets remove "<CheieSecret>"
```

### Comenzi Frontend

```bash
# Instalare dependențe
npm install

# Pornire server dezvoltare
npm run dev

# Build pentru producție
npm run build

# Preview build producție
npm run preview

# Rulare linter
npm run lint
```

### Comenzi Docker (SQL Server)

```bash
# Pornire container
docker start sqlserver

# Oprire container
docker stop sqlserver

# Vizualizare containere active
docker ps

# Vizualizare toate containerele
docker ps -a

# Vizualizare log-uri container
docker logs sqlserver

# Urmărire log-uri container
docker logs -f sqlserver

# Conectare la CLI SQL Server
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'ParolaPuternica123!'

# Ștergere container
docker rm -f sqlserver

# Ștergere container și volume-uri
docker rm -f -v sqlserver
```
