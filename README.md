# Weather API 🌤️

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A scalable microservice-based weather API built with NestJS, featuring JWT authentication, role-based access control, and comprehensive query tracking.</p>

<p align="center">
  <strong>Developed by Ali Kumbul with ❤️</strong>
</p>

---

## 📋 Overview

This Weather API is built using **NestJS** technology in a **monorepo structure** following **microservice architecture** principles. The API provides weather information from OpenWeatherAPI with robust JWT and RBAC (Role-Based Access Control) authorization mechanisms, while tracking all user queries for analytics and monitoring purposes.

### 🎯 Key Features

- **Microservice Architecture**: Scalable and maintainable service separation
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and User role management
- **Query Tracking**: Comprehensive logging of all weather queries
- **Caching System**: Optimized performance with intelligent caching
- **Monorepo Structure**: Shared libraries and DRY principles
- **Container Ready**: Docker support for easy deployment
- **Kubernetes Ready**: Helm charts included for container orchestration

---

## 🏗️ Architecture

The API consists of **3 microservices**:

### 1. **Auth Service** (Port: 3000)

- **Primary Responsibility**: User authentication and authorization
- **Features**: JWT token generation, user CRUD operations, role management
- **Endpoints**: `/auth/*`, `/users/*`

### 2. **Weather Service** (Port: 3001)

- **Primary Responsibility**: Weather data retrieval and management
- **Features**: OpenWeatherAPI integration, caching, user query handling
- **Endpoints**: `/weather/*`

### 3. **Query Tracker Service** (Transport Layer Only)

- **Primary Responsibility**: Query logging and analytics
- **Features**: CRUD operations for query history, user activity tracking
- **Communication**: RabbitMQ transport layer only

### 🔗 Inter-Service Communication

- **Transport Layer**: RabbitMQ message broker
- **Shared Code**: Common library in project root following DRY principles
- **Scalability**: Each service designed for horizontal scaling

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd weather-api
```

2. **Start the application**

```bash
docker-compose up
```

That's it! 🎉 The application will automatically:

- Set up all required services (PostgreSQL, RabbitMQ, Redis)
- Run database migrations
- Seed default roles and admin user
- Start all microservices

### 🔑 Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

---

## 📚 API Documentation

### Base URLs

- **Auth Service**: `http://localhost:3000`
- **Weather Service**: `http://localhost:3001`

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### POST `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "roles": [
        {
          "id": 1,
          "name": "Admin"
        }
      ]
    }
  },
  "meta": {
    "timestamp": "2025-05-24T09:51:47.552Z",
    "path": "/auth/login",
    "method": "POST"
  }
}
```

### GET `/auth/me`

Get current user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "roles": [
      {
        "id": 1,
        "name": "Admin"
      }
    ]
  }
}
```

---

## 👥 User Management Endpoints (Admin Only)

### POST `/users`

Create a new user.

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "roles": ["User"] // Optional, defaults to "User"
}
```

### GET `/users`

Get all users.

**Headers:** `Authorization: Bearer <admin-token>`

### GET `/users/:id`

Get user by ID.

**Headers:** `Authorization: Bearer <admin-token>`

### PATCH `/users/:id`

Update user by ID.

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**

```json
{
  "email": "updated@example.com",
  "password": "newpassword123",
  "roles": ["Admin", "User"]
}
```

### DELETE `/users/:id`

Delete user by ID.

**Headers:** `Authorization: Bearer <admin-token>`

---

## 🌤️ Weather Endpoints

### GET `/weather?city={cityName}`

Get current weather for a city.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `city` (required): Name of the city

**Example Request:**

```
GET /weather?city=antalya
```

**Response:**

```json
{
  "success": true,
  "data": {
    "coord": {
      "lon": 30.7178,
      "lat": 36.7741
    },
    "weather": [
      {
        "id": 803,
        "main": "Clouds",
        "description": "broken clouds",
        "icon": "04d"
      }
    ],
    "main": {
      "temp": 34.33,
      "feels_like": 32.78,
      "temp_min": 34.22,
      "temp_max": 34.33,
      "pressure": 1009,
      "humidity": 24
    },
    "name": "Antalya Province"
  }
}
```

### GET `/weather/history`

Get current user's query history.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com"
    },
    "queryHistory": [
      {
        "id": 14,
        "userId": 1,
        "location": "Antalya Province",
        "temp": 34.33,
        "conditions": ["broken clouds"],
        "cached": false,
        "createdAt": "2025-05-24T10:23:27.187Z"
      }
    ]
  }
}
```

