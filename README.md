# Riverline AI X Cred

Voice agents to assist in collecting credit card payments.

## What's Been Done

1. **Database Setup**
   - Set up PostgreSQL database with Prisma ORM
   - Created a User model to store customer payment information including username, phone, credit card number, bank, amount due, due month, overdue period, and call status

2. **API Endpoints**
   - Built a POST endpoint (`/api/users`) to add new users to the database
   - Handles validation for required fields and duplicate phone numbers

3. **Dashboard UI**
   - Created a home page that displays all users in a table
   - Table shows: Username, Phone, Bank, Amount Due, Due Month, Overdue Days, Status, and an Action column
   - Added sorting functionality for Amount Due and Overdue Days columns (click to sort ascending/descending)
   - Status badges with color coding (yellow for pending, blue for calling, green for called)
   - Added "Agent Call" button on each row for initiating calls

4. **UI Components**
   - Using shadcn/ui components (Table, Button)
   - Styled with Tailwind CSS
   - Responsive design with modern look

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

## Adding Users

Use the POST endpoint to add users:

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
