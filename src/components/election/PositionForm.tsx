
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Position } from '@/types';
import { useElectionContext } from '@/contexts/ElectionContext';
import { toast } from "sonner";

interface PositionFormProps {
  electionId: string;
  onPositionAdded?: (position: Position) => void;
}

const PositionForm: React.FC<PositionFormProps> = ({ electionId, onPositionAdded }) => {
  const { addPosition } = useElectionContext();
  const [formState, setFormState] = useState({
    title: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.title.trim()) {
      toast.error("Position title is required");
      return;
    }
    
    try {
      const newPosition = addPosition(electionId, {
        title: formState.title,
        description: formState.description
      });
      
      // Reset form
      setFormState({
        title: '',
        description: ''
      });
      
      toast.success(`Position "${formState.title}" added successfully`);
      
      if (onPositionAdded && newPosition) {
        onPositionAdded(newPosition);
      }
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Failed to add position");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Position</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Position Title *</Label>
            <Input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="E.g., President, Treasurer, Board Member"
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
              placeholder="Describe the responsibilities of this position"
              rows={3}
            />
          </div>
          
          <Button type="submit" className="bg-election-primary hover:bg-election-secondary text-white">
            Add Position
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PositionForm;
