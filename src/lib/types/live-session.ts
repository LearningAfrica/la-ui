export interface LiveSession {
  id: string;
  host: {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
  };
  status: 'upcoming' | 'ongoing' | 'past';
  topic: string;
  start_time: string; // date-time format
  duration: number; // integer, duration in minutes
  join_url: string;
  created_at: string; // date-time format
  updated_at: string; // date-time format
}
