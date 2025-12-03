# Agent Auto-Join Configuration Guide

## Problem
The agent dispatch API returned a 401 error, which means LiveKit Cloud may not have the dispatch endpoint enabled or requires different authentication.

## Solution: Configure Agent to Auto-Join

Your agent **Blake_17c** needs to be configured to automatically join rooms when they are created.

## Option 1: Configure in LiveKit Cloud Dashboard (RECOMMENDED)

### Steps:

1. **Go to LiveKit Cloud Dashboard**
   - Visit: https://cloud.livekit.io/
   - Login to your account

2. **Navigate to Agents**
   - Click on "Agents" in the sidebar
   - Find your agent: **Blake_17c** (ID: `CA_gara2oA52ZWe`)

3. **Configure Auto-Join Rules**
   - Click on your agent to edit settings
   - Look for "Room Join Rules" or "Auto-Join Configuration"
   - Add a rule to auto-join rooms matching pattern: `call-*`
   - Or configure to join ALL rooms automatically

4. **Set Agent Behavior**
   - Enable: "Auto-join when room is created"
   - Enable: "Auto-join when participant enters"
   - Set priority: High (so agent joins immediately)

5. **Save Configuration**

## Option 2: Configure in Agent Code

If you have access to your agent's source code, configure it to listen for room events:

```python
# Example for Python agent
from livekit import agents

@agents.on_room_created
async def on_room_created(room_name: str):
    if room_name.startswith("call-"):
        # Join the room
        await agent.join_room(room_name)

# Or configure to join all rooms
agent.auto_join = True
agent.room_pattern = "call-*"
```

```typescript
// Example for TypeScript/JavaScript agent
import { Agent } from '@livekit/agents';

const agent = new Agent({
  autoJoin: true,
  roomPattern: 'call-*',
  onRoomCreated: async (roomName) => {
    if (roomName.startsWith('call-')) {
      await agent.joinRoom(roomName);
    }
  }
});
```

## Option 3: Use Webhooks

Configure a webhook in LiveKit Cloud to trigger your agent:

### Steps:

1. **Go to LiveKit Cloud Dashboard → Settings → Webhooks**

2. **Create New Webhook**
   - Event: `room_started`
   - URL: Your agent's webhook endpoint
   - Filter: Room name starts with `call-`

3. **Agent Webhook Handler**
   Your agent should have an endpoint that receives:
   ```json
   {
     "event": "room_started",
     "room": {
       "name": "call-user123",
       "sid": "RM_xxxxx"
     }
   }
   ```

4. **Agent Joins Room**
   When webhook is received, agent joins the room

## Option 4: Manual Agent Dispatch via CLI

For testing, you can manually dispatch your agent:

```bash
# Using LiveKit CLI
livekit-cli agent dispatch \
  --url wss://riverline-1-09c9cmhp.livekit.cloud \
  --api-key APIBN8GBfGj6gQU \
  --api-secret YQ7vINiTSWpPn2vrvQYQbmvIke8HI6jx0dnKGaqwqyA \
  --agent-name Blake_17c \
  --room call-test123
```

## Verify Agent Configuration

### Check Agent Status:

1. **LiveKit Cloud Dashboard**
   - Go to Agents section
   - Check if Blake_17c shows as "Active" or "Running"
   - Look for recent activity logs

2. **Test Room Creation**
   - Create a test room: `call-test123`
   - Check if agent automatically joins
   - Look at room participants

3. **Check Agent Logs**
   - In LiveKit dashboard, view agent logs
   - Look for connection attempts
   - Check for any errors

## Current App Behavior

The app now:
1. ✅ Creates a LiveKit room: `call-{userId}`
2. ✅ User joins the room with microphone enabled
3. ⏳ **Waits for agent to auto-join**
4. ✅ Once agent joins, audio tracks are connected
5. ✅ User can talk to the agent

## What You Need to Do

**IMPORTANT**: Configure your agent Blake_17c to:
- ✅ Auto-join rooms with pattern `call-*`
- ✅ Start immediately when room is created
- ✅ Or join when first participant enters

## Testing After Configuration

1. **Configure agent auto-join** (see options above)

2. **Restart your agent** (if needed)

3. **Test the flow:**
   ```
   - Click "Start Call" in the app
   - Wait 2-3 seconds
   - Agent should join automatically
   - You should hear agent's voice
   - Speak into microphone to interact
   ```

4. **Check browser console:**
   ```
   Connected to room
   Room created successfully. Agent should auto-join.
   Track subscribed: audio  ← This means agent joined!
   ```

5. **If agent doesn't join:**
   - Check LiveKit dashboard for agent status
   - Verify agent is running
   - Check agent logs for errors
   - Ensure room pattern matches `call-*`

## Alternative: SIP Integration

If auto-join doesn't work, you can also:
- Configure agent to listen on a SIP endpoint
- Use LiveKit's SIP integration
- Call the agent via phone number

## Need Help?

If agent still doesn't join after configuration:

1. **Check LiveKit Documentation:**
   - https://docs.livekit.io/agents/
   - https://docs.livekit.io/guides/agent-dispatch/

2. **Contact LiveKit Support:**
   - Provide agent ID: `CA_gara2oA52ZWe`
   - Provide agent name: `Blake_17c`
   - Ask about auto-join configuration

3. **Check Agent Deployment:**
   - Ensure agent is deployed and running
   - Verify agent has correct credentials
   - Check agent has network access to LiveKit Cloud

## Summary

The 401 error means we can't manually dispatch the agent via API. Instead, configure your agent to **auto-join** rooms matching the pattern `call-*`. This is the recommended approach for LiveKit Cloud agents.
