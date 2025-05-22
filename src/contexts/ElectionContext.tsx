
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { Election, Position, Candidate, User } from '@/types';
import { initializeMockData } from '@/data/mockData';
import { toast } from "sonner";

interface ElectionContextType {
  elections: Election[];
  currentElection: Election | null;
  currentUser: User | null;
  isLoading: boolean;
  createElection: (election: Partial<Election>) => void;
  updateElection: (id: string, election: Partial<Election>) => void;
  deleteElection: (id: string) => void;
  setCurrentElection: (election: Election | null) => void;
  addPosition: (electionId: string, position: Partial<Position>) => void;
  updatePosition: (positionId: string, position: Partial<Position>) => void;
  deletePosition: (positionId: string) => void;
  addCandidate: (positionId: string, candidate: Partial<Candidate>) => void;
  updateCandidate: (candidateId: string, candidate: Partial<Candidate>) => void;
  deleteCandidate: (candidateId: string) => void;
  castVote: (electionId: string, positionId: string, candidateId: string) => void;
  publishResults: (electionId: string) => void;
  login: (email: string) => void;
  logout: () => void;
}

export const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [currentElection, setCurrentElection] = useState<Election | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const { elections } = initializeMockData();
    setElections(elections);
    setIsLoading(false);
  }, []);

  const createElection = (election: Partial<Election>) => {
    const newElection: Election = {
      id: `${Date.now()}`,
      name: election.name || 'New Election',
      description: election.description || '',
      type: election.type || 'general',
      status: 'draft',
      positions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...election
    };

    setElections(prev => [...prev, newElection]);
    toast.success("Election created successfully");
    return newElection;
  };

  const updateElection = (id: string, electionUpdates: Partial<Election>) => {
    setElections(prev => 
      prev.map(election => 
        election.id === id 
          ? { ...election, ...electionUpdates, updatedAt: new Date() }
          : election
      )
    );
    
    if (currentElection?.id === id) {
      setCurrentElection(prev => prev ? { ...prev, ...electionUpdates, updatedAt: new Date() } : null);
    }
    
    toast.success("Election updated successfully");
  };

  const deleteElection = (id: string) => {
    setElections(prev => prev.filter(election => election.id !== id));
    if (currentElection?.id === id) {
      setCurrentElection(null);
    }
    toast.success("Election deleted successfully");
  };

  const addPosition = (electionId: string, position: Partial<Position>) => {
    const newPosition: Position = {
      id: `position-${Date.now()}`,
      title: position.title || 'New Position',
      description: position.description || '',
      candidates: [],
      electionId,
      ...position
    };

    setElections(prev => 
      prev.map(election => {
        if (election.id === electionId) {
          return {
            ...election,
            positions: [...election.positions, newPosition],
            updatedAt: new Date()
          };
        }
        return election;
      })
    );

    if (currentElection?.id === electionId) {
      setCurrentElection(prev => {
        if (!prev) return null;
        return {
          ...prev,
          positions: [...prev.positions, newPosition],
          updatedAt: new Date()
        };
      });
    }
    
    toast.success("Position added successfully");
    return newPosition;
  };

  const updatePosition = (positionId: string, positionUpdates: Partial<Position>) => {
    setElections(prev => 
      prev.map(election => {
        const updatedPositions = election.positions.map(position => 
          position.id === positionId 
            ? { ...position, ...positionUpdates }
            : position
        );
        
        if (JSON.stringify(updatedPositions) !== JSON.stringify(election.positions)) {
          return {
            ...election,
            positions: updatedPositions,
            updatedAt: new Date()
          };
        }
        
        return election;
      })
    );

    if (currentElection) {
      setCurrentElection(prev => {
        if (!prev) return null;
        return {
          ...prev,
          positions: prev.positions.map(position => 
            position.id === positionId 
              ? { ...position, ...positionUpdates }
              : position
          ),
          updatedAt: new Date()
        };
      });
    }
    
    toast.success("Position updated successfully");
  };

  const deletePosition = (positionId: string) => {
    setElections(prev => 
      prev.map(election => {
        const updatedPositions = election.positions.filter(position => position.id !== positionId);
        
        if (updatedPositions.length !== election.positions.length) {
          return {
            ...election,
            positions: updatedPositions,
            updatedAt: new Date()
          };
        }
        
        return election;
      })
    );

    if (currentElection) {
      setCurrentElection(prev => {
        if (!prev) return null;
        return {
          ...prev,
          positions: prev.positions.filter(position => position.id !== positionId),
          updatedAt: new Date()
        };
      });
    }
    
    toast.success("Position deleted successfully");
  };

  const addCandidate = (positionId: string, candidate: Partial<Candidate>) => {
    const newCandidate: Candidate = {
      id: `candidate-${Date.now()}`,
      name: candidate.name || 'New Candidate',
      positionId,
      ...candidate
    };

    setElections(prev => 
      prev.map(election => {
        const updatedPositions = election.positions.map(position => {
          if (position.id === positionId) {
            return {
              ...position,
              candidates: [...position.candidates, newCandidate]
            };
          }
          return position;
        });
        
        if (JSON.stringify(updatedPositions) !== JSON.stringify(election.positions)) {
          return {
            ...election,
            positions: updatedPositions,
            updatedAt: new Date()
          };
        }
        
        return election;
      })
    );

    if (currentElection) {
      setCurrentElection(prev => {
        if (!prev) return null;
        return {
          ...prev,
          positions: prev.positions.map(position => {
            if (position.id === positionId) {
              return {
                ...position,
                candidates: [...position.candidates, newCandidate]
              };
            }
            return position;
          }),
          updatedAt: new Date()
        };
      });
    }
    
    toast.success("Candidate added successfully");
    return newCandidate;
  };

  const updateCandidate = (candidateId: string, candidateUpdates: Partial<Candidate>) => {
    setElections(prev => 
      prev.map(election => {
        let updated = false;
        
        const updatedPositions = election.positions.map(position => {
          const updatedCandidates = position.candidates.map(candidate => {
            if (candidate.id === candidateId) {
              updated = true;
              return { ...candidate, ...candidateUpdates };
            }
            return candidate;
          });
          
          if (JSON.stringify(updatedCandidates) !== JSON.stringify(position.candidates)) {
            return { ...position, candidates: updatedCandidates };
          }
          
          return position;
        });
        
        if (updated) {
          return {
            ...election,
            positions: updatedPositions,
            updatedAt: new Date()
          };
        }
        
        return election;
      })
    );

    if (currentElection) {
      setCurrentElection(prev => {
        if (!prev) return null;
        
        let updated = false;
        const updatedPositions = prev.positions.map(position => {
          const updatedCandidates = position.candidates.map(candidate => {
            if (candidate.id === candidateId) {
              updated = true;
              return { ...candidate, ...candidateUpdates };
            }
            return candidate;
          });
          
          if (JSON.stringify(updatedCandidates) !== JSON.stringify(position.candidates)) {
            return { ...position, candidates: updatedCandidates };
          }
          
          return position;
        });
        
        if (updated) {
          return {
            ...prev,
            positions: updatedPositions,
            updatedAt: new Date()
          };
        }
        
        return prev;
      });
    }
    
    toast.success("Candidate updated successfully");
  };

  const deleteCandidate = (candidateId: string) => {
    setElections(prev => 
      prev.map(election => {
        let updated = false;
        
        const updatedPositions = election.positions.map(position => {
          const updatedCandidates = position.candidates.filter(candidate => candidate.id !== candidateId);
          
          if (updatedCandidates.length !== position.candidates.length) {
            updated = true;
            return { ...position, candidates: updatedCandidates };
          }
          
          return position;
        });
        
        if (updated) {
          return {
            ...election,
            positions: updatedPositions,
            updatedAt: new Date()
          };
        }
        
        return election;
      })
    );

    if (currentElection) {
      setCurrentElection(prev => {
        if (!prev) return null;
        
        let updated = false;
        const updatedPositions = prev.positions.map(position => {
          const updatedCandidates = position.candidates.filter(candidate => candidate.id !== candidateId);
          
          if (updatedCandidates.length !== position.candidates.length) {
            updated = true;
            return { ...position, candidates: updatedCandidates };
          }
          
          return position;
        });
        
        if (updated) {
          return {
            ...prev,
            positions: updatedPositions,
            updatedAt: new Date()
          };
        }
        
        return prev;
      });
    }
    
    toast.success("Candidate deleted successfully");
  };

  const castVote = (electionId: string, positionId: string, candidateId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to vote");
      return;
    }

    // Check if user already voted in this election
    if (currentUser.hasVoted && currentUser.hasVoted[electionId]) {
      toast.error("You have already voted in this election");
      return;
    }

    setElections(prev => 
      prev.map(election => {
        if (election.id !== electionId) return election;
        
        const updatedPositions = election.positions.map(position => {
          if (position.id !== positionId) return position;
          
          const updatedCandidates = position.candidates.map(candidate => {
            if (candidate.id === candidateId) {
              return { 
                ...candidate, 
                votes: (candidate.votes || 0) + 1 
              };
            }
            return candidate;
          });
          
          return { ...position, candidates: updatedCandidates };
        });
        
        return {
          ...election,
          positions: updatedPositions,
          updatedAt: new Date()
        };
      })
    );

    // Update current user's voting status
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        hasVoted: {
          ...prev.hasVoted,
          [electionId]: true
        }
      };
    });

    if (currentElection?.id === electionId) {
      setCurrentElection(prev => {
        if (!prev) return null;
        
        const updatedPositions = prev.positions.map(position => {
          if (position.id !== positionId) return position;
          
          const updatedCandidates = position.candidates.map(candidate => {
            if (candidate.id === candidateId) {
              return { 
                ...candidate, 
                votes: (candidate.votes || 0) + 1 
              };
            }
            return candidate;
          });
          
          return { ...position, candidates: updatedCandidates };
        });
        
        return {
          ...prev,
          positions: updatedPositions,
          updatedAt: new Date()
        };
      });
    }
    
    toast.success("Vote cast successfully");
  };

  const publishResults = (electionId: string) => {
    setElections(prev => 
      prev.map(election => 
        election.id === electionId 
          ? { ...election, status: 'published', updatedAt: new Date() }
          : election
      )
    );
    
    if (currentElection?.id === electionId) {
      setCurrentElection(prev => prev ? { ...prev, status: 'published', updatedAt: new Date() } : null);
    }
    
    toast.success("Results published successfully");
  };

  // Mock login just for demo purposes
  const login = (email: string) => {
    const { users } = initializeMockData();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}`);
      return user;
    } else {
      toast.error("User not found");
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <ElectionContext.Provider value={{
      elections,
      currentElection,
      currentUser,
      isLoading,
      createElection,
      updateElection,
      deleteElection,
      setCurrentElection,
      addPosition,
      updatePosition,
      deletePosition,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      castVote,
      publishResults,
      login,
      logout
    }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElectionContext = () => {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElectionContext must be used within a ElectionProvider');
  }
  return context;
};
