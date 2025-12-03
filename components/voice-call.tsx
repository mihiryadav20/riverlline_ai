"use client";

import { useEffect, useState, useCallback } from "react";
// @ts-expect-error - livekit-client types issue with module resolution
import { Room, RoomEvent, Track } from "livekit-client";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";

interface VoiceCallProps {
  userId: string;
  userName: string;
  userPhone: string;
  userMetadata?: Record<string, string | number>;
  onCallEnd?: () => void;
}

export function VoiceCall({
  userId,
  userName,
  userPhone,
  userMetadata,
  onCallEnd,
}: VoiceCallProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Timer for call duration
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const cleanup = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
    }
    setIsConnected(false);
    setIsConnecting(false);
    setCallDuration(0);
    if (onCallEnd) {
      onCallEnd();
    }
  }, [room, onCallEnd]);

  const connectToRoom = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Generate room name based on user ID
      const roomName = `call-${userId}`;
      const participantName = `agent-${Date.now()}`;

      // Get token from API
      const response = await fetch("/api/livekit-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          participantName,
          metadata: {
            userId,
            userName,
            userPhone,
            ...userMetadata,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get access token");
      }

      const { token, url } = await response.json();

      // Create and connect to room
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event listeners
      newRoom.on(RoomEvent.Connected, () => {
        console.log("Connected to room");
        setIsConnected(true);
        setIsConnecting(false);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log("Disconnected from room");
        setIsConnected(false);
        cleanup();
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track: typeof Track.prototype) => {
        console.log("Track subscribed:", track.kind);
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          document.body.appendChild(audioElement);
        }
      });

      newRoom.on(RoomEvent.TrackUnsubscribed, (track: typeof Track.prototype) => {
        console.log("Track unsubscribed:", track.kind);
        track.detach().forEach((element: HTMLMediaElement) => element.remove());
      });

      // Connect to the room
      await newRoom.connect(url, token);

      // Enable microphone
      await newRoom.localParticipant.setMicrophoneEnabled(true);

      setRoom(newRoom);

      // Dispatch the agent to join the room
      try {
        const agentResponse = await fetch("/api/dispatch-agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName,
            agentName: "Blake_17c",
            metadata: {
              userId,
              userName,
              userPhone,
              ...userMetadata,
            },
          }),
        });

        if (!agentResponse.ok) {
          console.error("Failed to dispatch agent, but room connection successful");
        } else {
          const agentResult = await agentResponse.json();
          console.log("Agent dispatched successfully:", agentResult);
        }
      } catch (agentErr) {
        console.error("Error dispatching agent:", agentErr);
        // Don't throw here - room is already connected
      }
    } catch (err) {
      console.error("Error connecting to room:", err);
      setError(err instanceof Error ? err.message : "Failed to connect");
      setIsConnecting(false);
    }
  }, [userId, userName, userPhone, userMetadata, cleanup]);

  const toggleMute = useCallback(async () => {
    if (!room) return;

    try {
      const enabled = !isMuted;
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setIsMuted(!enabled);
    } catch (err) {
      console.error("Error toggling mute:", err);
    }
  }, [room, isMuted]);

  const endCall = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  if (!isConnected && !isConnecting) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
            {error}
          </div>
        )}
        <Button onClick={connectToRoom} className="w-full" size="lg">
          <Phone className="mr-2" size={18} />
          Start Call
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isConnecting && (
        <div className="text-center py-8">
          <div className="animate-pulse space-y-2">
            <Phone className="mx-auto" size={48} />
            <p className="text-sm text-muted-foreground">Connecting...</p>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-800 font-medium">Call Active</span>
            </div>
            <p className="text-2xl font-mono text-green-900">{formatDuration(callDuration)}</p>
            <p className="text-sm text-green-700 mt-2">Speaking with voice agent</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={toggleMute}
              variant={isMuted ? "destructive" : "outline"}
              className="flex-1"
              size="lg"
            >
              {isMuted ? (
                <>
                  <MicOff className="mr-2" size={18} />
                  Unmute
                </>
              ) : (
                <>
                  <Mic className="mr-2" size={18} />
                  Mute
                </>
              )}
            </Button>
            <Button onClick={endCall} variant="destructive" className="flex-1" size="lg">
              <PhoneOff className="mr-2" size={18} />
              End Call
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
