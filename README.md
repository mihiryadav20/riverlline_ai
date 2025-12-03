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
   - **POST `/api/livekit-token`** - Generate LiveKit access tokens for voice calls
   - Handles validation for required fields and duplicate phone numbers
   - Returns proper error codes (400, 404, 409, 500)

3. **Dashboard UI**
   - Created a home page that displays all users in a table
   - Table shows: Username, Phone, Bank, Amount Due, Due Month, Overdue Days, Status, and an Action column
   - Added sorting functionality for Amount Due and Overdue Days columns (click to sort ascending/descending)
   - Status badges with color coding (yellow for pending, blue for calling, green for called)
   - "Agent Call" button on each row opens a dialog with complete user details
   - Dialog displays all user information before initiating a call

4. **LiveKit Voice Agent Integration**
   - Integrated LiveKit voice agent for real-time voice calls
   - Click "Start Call" button to connect to the voice agent
   - Real-time call duration tracking
   - Mute/unmute functionality during calls
   - End call button to disconnect
   - Automatic microphone access and audio streaming
   - User metadata (credit card info, amount due, etc.) passed to the agent

5. **UI Components**
   - Using shadcn/ui components (Table, Button, Dialog)
   - Styled with Tailwind CSS
   - Responsive design with modern look
   - Interactive dialog for reviewing user data before agent calls
   - Custom VoiceCall component for managing LiveKit connections

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env` file with your database URL and LiveKit credentials:
   ```
   DATABASE_URL="postgresql://..."
   LIVEKIT_URL="wss://your-livekit-server.livekit.cloud"
   LIVEKIT_API_KEY="your-api-key"
   LIVEKIT_API_SECRET="your-api-secret"
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

## How Voice Agent Integration Works

1. **Click "Agent Call"**: Opens a dialog showing the user's complete payment details
2. **Click "Start Call"**: 
   - Generates a LiveKit access token with user metadata
   - Connects to your LiveKit voice agent room
   - Enables your microphone for voice interaction
   - The voice agent receives user context (name, phone, amount due, etc.)
3. **During the Call**:
   - Real-time call duration is displayed
   - Mute/unmute your microphone as needed
   - The agent can access user metadata to personalize the conversation
4. **End Call**: Click "End Call" to disconnect and close the dialog

### Voice Agent Setup

Your LiveKit voice agent should be configured to:
- Listen for incoming connections on the LiveKit server
- Access participant metadata to get user information
- Handle voice interactions for payment collection
- The room name format is: `call-{userId}`

### Metadata Passed to Agent

When a call starts, the following metadata is sent to the voice agent:
```json
{
  "userId": "user-id",
  "userName": "User Name",
  "userPhone": "+1234567890",
  "creditCardNumber": "****1234",
  "bank": "Bank Name",
  "amountDue": 15000.50,
  "dueMonth": "December 2026",
  "overduePeriodInDays": 10
}
```
