# LiveKit Agent Setup Guide

## Your Agent Configuration

- **Agent ID**: `CA_gara2oA52ZWe`
- **Agent Name**: `Blake_17c`

## How It Works

### 1. User Clicks "Start Call"
The following sequence happens:

1. **Generate Token**: Request to `/api/livekit-token` creates a secure access token
2. **Connect to Room**: User joins the LiveKit room `call-{userId}`
3. **Enable Microphone**: User's microphone is activated
4. **Dispatch Agent**: Request to `/api/dispatch-agent` tells LiveKit to send your agent to the room

### 2. Agent Dispatch Process

The `/api/dispatch-agent` endpoint:
- Creates the room if it doesn't exist
- Calls LiveKit's agent dispatch API
- Sends your agent name (`Blake_17c`) and room name
- Passes user metadata to the agent

### 3. Agent Joins Room

Your agent should:
- Be running and connected to LiveKit Cloud
- Listen for dispatch requests
- Join the specified room when dispatched
- Access participant metadata to get user information
- Start the voice conversation

## What You Need to Verify

### 1. Agent Deployment
Make sure your agent is:
- ✅ Deployed and running on LiveKit Cloud
- ✅ Configured with agent name: `Blake_17c`
- ✅ Listening for dispatch requests
- ✅ Has proper permissions to join rooms

### 2. Agent Configuration
Your agent should be set up to:
- Auto-join rooms when dispatched
- Access participant metadata
- Handle voice input/output
- Process payment collection conversations

### 3. LiveKit Cloud Settings
In your LiveKit Cloud dashboard:
- Verify agent `Blake_17c` is active
- Check agent deployment status
- Ensure agent has room join permissions
- Verify WebRTC settings are correct

## Troubleshooting

### Issue: "Connecting..." but agent never joins

**Root Cause:** Agent dispatch API returned 401 error. This means the agent needs to be configured to auto-join rooms instead of being manually dispatched.

**Solution:** Configure your agent `Blake_17c` to automatically join rooms matching pattern `call-*`

**See:** `AGENT_AUTO_JOIN_SETUP.md` for detailed configuration steps

**Quick Fix:**
1. Go to LiveKit Cloud Dashboard
2. Navigate to Agents → Blake_17c
3. Enable "Auto-join rooms matching pattern: call-*"
4. Save and restart agent
5. Test by clicking "Start Call" in the app

### Issue: Agent joins but no audio

**Possible causes:**
1. Microphone permissions not granted
2. Agent not publishing audio tracks
3. WebRTC connection issues

**Solutions:**
- Grant microphone permissions in browser
- Check agent is publishing audio
- Verify firewall/network settings

### Issue: Dispatch API fails

**Possible causes:**
1. Invalid API credentials
2. Agent doesn't exist
3. Network/CORS issues

**Solutions:**
- Verify `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`
- Check agent exists in LiveKit dashboard
- Review server logs for detailed errors

## Testing the Integration

### 1. Check Browser Console
Open DevTools and look for:
```
Connected to room
Agent dispatched successfully: {dispatchId: "...", agentName: "Blake_17c"}
Track subscribed: audio
```

### 2. Check Server Logs
Look for:
```
Agent dispatch failed: [status code]
```
or
```
Agent dispatched successfully
```

### 3. Check LiveKit Dashboard
- Go to your LiveKit Cloud dashboard
- Navigate to Rooms
- Find the room `call-{userId}`
- Verify both user and agent are participants

## Alternative: Auto-Join Configuration

If agent dispatch API doesn't work, you can configure your agent to auto-join rooms:

### Option 1: Room Pattern Matching
Configure your agent to automatically join any room matching pattern:
```
call-*
```

### Option 2: Webhook Trigger
Set up a webhook in LiveKit that triggers when a room is created:
- Room created → Webhook fired → Agent joins

### Option 3: Manual Agent Start
For testing, manually start your agent with room name:
```bash
# Example command (adjust based on your agent setup)
livekit-agent start --room call-{userId} --agent-name Blake_17c
```

## Next Steps

1. **Verify Agent Status**: Check LiveKit dashboard to ensure agent is running
2. **Test Connection**: Click "Start Call" and check browser console
3. **Monitor Logs**: Watch both browser and server logs for errors
4. **Test Audio**: Speak into microphone and verify agent responds
5. **Check Metadata**: Ensure agent receives user payment information

## API Endpoints Created

### POST `/api/livekit-token`
Generates access token for room connection

**Request:**
```json
{
  "roomName": "call-user123",
  "participantName": "agent-1234567890",
  "metadata": { "userId": "...", "userName": "..." }
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "url": "wss://riverline-1-09c9cmhp.livekit.cloud"
}
```

### POST `/api/dispatch-agent`
Dispatches agent to join room

**Request:**
```json
{
  "roomName": "call-user123",
  "agentName": "Blake_17c",
  "metadata": { "userId": "...", "userName": "..." }
}
```

**Response:**
```json
{
  "success": true,
  "dispatchId": "dispatch-123",
  "agentName": "Blake_17c",
  "roomName": "call-user123"
}
```

## Environment Variables

```env
# LiveKit Server
LIVEKIT_URL=wss://riverline-1-09c9cmhp.livekit.cloud

# API Credentials
LIVEKIT_API_KEY=APIBN8GBfGj6gQU
LIVEKIT_API_SECRET=YQ7vINiTSWpPn2vrvQYQbmvIke8HI6jx0dnKGaqwqyA

# Agent Configuration
LIVEKIT_AGENT_ID=CA_gara2oA52ZWe
LIVEKIT_AGENT_NAME=Blake_17c
```

## Support

If you continue to have issues:
1. Check LiveKit documentation: https://docs.livekit.io/agents/
2. Review agent logs in LiveKit dashboard
3. Test with LiveKit's example agents first
4. Verify your agent deployment is correct
