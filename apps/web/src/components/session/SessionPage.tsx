'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';
import { ChatPanel } from './ChatPanel';
import { CallControls } from './CallControls';
import { SessionTimer } from './SessionTimer';
import { UserInfo, ChatMessage, SessionStatus } from './types';

interface SessionPageProps {
  roomId: string;
  lang: string;
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003').replace('/api/v1', '');
const PEERJS_HOST = process.env.NEXT_PUBLIC_PEERJS_HOST || 'localhost';
const PEERJS_PORT = Number(process.env.NEXT_PUBLIC_PEERJS_PORT || '9000');
const PEERJS_PATH = process.env.NEXT_PUBLIC_PEERJS_PATH || '/peer';
const PEERJS_SECURE = PEERJS_HOST !== 'localhost';

const DEFAULT_DURATION_MIN = 60;
const GRACE_PERIOD_MIN = 5;

export function SessionPage({ roomId, lang, scheduledStartTime, scheduledEndTime }: SessionPageProps) {
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<SessionStatus>('connecting');
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [sessionStart] = useState<Date>(new Date());

  useEffect(() => {
    const storedToken = localStorage.getItem('beep_token');
    const storedUser = localStorage.getItem('beep_user');
    if (!storedToken || !storedUser) {
      router.replace(`/${lang}/login`);
      return;
    }
    setToken(storedToken);
    setUser(JSON.parse(storedUser) as UserInfo);
  }, [lang, router]);

  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      callRef.current?.close();
      peerRef.current?.destroy();
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user || !token) return;
    const currentUser = user;

    let mounted = true;

    function attachRemoteStream(remoteStream: MediaStream) {
      if (!mounted) return;
      setStatus('active');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }

    function handleRemoteDisconnect() {
      if (!mounted) return;
      setStatus('ended');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    }

    function handleCall(call: MediaConnection) {
      call.on('stream', attachRemoteStream);
      call.on('close', handleRemoteDisconnect);
    }

    async function init() {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        const message = err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera and microphone access was denied. Please allow access and refresh.'
          : 'Could not access camera or microphone. Please check your device settings.';
        setMediaError(message);
        setStatus('ended');
        return;
      }

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = new Peer({
        host: PEERJS_HOST,
        port: PEERJS_PORT,
        path: PEERJS_PATH,
        secure: PEERJS_SECURE,
      });
      peerRef.current = peer;

      peer.on('open', (peerId: string) => {
        if (!mounted) return;

        const socket = io(`${API_URL}/session`, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
          if (!mounted) return;
          setStatus('waiting');
          socket.emit('join-room', {
            roomId,
            peerId,
            userId: currentUser.id,
            role: currentUser.role.toLowerCase() as 'expert' | 'client',
          });
        });

        socket.on('user-joined', (payload: { peerId: string; role: string }) => {
          if (!mounted) return;
          const outgoing = peer.call(payload.peerId, stream);
          callRef.current = outgoing;
          handleCall(outgoing);
        });

        socket.on('chat-message', (msg: ChatMessage) => {
          if (!mounted) return;
          setMessages((prev) => [...prev, msg]);
        });

        socket.on('user-left', handleRemoteDisconnect);
      });

      peer.on('call', (incoming: MediaConnection) => {
        incoming.answer(stream);
        callRef.current = incoming;
        handleCall(incoming);
      });

      peer.on('error', (err: Error) => {
        console.error('[PeerJS]', err);
      });
    }

    init().catch((err: unknown) => {
      console.error('[Session init]', err);
      setStatus('ended');
    });

    return () => {
      mounted = false;
    };
  }, [user, token, roomId]);

  const toggleMic = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  }, []);

  const toggleCam = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const endCall = useCallback(() => {
    socketRef.current?.emit('leave-room', { roomId });
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    callRef.current?.close();
    peerRef.current?.destroy();
    socketRef.current?.disconnect();
    setStatus('ended');
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  }, [roomId]);

  const handleSessionExpired = useCallback(() => {
    endCall();
  }, [endCall]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!user || !content.trim()) return;
      const trimmed = content.trim();
      socketRef.current?.emit('chat-message', {
        roomId,
        senderId: user.id,
        content: trimmed,
      });
      setMessages((prev) => [
        ...prev,
        { senderId: user.id, content: trimmed, timestamp: new Date().toISOString() },
      ]);
    },
    [roomId, user],
  );

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-950">
        <div className="text-ink-400 font-body text-sm">Loading...</div>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-ink-950 gap-6">
        <div className="w-16 h-16 rounded-2xl bg-ink-800 border-2 border-ink-700 flex items-center justify-center">
          <PhoneOffIcon className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-display font-bold text-white">Session ended</h2>
        <p className="text-ink-400 font-body text-sm">
          {mediaError ?? 'The video call has ended.'}
        </p>
        <button
          onClick={() => router.push(`/${lang}/dashboard`)}
          className="mt-2 px-6 py-2.5 rounded-full bg-peach-500 text-ink-950 font-bold text-sm border-2 border-ink-950 shadow-retro hover:-translate-y-0.5 hover:shadow-retro-md transition-all"
          aria-label="Back to Dashboard"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-ink-950 overflow-hidden">
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <SessionTimer
            startTime={scheduledStartTime ?? sessionStart}
            durationMin={
              scheduledStartTime && scheduledEndTime
                ? Math.round((scheduledEndTime.getTime() - scheduledStartTime.getTime()) / 60000)
                : DEFAULT_DURATION_MIN
            }
            graceMin={GRACE_PERIOD_MIN}
            onExpired={handleSessionExpired}
          />
        </div>

        <div className="absolute top-4 left-4 z-20">
          <StatusBadge status={status} />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-5xl rounded-2xl overflow-hidden border-2 border-ink-700 bg-ink-900">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              aria-label="Remote participant video"
              className="w-full h-full object-cover"
            />
            {status !== 'active' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-ink-800 border-2 border-ink-700 flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-10 h-10 text-ink-500" />
                  </div>
                  <p className="text-ink-400 font-body text-sm">
                    Waiting for the other participant to join...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-24 right-4 z-10">
          <div className="w-48 h-36 rounded-xl overflow-hidden border-2 border-ink-700 shadow-retro bg-ink-900 relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              aria-label="Your video"
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {!camOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-900">
                <CamOffIcon className="w-6 h-6 text-ink-500" />
              </div>
            )}
          </div>
        </div>

        <CallControls
          micOn={micOn}
          camOn={camOn}
          chatOpen={chatOpen}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
          onToggleChat={() => setChatOpen((prev) => !prev)}
          onToggleFullscreen={toggleFullscreen}
          onEndCall={endCall}
        />
      </div>

      {chatOpen && (
        <ChatPanel
          messages={messages}
          currentUserId={user.id}
          onSend={sendMessage}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: SessionStatus }) {
  const isActive = status === 'active';
  const label =
    status === 'connecting' ? 'Connecting...' :
    status === 'waiting' ? 'Waiting for other participant...' :
    'Connected';

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-ink-700 ${
        isActive ? 'bg-success-600 text-white' : 'bg-ink-800 text-ink-300'
      }`}
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  );
}

function PhoneOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CamOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
    </svg>
  );
}
