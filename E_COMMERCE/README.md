# Microservices E-Commerce Backend

A production-ready microservices-based E-Commerce backend built with Node.js, Express, MongoDB, and RabbitMQ.

## 🏗️ Architecture

- **Auth Service**: User authentication, JWT tokens, role management
- **Product Service**: Product CRUD, categories, inventory management
- **Cart Service**: Shopping cart operations, checkout process
- **Order Service**: Order management, status tracking
- **Payment Service**: Payment processing (Stripe/PayPal integration)
- **Notification Service**: Email/SMS notifications
- **API Gateway**: Request routing, rate limiting, authentication

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- MongoDB
- RabbitMQ
- Redis

### Running Locally
```bash
# Clone the repository
git clone <your-repo-url>
cd e-commerce-microservices

# Start all services
docker-compose up -d

# Or run services individually
cd auth-service && npm run dev
cd product-service && npm run dev
# ... etc
```

## 📁 Project Structure
```
├── auth-service/          # Authentication microservice
├── product-service/       # Product management microservice
├── cart-service/          # Shopping cart microservice
├── order-service/         # Order management microservice
├── payment-service/       # Payment processing microservice
├── notification-service/  # Notification microservice
├── api-gateway/           # API Gateway with routing
├── shared/                # Shared utilities and types
├── docker-compose.yml     # Local development setup
└── k8s/                  # Kubernetes manifests
```

## 🔧 Environment Variables

Each service has its own `.env` file. Copy `.env.example` to `.env` and configure:

- Database connections
- RabbitMQ settings
- Redis configuration
- JWT secrets
- API keys (Stripe, etc.)

## 🐳 Docker

Each service is containerized with its own Dockerfile. Use `docker-compose.yml` for local development.

## ☸️ Kubernetes

Kubernetes manifests are provided in the `k8s/` directory for production deployment.

## 📚 API Documentation

Each service exposes its own API endpoints. The API Gateway provides a unified interface.

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation
- Secure password hashing

## 🧪 Testing

```bash
# Run tests for a specific service
cd auth-service && npm test

# Run all tests
npm run test:all
```

## 📝 License

MIT License
