
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Candidate } from '@/types';
import { useElectionContext } from '@/contexts/ElectionContext';
import { toast } from "sonner";

interface CandidateFormProps {
  positionId: string;
  onCandidateAdded?: (candidate: Candidate) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ positionId, onCandidateAdded }) => {
  const { addCandidate } = useElectionContext();
  const [formState, setFormState] = useState({
    name: '',
    slogan: '',
    imageUrl: '',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.name.trim()) {
      toast.error("Candidate name is required");
      return;
    }
    
    try {
      const newCandidate = addCandidate(positionId, {
        name: formState.name,
        slogan: formState.slogan,
        imageUrl: formState.imageUrl,
        bio: formState.bio
      });
      
      // Reset form
      setFormState({
        name: '',
        slogan: '',
        imageUrl: '',
        bio: ''
      });
      
      toast.success(`Candidate "${formState.name}" added successfully`);
      
      if (onCandidateAdded && newCandidate) {
        onCandidateAdded(newCandidate);
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error("Failed to add candidate");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Candidate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Candidate Name *</Label>
            <Input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Full name of the candidate"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slogan">Campaign Slogan</Label>
            <Input
              id="slogan"
              name="slogan"
              value={formState.slogan}
              onChange={handleChange}
              placeholder="A short, catchy slogan"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Profile Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleChange}
              placeholder="URL to candidate's image"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formState.bio}
              onChange={handleChange}
              placeholder="Brief description of the candidate's background and qualifications"
              rows={3}
            />
          </div>
          
          <Button type="submit" className="bg-election-primary hover:bg-election-secondary text-white">
            Add Candidate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CandidateForm;
