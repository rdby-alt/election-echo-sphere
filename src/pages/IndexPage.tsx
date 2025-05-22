
import React from 'react';
import { useElectionContext } from '@/contexts/ElectionContext';
import ElectionCard from '@/components/ElectionCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const IndexPage: React.FC = () => {
  const { elections, isLoading } = useElectionContext();

  // Filter active elections first
  const activeElections = elections.filter(el => el.status === 'active');
  const upcomingElections = elections.filter(el => el.status === 'upcoming');
  const otherElections = elections.filter(el => !['active', 'upcoming'].includes(el.status));

  // Combine in the desired order
  const sortedElections = [...activeElections, ...upcomingElections, ...otherElections];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-election-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Elections</h1>
        <Link to="/create">
          <Button className="bg-election-primary hover:bg-election-secondary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Election
          </Button>
        </Link>
      </div>

      {activeElections.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Active Elections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeElections.map(election => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </div>
      )}

      {upcomingElections.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Upcoming Elections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingElections.map(election => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </div>
      )}

      {otherElections.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
            Past &amp; Draft Elections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherElections.map(election => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        </div>
      )}

      {elections.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-election-light p-8 rounded-lg inline-block">
            <h2 className="text-xl font-semibold mb-4">No Elections Found</h2>
            <p className="text-gray-600 mb-6">Create your first election to get started</p>
            <Link to="/create">
              <Button className="bg-election-primary hover:bg-election-secondary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Election
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
