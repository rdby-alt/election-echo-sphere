
import React from 'react';
import { useElectionContext } from '@/contexts/ElectionContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const { elections, isLoading } = useElectionContext();
  
  const publishedElections = elections.filter(e => e.status === 'published');
  const endedElections = elections.filter(e => e.status === 'ended');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-election-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }
  
  // Helper function to find the winner of a position
  const getPositionWinner = (position: any) => {
    if (!position.candidates.length) return null;
    
    return position.candidates.reduce(
      (winner: any, candidate: any) => {
        const candidateVotes = candidate.votes || 0;
        const winnerVotes = winner?.votes || 0;
        
        return candidateVotes > winnerVotes ? candidate : winner;
      },
      null
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Election Results</h1>
      
      {publishedElections.length > 0 ? (
        <div className="space-y-8">
          {publishedElections.map(election => (
            <Card key={election.id} className="overflow-hidden">
              <CardHeader className="bg-election-light">
                <h2 className="text-xl font-semibold">
                  <Link to={`/election/${election.id}`} className="hover:underline">
                    {election.name}
                  </Link>
                </h2>
                <div className="text-sm text-gray-600">
                  {election.positions.length} {election.positions.length === 1 ? 'position' : 'positions'}
                </div>
              </CardHeader>
              
              <CardContent className="divide-y">
                {election.positions.map(position => {
                  const winner = getPositionWinner(position);
                  
                  return (
                    <div key={position.id} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="font-medium">{position.title}</h3>
                      
                      {winner ? (
                        <div className="flex items-center gap-3 mt-3 bg-white p-3 rounded-lg border">
                          <div className="bg-election-accent rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex items-center gap-3 flex-grow">
                            <img 
                              src={winner.imageUrl || 'https://via.placeholder.com/40x40?text=No+Image'} 
                              alt={winner.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{winner.name}</div>
                              {winner.votes !== undefined && (
                                <div className="text-sm text-gray-600">
                                  {winner.votes} votes
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 mt-2">
                          No candidates or votes for this position
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : endedElections.length > 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-medium text-gray-700">Results Not Published Yet</h2>
          <p className="mt-2 text-gray-500">
            There are {endedElections.length} ended {endedElections.length === 1 ? 'election' : 'elections'} with unpublished results.
          </p>
          <p className="mt-1 text-gray-500">
            Visit the election page to publish results.
          </p>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-medium text-gray-700">No Results Available</h2>
          <p className="mt-2 text-gray-500">
            No elections have been completed yet. Results will appear here once elections are finished and results are published.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
