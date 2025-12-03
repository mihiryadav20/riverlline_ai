# LiveKit Voice Agent Integration Summary

## What Was Implemented

### 1. API Endpoint for Token Generation
**File**: `app/api/livekit-token/route.ts`

- Generates LiveKit access tokens for secure room connections
- Accepts `roomName`, `participantName`, and `metadata` parameters
- Returns token and LiveKit server URL
- Uses environment variables for API credentials

### 2. VoiceCall Component
**File**: `components/voice-call.tsx`

A comprehensive React component that handles:
- **Connection Management**: Connects to LiveKit rooms using generated tokens
- **Audio Streaming**: Automatically enables microphone and handles audio tracks
- **Call Controls**: 
  - Start Call button
  - Mute/Unmute toggle
  - End Call button
- **Call Status**: 
  - Connection state (connecting, connected, disconnected)
  - Real-time call duration timer
  - Visual indicators for active calls
- **Error Handling**: Displays connection errors to users
- **Metadata Passing**: Sends user payment information to the voice agent

### 3. Updated Users Table
**File**: `components/users-table.tsx`

- Integrated VoiceCall component into the existing dialog
- Removed static "Start Call" button
- Replaced with dynamic VoiceCall component
- Passes user data as metadata to the voice agent

## How to Use

### For End Users:
1. Click "Agent Call" button next to any user in the table
2. Review the user's payment details in the dialog
3. Click "Start Call" to connect to the voice agent
4. Speak with the AI agent about the payment
5. Use Mute/Unmute as needed during the call
6. Click "End Call" when finished

### For Developers:

#### Environment Setup
Ensure these variables are set in `.env`:
```env
LIVEKIT_URL=wss://your-server.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
LIVEKIT_AGENT_ID=CA_gara2oA52ZWe
LIVEKIT_AGENT_NAME=Blake_17c
```

#### Room Naming Convention
Rooms are created with the format: `call-{userId}`

Example: `call-cmipzf2jw0005unnu3rjsdezx`

#### Metadata Structure
The following data is passed to the voice agent:
```typescript
{
  userId: string;
  userName: string;
  userPhone: string;
  creditCardNumber: string;
  bank: string;
  amountDue: number;
  dueMonth: string;
  overduePeriodInDays: number;
}
```

## Technical Details

### Dependencies Added
- `livekit-server-sdk` - For server-side token generation
- Existing `livekit-client` - For client-side room connections

### Key Features
- **Secure Token Generation**: Tokens are generated server-side with proper permissions
- **Real-time Audio**: Uses WebRTC for low-latency voice communication
- **Adaptive Streaming**: Automatically adjusts quality based on network conditions
- **Dynacast**: Optimizes bandwidth usage
- **Automatic Cleanup**: Properly disconnects and cleans up resources

### Event Handling
The VoiceCall component listens to:
- `RoomEvent.Connected` - When successfully connected to room
- `RoomEvent.Disconnected` - When disconnected from room
- `RoomEvent.TrackSubscribed` - When audio track from agent is received
- `RoomEvent.TrackUnsubscribed` - When audio track is removed

## Voice Agent Requirements

Your LiveKit voice agent should:
1. Be deployed and listening on the LiveKit server specified in `LIVEKIT_URL`
2. Join rooms with the naming pattern `call-{userId}`
3. Access participant metadata to retrieve user information
4. Handle voice interactions for payment collection
5. Publish audio tracks for the user to hear

## Testing

1. Start the development server: `npm run dev`
2. Open the app at `http://localhost:3000`
3. Click "Agent Call" on any user
4. Click "Start Call" to initiate connection
5. Grant microphone permissions when prompted
6. Verify you can hear the voice agent
7. Test mute/unmute functionality
8. Test ending the call

## Troubleshooting

### "Failed to get access token"
- Check that `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set correctly
- Verify the API endpoint is accessible

### "Failed to connect"
- Ensure `LIVEKIT_URL` is correct and accessible
- Check that your LiveKit server is running
- Verify firewall/network settings allow WebRTC connections

### No audio from agent
- Ensure your voice agent is properly deployed
- Check that the agent is joining the correct room
- Verify the agent is publishing audio tracks

### Microphone not working
- Grant microphone permissions in browser
- Check browser console for permission errors
- Ensure microphone is not being used by another application
