import { NextRequest, NextResponse } from "next/server";
import { RoomServiceClient } from "livekit-server-sdk";

export async function POST(request: NextRequest) {
  try {
    const { roomName, agentName, metadata } = await request.json();

    if (!roomName) {
      return NextResponse.json(
        { error: "roomName is required" },
        { status: 400 }
      );
    }

    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
      );
    }

    // Convert WebSocket URL to HTTP URL for API calls
    const httpUrl = livekitUrl.replace("wss://", "https://").replace("ws://", "http://");

    // Create RoomServiceClient
    const roomService = new RoomServiceClient(httpUrl, apiKey, apiSecret);

    // Create or get the room first
    try {
      const room = await roomService.createRoom({
        name: roomName,
        emptyTimeout: 300, // 5 minutes
        maxParticipants: 10,
      });
      console.log("Room created:", room.name);
    } catch (error) {
      // Room might already exist, which is fine
      console.log("Room may already exist:", error);
    }

    const finalAgentName = agentName || process.env.LIVEKIT_AGENT_NAME || "Blake_17c";

    // For LiveKit Cloud agents, the agent should auto-join when a participant enters
    // We'll return success and let the agent auto-join mechanism handle it
    console.log(`Room ${roomName} ready for agent ${finalAgentName}`);
    
    return NextResponse.json({
      success: true,
      message: "Room created successfully. Agent should auto-join.",
      roomName,
      agentName: finalAgentName,
      note: "Make sure your agent is configured to auto-join rooms with pattern: call-*",
    });
  } catch (error) {
    console.error("Error in dispatch-agent:", error);
    return NextResponse.json(
      { 
        error: "Failed to setup room for agent",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
