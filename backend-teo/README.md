# Medical Appointments API

A REST API for managing medical appointments, doctors, services, and patients.

## Features

- User/Patient management
- Doctor management
- Medical service management
- Appointment scheduling
- Swagger documentation

## Tech Stack

- Node.js and Express
- Supabase (PostgreSQL)
- Swagger for API documentation
- JWT for authentication

## Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Business logic
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   └── index.js         # Application entry point
├── swagger.yaml         # API documentation
├── supabase-schema.sql  # Database schema
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd medical-appointments-api
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

4. Create the database schema in Supabase
   - Go to your Supabase project
   - Navigate to the SQL Editor
   - Copy the contents of `supabase-schema.sql` and run the SQL

5. Start the development server
   ```
   npm run dev
   ```

6. Access the API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Scheduling

- `GET /scheduling` - Get all appointments
- `GET /scheduling/:id` - Get appointment by ID
- `POST /scheduling` - Create a new appointment
- `PUT /scheduling/:id` - Update appointment
- `DELETE /scheduling/:id` - Delete appointment

### Doctors

- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get doctor by ID
- `POST /doctors` - Create a new doctor

### Services

- `GET /services` - Get all services
- `GET /services/:id` - Get service by ID

## License

This project is licensed under the ISC License.

## Acknowledgments

- Supabase for the database
- Express.js team for the web framework
- Swagger for API documentation 