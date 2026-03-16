export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'EXPERT' | 'ADMIN';
}

export interface ChatMessage {
  senderId: string;
  content: string;
  timestamp: string;
}

export type SessionStatus = 'connecting' | 'waiting' | 'active' | 'ended';
