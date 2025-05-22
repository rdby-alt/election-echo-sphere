
import { Election, Position, Candidate, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    department: 'Engineering',
    hasVoted: { '1': true }
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@company.com',
    department: 'Marketing',
    hasVoted: {}
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@company.com',
    department: 'Finance',
    hasVoted: { '1': true }
  },
];

export const mockElections: Election[] = [
  {
    id: '1',
    name: 'Board of Directors Election 2025',
    description: 'Annual election for the board of directors positions.',
    type: 'general',
    status: 'active',
    startDate: new Date('2025-05-20T00:00:00'),
    endDate: new Date('2025-05-25T23:59:59'),
    positions: [],
    createdAt: new Date('2025-05-01T10:00:00'),
    updatedAt: new Date('2025-05-01T10:00:00'),
  },
  {
    id: '2',
    name: 'Department Heads Election',
    description: 'Election for department head positions across all departments.',
    type: 'department',
    status: 'upcoming',
    startDate: new Date('2025-06-10T00:00:00'),
    endDate: new Date('2025-06-15T23:59:59'),
    positions: [],
    departments: ['Engineering', 'Marketing', 'Finance', 'HR'],
    createdAt: new Date('2025-05-15T14:30:00'),
    updatedAt: new Date('2025-05-15T14:30:00'),
  },
  {
    id: '3',
    name: 'Project Committee Selection',
    description: 'Selection of committee members for the new product launch project.',
    type: 'custom',
    status: 'draft',
    positions: [],
    customVotersList: ['user1@company.com', 'user2@company.com', 'user3@company.com'],
    createdAt: new Date('2025-05-18T09:15:00'),
    updatedAt: new Date('2025-05-18T09:15:00'),
  },
  {
    id: '4',
    name: 'Employee Welfare Representative',
    description: 'Election for employee welfare representative for 2025-2026.',
    type: 'general',
    status: 'ended',
    startDate: new Date('2025-04-05T00:00:00'),
    endDate: new Date('2025-04-10T23:59:59'),
    positions: [],
    createdAt: new Date('2025-03-20T11:45:00'),
    updatedAt: new Date('2025-04-11T09:00:00'),
  }
];

export const mockPositions: Position[] = [
  {
    id: '1',
    title: 'Chairman',
    description: 'Leads the board of directors and oversees company governance.',
    candidates: [],
    electionId: '1'
  },
  {
    id: '2',
    title: 'Vice Chairman',
    description: 'Assists the Chairman and acts in their absence.',
    candidates: [],
    electionId: '1'
  },
  {
    id: '3',
    title: 'Secretary',
    description: 'Maintains records and facilitates communication.',
    candidates: [],
    electionId: '1'
  },
  {
    id: '4',
    title: 'Engineering Department Head',
    description: 'Leads the engineering department.',
    candidates: [],
    electionId: '2'
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Michael Chen',
    slogan: 'Innovation through collaboration',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'With 15 years of experience in corporate leadership, Michael has led multiple successful initiatives.',
    positionId: '1',
    votes: 24
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    slogan: 'Building bridges to the future',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Sarah brings a wealth of international experience and strategic thinking to the table.',
    positionId: '1',
    votes: 18
  },
  {
    id: '3',
    name: 'David Williams',
    slogan: 'Leadership with integrity',
    imageUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
    bio: 'David has a proven track record of ethical leadership and business growth.',
    positionId: '2',
    votes: 31
  },
  {
    id: '4',
    name: 'Amanda Rodriguez',
    slogan: 'Empowering teams for success',
    imageUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
    bio: 'Amanda specializes in organizational development and team empowerment.',
    positionId: '2',
    votes: 27
  },
  {
    id: '5',
    name: 'Robert Kim',
    slogan: 'Transparency and efficiency',
    imageUrl: 'https://randomuser.me/api/portraits/men/91.jpg',
    bio: 'Robert focuses on transparent processes and operational efficiency.',
    positionId: '3',
    votes: 22
  },
  {
    id: '6',
    name: 'Lisa Patel',
    slogan: 'Unity through diversity',
    imageUrl: 'https://randomuser.me/api/portraits/women/75.jpg',
    bio: 'Lisa is passionate about inclusive leadership and diverse perspectives.',
    positionId: '3',
    votes: 29
  }
];

// Initialize relationships between elections, positions, and candidates
export const initializeMockData = () => {
  // Add positions to elections
  mockElections.forEach(election => {
    election.positions = mockPositions.filter(position => position.electionId === election.id);
  });

  // Add candidates to positions
  mockPositions.forEach(position => {
    position.candidates = mockCandidates.filter(candidate => candidate.positionId === position.id);
  });

  return {
    elections: mockElections,
    positions: mockPositions,
    candidates: mockCandidates,
    users: mockUsers
  };
};
