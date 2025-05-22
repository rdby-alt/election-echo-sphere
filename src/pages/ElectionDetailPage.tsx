
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useElectionContext } from '@/contexts/ElectionContext';
import CandidateCard from '@/components/CandidateCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Calendar, Clock, Info, Users } from 'lucide-react';
import { toast } from "sonner";

const ElectionDetailPage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const { 
    elections, 
    setCurrentElection, 
    currentElection, 
    currentUser,
    publishResults
  } = useElectionContext();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (electionId) {
      const election = elections.find(e => e.id === electionId);
      if (election) {
        setCurrentElection(election);
      } else {
        // Election not found
        navigate('/');
        toast.error("Election not found");
      }
    }

    return () => {
      // Clean up
      setCurrentElection(null);
    };
  }, [electionId, elections, setCurrentElection, navigate]);

  if (!currentElection) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-election-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading election details...</p>
        </div>
      </div>
    );
  }

  const isActive = currentElection.status === 'active';
  const isPublished = currentElection.status === 'published';
  const hasVoted = currentUser?.hasVoted && currentUser.hasVoted[currentElection.id];
  const canVote = isActive && currentUser && !hasVoted;
  const canPublish = currentElection.status === 'ended';

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'general': return 'General Election';
      case 'department': return 'Department Election';
      case 'custom': return 'Custom Election';
      default: return 'Election';
    }
  };

  const handlePublishResults = () => {
    if (currentElection) {
      publishResults(currentElection.id);
    }
  };

  // Find position winners
  const getPositionWinner = (positionId: string) => {
    const position = currentElection.positions.find(p => p.id === positionId);
    if (!position || !position.candidates.length) return null;
    
    let maxVotes = -1;
    let winner = null;
    
    for (const candidate of position.candidates) {
      if (typeof candidate.votes === 'number' && candidate.votes > maxVotes) {
        maxVotes = candidate.votes;
        winner = candidate;
      }
    }
    
    return winner;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            {currentElection.status === 'active' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                Active
              </span>
            )}
            {currentElection.status === 'upcoming' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                Upcoming
              </span>
            )}
            {currentElection.status === 'ended' && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                Ended
              </span>
            )}
            {currentElection.status === 'published' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                Results Published
              </span>
            )}
            {currentElection.status === 'draft' && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-semibold">
                Draft
              </span>
            )}
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-600">{getTypeLabel(currentElection.type)}</span>
          </div>
          <h1 className="text-3xl font-bold mt-2">{currentElection.name}</h1>
        </div>
        
        {canVote ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Ready to vote</span>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        ) : hasVoted ? (
          <div className="text-sm font-medium text-gray-600">You have already voted</div>
        ) : null}
        
        {canPublish && (
          <Button 
            className="bg-election-accent hover:bg-yellow-400 text-black"
            onClick={handlePublishResults}
          >
            Publish Results
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="positions" className="flex-1">Positions & Candidates</TabsTrigger>
          {isPublished && <TabsTrigger value="results" className="flex-1">Results</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Election Information</h2>
              
              {currentElection.description && (
                <div className="mb-4">
                  <p className="text-gray-700">{currentElection.description}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Type</div>
                    <div className="text-sm text-gray-600">{getTypeLabel(currentElection.type)}</div>
                  </div>
                </div>
                
                {(currentElection.startDate || currentElection.endDate) && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Schedule</div>
                      <div className="text-sm text-gray-600">
                        {currentElection.startDate && (
                          <div>Start: {format(new Date(currentElection.startDate), 'PPP p')}</div>
                        )}
                        {currentElection.endDate && (
                          <div>End: {format(new Date(currentElection.endDate), 'PPP p')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Eligibility</div>
                    <div className="text-sm text-gray-600">
                      {currentElection.type === 'general' && 'All company employees'}
                      {currentElection.type === 'department' && currentElection.departments?.length && (
                        <div>Members of: {currentElection.departments.join(', ')}</div>
                      )}
                      {currentElection.type === 'custom' && (
                        <div>Custom list of {currentElection.customVotersList?.length || 0} voters</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Positions</h2>
              {currentElection.positions.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No positions have been added to this election yet.</div>
              ) : (
                <div className="space-y-4">
                  {currentElection.positions.map(position => (
                    <div key={position.id} className="border-b pb-3 last:border-0">
                      <h3 className="text-lg font-medium">{position.title}</h3>
                      {position.description && (
                        <p className="text-gray-600 text-sm mt-1">{position.description}</p>
                      )}
                      <div className="mt-2 text-sm text-gray-500">
                        {position.candidates.length} {position.candidates.length === 1 ? 'Candidate' : 'Candidates'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {hasVoted && (
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-800">Thank you for voting!</h3>
              <p className="text-green-700 mt-1">
                You have successfully cast your vote in this election. Results will be available after the election concludes.
              </p>
            </div>
          )}
          
          {isActive && !currentUser && (
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-medium text-yellow-800">Login to Vote</h3>
              <p className="text-yellow-700 mt-1">
                This election is currently active. Please login to cast your vote.
              </p>
              <Button variant="outline" className="mt-3" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="positions" className="pt-4">
          {currentElection.positions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <h3 className="text-xl font-medium text-gray-700">No Positions Added</h3>
              <p className="mt-2 text-gray-500">This election doesn't have any positions yet.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {currentElection.positions.map(position => {
                const winner = isPublished ? getPositionWinner(position.id) : null;
                
                return (
                  <div key={position.id} className="space-y-4">
                    <div className="border-b pb-2">
                      <h2 className="text-2xl font-semibold">{position.title}</h2>
                      {position.description && (
                        <p className="text-gray-600 mt-1">{position.description}</p>
                      )}
                    </div>
                    
                    {position.candidates.length === 0 ? (
                      <div className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg">
                        No candidates have been added for this position yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {position.candidates.map(candidate => (
                          <CandidateCard 
                            key={candidate.id}
                            candidate={candidate}
                            electionId={currentElection.id}
                            positionId={position.id}
                            showVoteButton={canVote}
                            isWinner={isPublished && winner?.id === candidate.id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {isPublished && (
          <TabsContent value="results" className="pt-4">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-6">Election Results</h2>
              
              <div className="space-y-8">
                {currentElection.positions.map(position => {
                  // Sort candidates by votes (descending)
                  const sortedCandidates = [...position.candidates].sort((a, b) => 
                    (b.votes || 0) - (a.votes || 0)
                  );
                  
                  const winner = sortedCandidates.length > 0 ? sortedCandidates[0] : null;
                  const totalVotes = sortedCandidates.reduce((acc, candidate) => acc + (candidate.votes || 0), 0);
                  
                  return (
                    <div key={position.id} className="border-b pb-6 last:border-0">
                      <h3 className="text-xl font-semibold mb-3">{position.title}</h3>
                      
                      {winner && (
                        <div className="bg-election-light p-4 rounded-lg mb-6 border border-election-accent">
                          <div className="flex items-center gap-3">
                            <img 
                              src={winner.imageUrl || 'https://via.placeholder.com/100x100?text=No+Image'} 
                              alt={winner.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-xs font-semibold text-election-accent uppercase">Winner</div>
                              <h4 className="text-lg font-semibold">{winner.name}</h4>
                              {winner.votes !== undefined && totalVotes > 0 && (
                                <div className="text-sm text-gray-600">
                                  {winner.votes} votes ({Math.round((winner.votes / totalVotes) * 100)}%)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {sortedCandidates.map((candidate, index) => (
                          <div key={candidate.id} className="flex items-center gap-3">
                            <div className="w-8 text-center font-medium text-gray-500">
                              {index + 1}
                            </div>
                            <img 
                              src={candidate.imageUrl || 'https://via.placeholder.com/40x40?text=No+Image'} 
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-grow">
                              <div className="font-medium">{candidate.name}</div>
                              {candidate.slogan && (
                                <div className="text-xs text-gray-500 italic">"{candidate.slogan}"</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{candidate.votes || 0}</div>
                              <div className="text-xs text-gray-500">votes</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {totalVotes === 0 && (
                        <div className="text-sm text-gray-500 mt-4">No votes were cast for this position.</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ElectionDetailPage;
