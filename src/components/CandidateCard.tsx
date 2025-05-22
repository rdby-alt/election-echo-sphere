
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Candidate } from '@/types';
import { useElectionContext } from '@/contexts/ElectionContext';

interface CandidateCardProps {
  candidate: Candidate;
  electionId: string;
  positionId: string;
  showVoteButton?: boolean;
  isWinner?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  electionId, 
  positionId, 
  showVoteButton = false,
  isWinner = false
}) => {
  const { castVote, currentUser, currentElection } = useElectionContext();

  const handleVote = () => {
    castVote(electionId, positionId, candidate.id);
  };
  
  const canVote = showVoteButton && currentUser && (!currentUser.hasVoted || !currentUser.hasVoted[electionId]);
  
  const showResults = currentElection?.status === 'published';

  return (
    <Card className={`candidate-card relative ${isWinner ? 'ring-2 ring-election-accent' : ''} h-full`}>
      {isWinner && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-election-accent text-black px-2 py-1 rounded-full text-xs font-bold">
            Winner
          </span>
        </div>
      )}
      <div className="overflow-hidden">
        <img 
          src={candidate.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
          alt={candidate.name} 
          className="candidate-avatar h-48 w-full object-cover object-center"
        />
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg">{candidate.name}</h3>
        {candidate.slogan && (
          <p className="text-sm italic text-gray-600">"{candidate.slogan}"</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        {candidate.bio && (
          <p className="text-sm text-gray-700 mb-4">{candidate.bio}</p>
        )}
        
        {showResults && typeof candidate.votes !== 'undefined' && (
          <div className="mt-auto">
            <div className="text-center font-bold text-lg">
              {candidate.votes} {candidate.votes === 1 ? 'vote' : 'votes'}
            </div>
            <div className="w-full bg-gray-200 h-2 mt-1 rounded-full">
              <div 
                className={`h-2 rounded-full ${isWinner ? 'bg-election-accent' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(candidate.votes * 5, 100)}%` }}  
              ></div>
            </div>
          </div>
        )}
        
        {canVote && (
          <Button 
            onClick={handleVote}
            className="vote-button mt-auto"
          >
            Vote
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
