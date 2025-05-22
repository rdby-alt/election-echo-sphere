import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElectionContext } from '@/contexts/ElectionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Election, ElectionType } from '@/types';
import { toast } from "sonner";

const CreateElectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { createElection } = useElectionContext();
  
  const [formState, setFormState] = useState<{
    name: string;
    description: string;
    type: ElectionType;
    departments: string[];
    customVotersList: string[];
    startDate: string;
    endDate: string;
  }>({
    name: '',
    description: '',
    type: 'general',
    departments: [],
    customVotersList: [],
    startDate: '',
    endDate: '',
  });
  
  const [departmentInput, setDepartmentInput] = useState('');
  const [customVoterInput, setCustomVoterInput] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (value: ElectionType) => {
    setFormState(prev => ({ ...prev, type: value }));
  };
  
  const handleAddDepartment = () => {
    if (departmentInput.trim() && !formState.departments.includes(departmentInput.trim())) {
      setFormState(prev => ({
        ...prev,
        departments: [...prev.departments, departmentInput.trim()]
      }));
      setDepartmentInput('');
    }
  };
  
  const handleRemoveDepartment = (dept: string) => {
    setFormState(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== dept)
    }));
  };
  
  const handleAddVoter = () => {
    if (customVoterInput.trim() && !formState.customVotersList.includes(customVoterInput.trim())) {
      setFormState(prev => ({
        ...prev,
        customVotersList: [...prev.customVotersList, customVoterInput.trim()]
      }));
      setCustomVoterInput('');
    }
  };
  
  const handleRemoveVoter = (voter: string) => {
    setFormState(prev => ({
      ...prev,
      customVotersList: prev.customVotersList.filter(v => v !== voter)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create Election object
    const newElection: Partial<Election> = {
      name: formState.name,
      description: formState.description,
      type: formState.type,
      status: 'draft',
    };
    
    // Add type-specific fields
    if (formState.type === 'department') {
      newElection.departments = formState.departments;
    } else if (formState.type === 'custom') {
      newElection.customVotersList = formState.customVotersList;
    }
    
    // Add dates if provided
    if (formState.startDate) {
      newElection.startDate = new Date(formState.startDate);
    }
    
    if (formState.endDate) {
      newElection.endDate = new Date(formState.endDate);
    }
    
    // Create election and navigate to it
    try {
      const election = createElection(newElection);
      if (election && election.id) {
        navigate(`/election/${election.id}`);
      } else {
        toast.error("Failed to create election");
      }
    } catch (error) {
      console.error("Error creating election:", error);
      toast.error("Failed to create election");
    }
  };
  
  const isFormValid = () => {
    if (!formState.name.trim()) return false;
    
    if (formState.type === 'department' && formState.departments.length === 0) {
      return false;
    }
    
    if (formState.type === 'custom' && formState.customVotersList.length === 0) {
      return false;
    }
    
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Election</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the details of your new election
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Election Name *</Label>
              <Input 
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="E.g., Board of Directors Election 2025"
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
                placeholder="Provide details about the purpose of this election"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Election Type *</Label>
              <Select value={formState.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select election type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General (All Employees)</SelectItem>
                  <SelectItem value="department">Department-based</SelectItem>
                  <SelectItem value="custom">Custom List of Voters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formState.startDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="w-1/2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formState.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {formState.type === 'department' && (
          <Card>
            <CardHeader>
              <CardTitle>Department Settings</CardTitle>
              <CardDescription>
                Define which departments can participate in this election
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                  placeholder="Department name"
                />
                <Button type="button" onClick={handleAddDepartment} variant="outline">Add</Button>
              </div>
              
              {formState.departments.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formState.departments.map(dept => (
                    <div key={dept} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                      {dept}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveDepartment(dept)}
                        className="ml-1 text-blue-800 hover:text-blue-900 font-bold"
                        aria-label="Remove department"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No departments added yet</div>
              )}
            </CardContent>
          </Card>
        )}
        
        {formState.type === 'custom' && (
          <Card>
            <CardHeader>
              <CardTitle>Custom Voters</CardTitle>
              <CardDescription>
                Add specific email addresses of users who can vote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={customVoterInput}
                  onChange={(e) => setCustomVoterInput(e.target.value)}
                  placeholder="Email address"
                  type="email"
                />
                <Button type="button" onClick={handleAddVoter} variant="outline">Add</Button>
              </div>
              
              {formState.customVotersList.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formState.customVotersList.map(voter => (
                    <div key={voter} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center">
                      {voter}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveVoter(voter)}
                        className="ml-1 text-purple-800 hover:text-purple-900 font-bold"
                        aria-label="Remove voter"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No voters added yet</div>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid()} 
            className="bg-election-primary hover:bg-election-secondary text-white"
          >
            Create Election
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateElectionPage;
