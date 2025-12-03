# Riverline AI X Cred

Voice agents to assist in collecting credit card payments.

## What's Been Done

1. **Database Setup**
   - Set up PostgreSQL database with Prisma ORM
   - Created a User model to store customer payment information including username, phone, credit card number, bank, amount due, due month, overdue period, and call status

2. **API Endpoints**
   - **POST `/api/users`** - Create a new user with payment details
   - **GET `/api/users`** - Fetch all users (ordered by creation date)
   - **GET `/api/users/[id]`** - Fetch a specific user by ID
   - Handles validation for required fields and duplicate phone numbers
   - Returns proper error codes (400, 404, 409, 500)

3. **Dashboard UI**
   - Created a home page that displays all users in a table
   - Table shows: Username, Phone, Bank, Amount Due, Due Month, Overdue Days, Status, and an Action column
   - Added sorting functionality for Amount Due and Overdue Days columns (click to sort ascending/descending)
   - Status badges with color coding (yellow for pending, blue for calling, green for called)
   - "Agent Call" button on each row opens a dialog with complete user details
   - Dialog displays all user information before initiating a call

4. **UI Components**
   - Using shadcn/ui components (Table, Button, Dialog)
   - Styled with Tailwind CSS
   - Responsive design with modern look
   - Interactive dialog for reviewing user data before agent calls

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env` file with your database URL:
   ```
   DATABASE_URL="postgresql://..."
   ```

3. Push the database schema:
   ```bash
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## API Documentation

### Create User
**POST** `/api/users`

Create a new user with payment details.

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Doe",
    "phone": "+919876543210",
    "creditCardNumber": "4111111111111111",
    "bank": "HDFC",
    "amountDue": 15000.50,
    "dueMonth": "December 2024",
    "overduePeriodInDays": 30,
    "status": "pending"
  }'
```

**Response:** `201 Created` - Returns the created user object

### Get All Users
**GET** `/api/users`

Fetch all users ordered by creation date (newest first).

```bash
curl http://localhost:3000/api/users
```

**Response:** `200 OK` - Returns array of user objects

### Get User by ID
**GET** `/api/users/[id]`

Fetch a specific user by their ID.

```bash
curl http://localhost:3000/api/users/cmipp8cdw000084axwfnm7o94
```

**Response:** `200 OK` - Returns user object, or `404 Not Found` if user doesn't exist

## User Interface Features

- **Sortable Table**: Click on "Amount Due" or "Overdue Days" column headers to sort
- **Agent Call Dialog**: Click "Agent Call" button to view complete user details before initiating a call
- **Status Indicators**: Visual badges show user status (pending, calling, called)
- **Responsive Design**: Works on desktop and mobile devices
