
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useElectionContext } from '@/contexts/ElectionContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PositionsAndCandidates from '@/components/election/PositionsAndCandidates';
import { format } from 'date-fns';
import { toast } from "sonner";

const ElectionDetailPage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const { elections, setCurrentElection, updateElection, deleteElection, publishResults } = useElectionContext();
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (!electionId) return;

    const election = elections.find(e => e.id === electionId);
    if (election) {
      setCurrentElection(election);
      setFormState({
        name: election.name,
        description: election.description || '',
        startDate: election.startDate ? formatDateTimeForInput(election.startDate) : '',
        endDate: election.endDate ? formatDateTimeForInput(election.endDate) : ''
      });
    } else {
      navigate('/');
    }

    return () => {
      setCurrentElection(null);
    };
  }, [electionId, elections, navigate, setCurrentElection]);

  const formatDateTimeForInput = (date: Date): string => {
    return new Date(date).toISOString().slice(0, 16);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!electionId) return;

    const updates: any = {
      name: formState.name,
      description: formState.description,
    };

    if (formState.startDate) {
      updates.startDate = new Date(formState.startDate);
    }

    if (formState.endDate) {
      updates.endDate = new Date(formState.endDate);
    }

    updateElection(electionId, updates);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (!electionId) return;

    if (window.confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
      deleteElection(electionId);
      navigate('/');
    }
  };

  const handlePublishResults = () => {
    if (!electionId) return;

    if (window.confirm('Are you sure you want to publish the results? This will make the results visible to all voters.')) {
      publishResults(electionId);
      toast.success("Results published successfully");
    }
  };

  const handleStartElection = () => {
    if (!electionId) return;

    updateElection(electionId, { status: 'active' });
    toast.success("Election started successfully");
  };

  const handleEndElection = () => {
    if (!electionId) return;

    updateElection(electionId, { status: 'ended' });
    toast.success("Election ended successfully");
  };

  const election = elections.find(e => e.id === electionId);

  if (!election) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading election details...</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'active':
        return <Badge variant="success" className="bg-green-100 text-green-800">Active</Badge>;
      case 'ended':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">Ended</Badge>;
      case 'published':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{election.name}</h1>
          <div className="flex items-center space-x-2">
            {getStatusBadge(election.status)}
            <span className="text-gray-500 text-sm">
              Created on {format(new Date(election.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <div className="space-x-2">
          {election.status === 'draft' && (
            <Button onClick={handleStartElection} className="bg-green-600 hover:bg-green-700">
              Start Election
            </Button>
          )}
          
          {election.status === 'active' && (
            <Button onClick={handleEndElection} className="bg-orange-600 hover:bg-orange-700">
              End Election
            </Button>
          )}
          
          {election.status === 'ended' && (
            <Button onClick={handlePublishResults} className="bg-blue-600 hover:bg-blue-700">
              Publish Results
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="positions">Positions & Candidates</TabsTrigger>
          <TabsTrigger value="voting">Voting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6 mt-6">
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Edit Election Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Election Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={formState.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date & Time</Label>
                      <Input 
                        id="startDate"
                        name="startDate"
                        type="datetime-local"
                        value={formState.startDate}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date & Time</Label>
                      <Input 
                        id="endDate"
                        name="endDate"
                        type="datetime-local"
                        value={formState.endDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
                
                <div className="flex justify-end space-x-2 p-6 pt-0">
                  <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </Card>
            </form>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Election Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Description</h3>
                  <p className="mt-1">{election.description || 'No description provided.'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Election Type</h3>
                    <p className="mt-1 capitalize">{election.type}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Status</h3>
                    <div className="mt-1">{getStatusBadge(election.status)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Start Date</h3>
                    <p className="mt-1">
                      {election.startDate 
                        ? format(new Date(election.startDate), 'PPpp')
                        : 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">End Date</h3>
                    <p className="mt-1">
                      {election.endDate 
                        ? format(new Date(election.endDate), 'PPpp')
                        : 'Not set'}
                    </p>
                  </div>
                </div>
                
                {election.type === 'department' && election.departments && (
                  <div>
                    <h3 className="font-medium text-gray-700">Departments</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {election.departments.map(dept => (
                        <Badge key={dept} variant="outline" className="bg-blue-50">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {election.type === 'custom' && election.customVotersList && (
                  <div>
                    <h3 className="font-medium text-gray-700">Custom Voters</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {election.customVotersList.map(voter => (
                        <Badge key={voter} variant="outline" className="bg-purple-50">
                          {voter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <div className="flex justify-end space-x-2 p-6 pt-0">
                <Button variant="outline" onClick={() => setEditMode(true)}>Edit Details</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete Election</Button>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="positions" className="space-y-6 mt-6">
          <PositionsAndCandidates electionId={election.id} />
        </TabsContent>
        
        <TabsContent value="voting" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Voting Management</CardTitle>
              <CardDescription>Configure voting settings and view statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Voting Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(election.status)}
                    <span>
                      {election.status === 'draft' && 'Election is in draft mode. Start it when ready.'}
                      {election.status === 'upcoming' && 'Election is scheduled but not yet active.'}
                      {election.status === 'active' && 'Voting is currently open.'}
                      {election.status === 'ended' && 'Voting is closed but results are not published.'}
                      {election.status === 'published' && 'Results are published and visible to voters.'}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Election Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Start Date:</span>
                      <span>
                        {election.startDate 
                          ? format(new Date(election.startDate), 'PPpp')
                          : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span>
                        {election.endDate 
                          ? format(new Date(election.endDate), 'PPpp')
                          : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {election.status === 'draft' && (
                      <Button onClick={handleStartElection} className="bg-green-600 hover:bg-green-700">
                        Start Election
                      </Button>
                    )}
                    
                    {election.status === 'active' && (
                      <Button onClick={handleEndElection} className="bg-orange-600 hover:bg-orange-700">
                        End Election
                      </Button>
                    )}
                    
                    {election.status === 'ended' && (
                      <Button onClick={handlePublishResults} className="bg-blue-600 hover:bg-blue-700">
                        Publish Results
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectionDetailPage;
