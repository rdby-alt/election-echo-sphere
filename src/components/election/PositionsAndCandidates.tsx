
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Position, Candidate } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PositionForm from './PositionForm';
import CandidateForm from './CandidateForm';
import CandidateCard from '@/components/CandidateCard';
import { useElectionContext } from '@/contexts/ElectionContext';
import { toast } from "sonner";
import { ClipboardList, UserPlus } from 'lucide-react';

interface PositionsAndCandidatesProps {
  electionId: string;
}

const PositionsAndCandidates: React.FC<PositionsAndCandidatesProps> = ({ electionId }) => {
  const { currentElection, deletePosition, deleteCandidate } = useElectionContext();
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  
  // Set initial selected position if positions exist
  React.useEffect(() => {
    if (currentElection?.positions?.length && !selectedPositionId) {
      setSelectedPositionId(currentElection.positions[0].id);
    }
  }, [currentElection?.positions, selectedPositionId]);

  const handlePositionAdded = (position: Position) => {
    setSelectedPositionId(position.id);
  };

  const handleDeletePosition = (positionId: string) => {
    if (window.confirm('Are you sure you want to delete this position and all its candidates?')) {
      deletePosition(positionId);
      
      // If we deleted the selected position, select another one
      if (positionId === selectedPositionId) {
        const positions = currentElection?.positions || [];
        const remainingPositions = positions.filter(p => p.id !== positionId);
        if (remainingPositions.length > 0) {
          setSelectedPositionId(remainingPositions[0].id);
        } else {
          setSelectedPositionId(null);
        }
      }
    }
  };

  const handleDeleteCandidate = (candidateId: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      deleteCandidate(candidateId);
    }
  };

  if (!currentElection) {
    return <div>Loading election...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="positions">
            <ClipboardList className="h-4 w-4 mr-2" />
            Manage Positions
          </TabsTrigger>
          <TabsTrigger value="candidates">
            <UserPlus className="h-4 w-4 mr-2" />
            Manage Candidates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="positions" className="space-y-6">
          <PositionForm electionId={electionId} onPositionAdded={handlePositionAdded} />
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Current Positions</h3>
            {currentElection.positions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentElection.positions.map(position => (
                  <Card key={position.id} className="h-full">
                    <CardHeader>
                      <CardTitle>{position.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {position.description && (
                        <p className="text-sm text-gray-600 mb-4">{position.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {position.candidates.length} {position.candidates.length === 1 ? 'candidate' : 'candidates'}
                        </span>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeletePosition(position.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No positions added yet. Add your first position above.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-6">
          {currentElection.positions.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
              <p className="text-amber-800">Please add at least one position before adding candidates.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Position to Add Candidates
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={selectedPositionId || ''}
                  onChange={(e) => setSelectedPositionId(e.target.value)}
                >
                  {currentElection.positions.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedPositionId && (
                <CandidateForm positionId={selectedPositionId} />
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">
                  Current Candidates for {selectedPositionId ? 
                    currentElection.positions.find(p => p.id === selectedPositionId)?.title :
                    'Selected Position'}
                </h3>
                
                {selectedPositionId ? (
                  <>
                    {(() => {
                      const position = currentElection.positions.find(p => p.id === selectedPositionId);
                      return position?.candidates?.length ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {position.candidates.map(candidate => (
                            <div key={candidate.id} className="relative">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="absolute top-2 right-2 z-10 bg-white"
                                onClick={() => handleDeleteCandidate(candidate.id)}
                              >
                                Delete
                              </Button>
                              <CandidateCard 
                                candidate={candidate} 
                                electionId={electionId} 
                                positionId={position.id} 
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No candidates added yet for this position.</p>
                      );
                    })()}
                  </>
                ) : (
                  <p className="text-gray-500 italic">Please select a position to view candidates.</p>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PositionsAndCandidates;
