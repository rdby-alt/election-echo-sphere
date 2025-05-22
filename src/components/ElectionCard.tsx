
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Election } from '@/types';
import { Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, format, isPast, isFuture } from 'date-fns';

interface ElectionCardProps {
  election: Election;
}

const ElectionStatusBadge: React.FC<{ status: Election['status'] }> = ({ status }) => {
  const badgeClasses = {
    draft: 'election-badge election-badge-draft',
    upcoming: 'election-badge election-badge-upcoming',
    active: 'election-badge election-badge-active',
    ended: 'election-badge election-badge-ended',
    published: 'election-badge election-badge-ended',
  };

  const statusText = {
    draft: 'Draft',
    upcoming: 'Upcoming',
    active: 'Active',
    ended: 'Ended',
    published: 'Published',
  };

  return <span className={badgeClasses[status]}>{statusText[status]}</span>;
};

const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
  const totalCandidates = election.positions.reduce(
    (acc, position) => acc + position.candidates.length,
    0
  );

  const getTimeInfo = () => {
    if (!election.startDate || !election.endDate) {
      return 'Dates not set';
    }

    const now = new Date();

    if (election.status === 'active') {
      return `Ends in ${formatDistanceToNow(election.endDate)}`;
    }
    
    if (election.status === 'upcoming') {
      return `Starts in ${formatDistanceToNow(election.startDate)}`;
    }

    if (election.status === 'ended' || election.status === 'published') {
      return `Ended ${formatDistanceToNow(election.endDate)} ago`;
    }

    return 'Draft';
  };

  const getElectionTypeLabel = (type: Election['type']) => {
    switch (type) {
      case 'general':
        return 'General Election';
      case 'department':
        return 'Department Election';
      case 'custom':
        return 'Custom Election';
      default:
        return 'Election';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <ElectionStatusBadge status={election.status} />
            <h3 className="text-lg font-semibold mt-2">{election.name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        {election.description && <p className="text-sm text-gray-600">{election.description}</p>}
        
        <div className="grid grid-cols-1 gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{getElectionTypeLabel(election.type)}</span>
          </div>
          
          {(election.startDate || election.endDate) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{getTimeInfo()}</span>
            </div>
          )}
          
          {election.positions.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{totalCandidates} candidates for {election.positions.length} positions</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/election/${election.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Election</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
