export interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: number;
  maxParticipants: number;
  meetingLink?: string;
  recordingLink?: string;
  description?: string;
}

export interface CreateSessionData {
  id?: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  maxParticipants: number;
  description?: string;
  meetingLink?: string;
}
