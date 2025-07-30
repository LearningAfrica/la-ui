import type { LiveSession } from '@/lib/types/live-session';

// Mock data for live sessions based on real Zoom API data
export const mockLiveSessions: LiveSession[] = [
  {
    id: '1',
    title: "Felix Orinda's Instant Meeting",
    instructor: 'Felix Orinda',
    course: 'Instant Meeting',
    date: '2025-07-24',
    time: '07:21',
    duration: '60 minutes',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 100,
    meetingLink: 'https://us04web.zoom.us/j/77642471979?pwd=6E1v39MSPub2Z4NhOmFO5wISe8AFd5.1'
  },
  {
    id: '2',
    title: "Felix Orinda's Instant Meeting",
    instructor: 'Felix Orinda',
    course: 'Instant Meeting',
    date: '2025-07-24',
    time: '07:24',
    duration: '60 minutes',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 100,
    meetingLink: 'https://us04web.zoom.us/j/73275594647?pwd=zwcBdTqQBmLlyp3eJi7AjzMsm3Wa6H.1'
  },
  {
    id: '3',
    title: "Felix Orinda's Instant Meeting",
    instructor: 'Felix Orinda',
    course: 'Instant Meeting',
    date: '2025-07-24',
    time: '07:27',
    duration: '60 minutes',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 100,
    meetingLink: 'https://us04web.zoom.us/j/74874536623?pwd=u0aBAmczPFDU04QiLlbDFhYOm0PNzJ.1'
  },
  {
    id: '4',
    title: 'Test meeting For 3rd time',
    instructor: 'Felix Orinda',
    course: 'Test Course',
    date: '2025-07-24',
    time: '07:34',
    duration: '121 minutes',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 100,
    meetingLink: 'https://us04web.zoom.us/j/74098259185?pwd=CYbXSAPasXUY4PzuHQbY8aIPPH1Fm1.1'
  }
];

// Utility functions for sessions
export const getSessionsByStatus = (sessions: LiveSession[], status: LiveSession['status']) => {
  return sessions.filter(session => session.status === status);
};

export const getSessionById = (sessions: LiveSession[], id: string) => {
  return sessions.find(session => session.id === id);
};

export const convertToEmbedUrl = (meetingLink: string) => {
  // Convert various meeting link formats to embed URLs
  if (meetingLink.includes('zoom.us')) {
    // Zoom - convert to embed format
    return meetingLink.replace('/j/', '/j/embed/');
  } else if (meetingLink.includes('meet.google.com')) {
    // Google Meet
    return meetingLink.replace('/meet/', '/meet/embed/');
  } else if (meetingLink.includes('teams.microsoft.com')) {
    // Microsoft Teams
    return meetingLink.replace('/meetup-join/', '/meetup-join/embed/');
  }
  return meetingLink;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusBadgeVariant = (status: LiveSession['status']) => {
  const variants = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return variants[status];
};
