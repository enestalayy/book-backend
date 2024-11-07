# Book Publisher API

A robust RESTful API built for managing books and authors, featuring comprehensive CRUD operations, authentication, and organized code structure. This project is designed with object-oriented principles focusing on modularity, maintainability, and clean code practices.

## 📚 Features

- **Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control for different user types
  - Protected routes and endpoints

- **Book Management**
  - Create, read, update, and delete books
  - Search and filter books by various parameters
  - Manage book metadata (title, ISBN, publication date, etc.)
  - Associate books with authors

- **Author Management**
  - Comprehensive author profile management
  - Track author's published works
  - Author biography and contact information

## 🏗 Architecture

The application follows a clean, layered architecture:

```
Route → Controller → Service → Database
```

- **Routes**: Define API endpoints and connect to controllers
- **Controllers**: Handle request/response logic and connect to services
- **Services**: Contain business logic and database operations
- **Models**: Define data schemas and relationships

## 💻 Technologies

- **Core**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication

- **Code Quality**
  - ESLint for code linting
  - Prettier for code formatting
  - Winston for logging
  - Helmet for security headers

- **Development**
  - Docker support
  - PM2 for process management
  - Compression for response optimization

## 🚀 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### Books
```
GET    /api/books       - Get all books
GET    /api/books/:id   - Get specific book
POST   /api/books       - Create new book
PATCH  /api/books/:id   - Update book
DELETE /api/books/:id   - Delete book
```

### Authors
```
GET    /api/authors       - Get all authors
GET    /api/authors/:id   - Get specific author
POST   /api/authors       - Create new author
PATCH  /api/authors/:id   - Update author
DELETE /api/authors/:id   - Delete author
```

## 🛠 Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/book-publisher-api.git
cd book-publisher-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Start the development server:
```bash
npm run dev
```

## 🐳 Docker Support

Build and run with Docker:

```bash
docker build -t book-publisher-api .
docker run -p 3000:3000 book-publisher-api
```

## 🔨 Base Classes

### Base Service
The project includes a Base Service class that implements common CRUD operations:

```javascript
class BookService extends BaseService {
  constructor(model) {
    super(model)
  }
  // Book-specific methods...
}
```

### Base Controller
Controllers extend from a Base Controller that handles standard operations:

```javascript
class BookController extends BaseController {
  constructor(service) {
    super(service)
  }
  // Book-specific controller methods...
}
```

## 📝 Environment Variables

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-publisher
JWT_SECRET=your-secret-key
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