### GET `/weather/history/:userId` (Admin Only)

Get specific user's query history.

**Headers:** `Authorization: Bearer <admin-token>`

### GET `/weather/history/all` (Admin Only)

Get all users' query history.

**Headers:** `Authorization: Bearer <admin-token>`

---

## 🔧 Development

### Project Structure

```
weather-api/
├── apps/
│   ├── auth/                 # Authentication microservice
│   ├── weather/              # Weather microservice
│   └── query-tracker/        # Query tracking microservice
├── libs/
│   └── common/               # Shared libraries
├── helm/                     # Kubernetes Helm charts
├── docker-compose.yml        # Local development setup
└── README.md
```

### Running Individual Services

```bash
# Install dependencies
pnpm install

# Development mode
pnpm run start:dev auth      # Auth service
pnpm run start:dev weather   # Weather service
pnpm run start:dev query-tracker # Query tracker service

# Production mode
pnpm run start:prod auth
pnpm run start:prod weather
pnpm run start:prod query-tracker
```

### Testing

```bash
# Unit tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

---

## 🐳 Docker Deployment

### Local Development

```bash
docker-compose up -d
```

### Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## ☸️ Kubernetes Deployment

Helm charts are included in the `/helm` directory for easy Kubernetes deployment:

```bash
# Install with Helm
helm install weather-api ./helm/weather-api

# Upgrade deployment
helm upgrade weather-api ./helm/weather-api
```

---

## 🏛️ Why Microservice Architecture?

The microservice architecture was chosen for several strategic advantages:

### 🎯 **Scalability**

- **Independent Scaling**: Each service can be scaled based on its specific load requirements
- **Resource Optimization**: Allocate resources efficiently per service needs
- **Performance Isolation**: Issues in one service don't affect others

### 🚀 **Development & Deployment**

- **Independent Development**: Teams can work on different services simultaneously
- **Faster CI/CD**: Deploy services independently without affecting the entire system
- **Technology Flexibility**: Each service can use optimal technology stack
- **Easier Testing**: Focused unit and integration testing per service

### 🛡️ **Reliability & Maintenance**

- **Fault Isolation**: Failures are contained within individual services
- **Easier Debugging**: Simplified troubleshooting with service boundaries
- **Gradual Updates**: Update services incrementally without system downtime
- **Code Reusability**: Shared common library promotes DRY principles

### 📈 **Business Benefits**

- **Faster Time-to-Market**: Parallel development and deployment
- **Cost Efficiency**: Pay for what you use, scale what you need
- **Future-Proof**: Easy to add new features and services
- **Team Autonomy**: Independent service ownership and responsibility

---

## 🧪 Testing with Postman

Import the included Postman collection (`WeatherAPI.postman_collection.json`) to test all endpoints:

1. **Import Collection**: Import the JSON file into Postman
2. **Set Environment Variables**:
   - `auth-uri`: `http://localhost:3000/auth`
   - `users-uri`: `http://localhost:3000/users`
   - `weather-uri`: `http://localhost:3001/weather`
3. **Authenticate**: Use the login endpoint to get your JWT token
4. **Test Endpoints**: All endpoints are pre-configured with sample requests

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is [MIT licensed](LICENSE).

---

## 📧 Contact

**Ali Kumbul**

- Email: [alikumbul@windowslive.com](mailto:alikumbul@windowslive.com)
- LinkedIn: [alikumbul](https://www.linkedin.com/in/alikumbul)
- GitHub: [kumbulali](https://www.github.com/kumbulali)

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [OpenWeather API](https://openweathermap.org/api) - Weather data provider
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker
- [Docker](https://www.docker.com/) - Containerization platform

---

<p align="center">
  Made with ❤️ by Ali Kumbul
</p>
