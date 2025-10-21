# Auth Service

Authentication microservice for the E-Commerce platform. Handles user registration, login, JWT authentication, and user management.

## 🚀 Features

- **User Authentication**: Registration, login, logout
- **JWT Tokens**: Access tokens and refresh tokens
- **Password Security**: Bcrypt hashing, password reset functionality
- **Role-Based Access**: Customer and Admin roles
- **Account Security**: Login attempt limiting, account locking
- **Event Publishing**: RabbitMQ integration for user events
- **Redis Integration**: Secure token storage
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive request validation
- **Health Checks**: Service and dependency monitoring

## 📋 Prerequisites

- Node.js 18+
- MongoDB
- RabbitMQ
- Redis
- Docker (optional)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   cd auth-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the service**
   ```bash
   npm run dev    # Development mode with hot reload
   npm start      # Production mode
   ```

### Docker

1. **Build the image**
   ```bash
   docker build -t auth-service .
   ```

2. **Run the container**
   ```bash
   docker run -p 3001:3001 --env-file .env auth-service
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3001 | No |
| `NODE_ENV` | Environment | development | No |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/auth_service | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h | No |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | Yes |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d | No |
| `RABBITMQ_URL` | RabbitMQ connection URL | amqp://localhost:5672 | No |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15min) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | No |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 | No |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 | No |

## 📚 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/forgot-password` | Request password reset |
| `POST` | `/auth/reset-password` | Reset password with token |
| `POST` | `/auth/verify` | Verify JWT token |

### Protected Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/logout` | User logout | Yes |
| `GET` | `/auth/profile` | Get user profile | Yes |
| `PUT` | `/auth/profile` | Update user profile | Yes |
| `PUT` | `/auth/change-password` | Change password | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/auth/users` | Get all users | Admin |
| `GET` | `/auth/users/:userId` | Get user by ID | Admin |
| `PUT` | `/auth/users/:userId` | Update user | Admin |
| `DELETE` | `/auth/users/:userId` | Deactivate user | Admin |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health status |

## 🔐 Authentication

### JWT Token Format

The service uses two types of JWT tokens:

1. **Access Token**: Short-lived (24h) for API access
2. **Refresh Token**: Long-lived (7d) for token renewal

### Request Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Verification

For internal service communication:

```http
X-Service-Token: <service_secret>
```

## 📊 Database Schema

### User Model

```typescript
interface User {
  email: string;           // Unique email address
  password: string;        // Hashed password
  firstName: string;       // User's first name
  lastName: string;        // User's last name
  role: UserRole;          // 'customer' or 'admin'
  isActive: boolean;       // Account status
  emailVerified: boolean;  // Email verification status
  lastLogin?: Date;        // Last login timestamp
  loginAttempts: number;   // Failed login attempts
  lockUntil?: Date;        // Account lock timestamp
  createdAt: Date;         // Account creation date
  updatedAt: Date;         // Last update date
}
```

## 🐰 RabbitMQ Events

The service publishes the following events:

| Event | Description | Data |
|-------|-------------|------|
| `user.created` | New user registered | User details |
| `user.updated` | User profile updated | Updated user details |
| `user.login` | User logged in | Login timestamp |
| `user.logout` | User logged out | User ID |
| `user.password_changed` | Password changed | User ID |
| `user.password_reset` | Password reset | User details |

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Environment

Tests use a separate MongoDB database and mock external services.

## 📈 Monitoring

### Health Check

The `/health` endpoint provides:

- Service status
- Database connectivity
- RabbitMQ connectivity
- Memory usage
- Uptime
- Version information

### Logging

Uses Winston for structured logging with:

- Request logging
- Error tracking
- Performance metrics
- Security events

## 🚨 Security Features

- **Password Hashing**: Bcrypt with configurable rounds
- **JWT Security**: Secure token generation and validation
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin policies
- **Helmet Security**: HTTP security headers
- **Account Locking**: Brute force protection
- **Token Invalidation**: Secure logout and password changes

## 🔄 Dependencies

### Core Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT handling
- `amqplib`: RabbitMQ client
- `redis`: Redis client
- `winston`: Logging

### Development Dependencies

- `typescript`: TypeScript compiler
- `nodemon`: Development server
- `jest`: Testing framework
- `eslint`: Code linting

## 🐳 Docker

### Build Image

```bash
docker build -t auth-service .
```

### Run Container

```bash
docker run -d \
  --name auth-service \
  -p 3001:3001 \
  --env-file .env \
  --network ecommerce-network \
  auth-service
```

### Docker Compose

```yaml
auth-service:
  build: .
  ports:
    - "3001:3001"
  environment:
    - MONGODB_URI=mongodb://mongo:27017/auth_service
    - RABBITMQ_URL=amqp://rabbitmq:5672
    - REDIS_URL=redis://redis:6379
  depends_on:
    - mongo
    - rabbitmq
    - redis
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Secure all secrets
2. **Database**: Use production MongoDB cluster
3. **RabbitMQ**: Production message broker
4. **Redis**: Production Redis cluster
5. **Monitoring**: Application performance monitoring
6. **Logging**: Centralized logging system
7. **Security**: HTTPS, firewall rules
8. **Scaling**: Horizontal scaling with load balancer

### Kubernetes

See the `k8s/` directory for Kubernetes manifests.

## 🤝 Contributing

1. Follow the coding standards
2. Write tests for new features
3. Update documentation
4. Submit pull requests

## 📝 License

MIT License - see LICENSE file for details.
