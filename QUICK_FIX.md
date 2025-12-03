# 🔧 Quick Fix: Agent Not Joining

## The Problem
```
Agent dispatch failed: 401 invalid authorization header. Must start with Bearer
```

## Why This Happens
The LiveKit agent dispatch API requires special configuration that may not be available in all LiveKit Cloud setups. The 401 error means we can't manually dispatch your agent via API.

## ✅ The Solution: Auto-Join Configuration

Your agent **Blake_17c** needs to be configured to **automatically join** rooms when they are created.

## 🚀 Quick Steps to Fix

### 1. Go to LiveKit Cloud Dashboard
Visit: https://cloud.livekit.io/

### 2. Navigate to Your Agent
- Click "Agents" in the sidebar
- Find agent: **Blake_17c** (ID: `CA_gara2oA52ZWe`)
- Click to open agent settings

### 3. Enable Auto-Join
Look for one of these settings:
- ✅ "Auto-join rooms"
- ✅ "Room join pattern"
- ✅ "Auto-dispatch rules"

Configure it to join rooms matching: `call-*`

### 4. Save and Restart
- Save the configuration
- Restart your agent if needed
- Wait 30 seconds for changes to take effect

### 5. Test It
- Go back to your app
- Click "Start Call" on any user
- Wait 2-3 seconds
- Agent should join automatically
- You should hear the agent's voice!

## 🎯 What the App Does Now

1. ✅ Creates room: `call-{userId}`
2. ✅ You join the room with microphone
3. ⏳ **Waits for agent to auto-join**
4. ✅ Agent joins (if configured correctly)
5. ✅ Audio tracks connect
6. ✅ You can talk to the agent!

## 🔍 How to Verify It's Working

### In Browser Console (F12):
```
Connected to room
Room created successfully. Agent should auto-join.
Track subscribed: audio  ← Agent joined! 🎉
```

### In LiveKit Dashboard:
- Go to "Rooms"
- Find room: `call-{userId}`
- Should see 2 participants:
  - Your user
  - Blake_17c (agent)

## ❌ If It Still Doesn't Work

### Check Agent Status:
1. Is agent showing as "Active" in dashboard?
2. Is agent deployed and running?
3. Does agent have correct credentials?

### Check Agent Configuration:
1. Room pattern matches `call-*`?
2. Auto-join is enabled?
3. Agent has room join permissions?

### Check Logs:
1. Browser console for errors
2. Server logs for room creation
3. Agent logs in LiveKit dashboard

## 📚 More Help

- **Detailed Guide**: See `AGENT_AUTO_JOIN_SETUP.md`
- **Full Setup**: See `AGENT_SETUP.md`
- **LiveKit Docs**: https://docs.livekit.io/agents/

## 💡 Alternative Solutions

If auto-join doesn't work:

### Option A: Webhook Trigger
Set up a webhook that triggers when room is created

### Option B: Manual Testing
Use LiveKit CLI to manually dispatch agent:
```bash
livekit-cli agent dispatch \
  --agent-name Blake_17c \
  --room call-test123
```

### Option C: Contact LiveKit Support
Provide them with:
- Agent ID: `CA_gara2oA52ZWe`
- Agent Name: `Blake_17c`
- Error: "401 invalid authorization header"

## ✨ Expected Behavior After Fix

1. Click "Start Call" → Room created
2. Wait 2-3 seconds → Agent auto-joins
3. Hear agent greeting → Start conversation
4. Talk about payment → Agent responds
5. Click "End Call" → Disconnect

That's it! The key is configuring your agent to auto-join rooms with pattern `call-*`.
