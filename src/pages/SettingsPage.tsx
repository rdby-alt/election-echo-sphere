
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useElectionContext } from '@/contexts/ElectionContext';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive updates about elections via email</p>
            </div>
            <Switch id="email-notifications" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor-auth" className="text-base font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <Switch id="two-factor-auth" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Election Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymous-voting" className="text-base font-medium">Anonymous Voting</Label>
              <p className="text-sm text-gray-500">Hide voter identities from election results</p>
            </div>
            <Switch id="anonymous-voting" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-publish" className="text-base font-medium">Auto-Publish Results</Label>
              <p className="text-sm text-gray-500">Automatically publish results when an election ends</p>
            </div>
            <Switch id="auto-publish" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="developer-mode" className="text-base font-medium">Developer Mode</Label>
              <p className="text-sm text-gray-500">Enable advanced features for system administrators</p>
            </div>
            <Switch id="developer-mode" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="debug-logs" className="text-base font-medium">Debug Logs</Label>
              <p className="text-sm text-gray-500">Log detailed information for troubleshooting</p>
            </div>
            <Switch id="debug-logs" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
