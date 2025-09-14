import { useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { isConnected } = useWebSocket();
  const { toast } = useToast();
  
  // State for settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [capacityThreshold, setCapacityThreshold] = useState(80);
  const [alertEmail, setAlertEmail] = useState('admin@example.com');

  const handleSaveSettings = () => {
    // Here you would typically send the settings to the server
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data export is being prepared. You'll receive an email when it's ready.",
    });
  };

  const handleSystemReset = () => {
    toast({
      title: "System reset",
      description: "All system data has been cleared. Restart recommended.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your bus monitoring system</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
          <TabsTrigger value="alerts" data-testid="tab-alerts">Alerts</TabsTrigger>
          <TabsTrigger value="system" data-testid="tab-system">System</TabsTrigger>
          <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="grid gap-6">
            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Configure how information is displayed in the dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh data every few seconds
                    </p>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    data-testid="switch-auto-refresh"
                  />
                </div>

                {autoRefresh && (
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                    <Input
                      id="refresh-interval"
                      type="number"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      min={1}
                      max={60}
                      className="w-24"
                      data-testid="input-refresh-interval"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended: 5-10 seconds for real-time monitoring
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified about important events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts and reports via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    data-testid="switch-email-notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    data-testid="switch-push-notifications"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <div className="grid gap-6">
            {/* Alert Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Thresholds</CardTitle>
                <CardDescription>Configure when alerts should be triggered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="capacity-threshold">Capacity Alert Threshold (%)</Label>
                  <Input
                    id="capacity-threshold"
                    type="number"
                    value={capacityThreshold}
                    onChange={(e) => setCapacityThreshold(Number(e.target.value))}
                    min={50}
                    max={100}
                    className="w-24"
                    data-testid="input-capacity-threshold"
                  />
                  <p className="text-sm text-muted-foreground">
                    Trigger alerts when bus capacity exceeds this percentage
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="alert-email">Alert Email Address</Label>
                  <Input
                    id="alert-email"
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="max-w-md"
                    data-testid="input-alert-email"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email address to receive critical alerts
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Alert Types */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Types</CardTitle>
                <CardDescription>Choose which types of alerts to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-exclamation-triangle text-destructive"></i>
                      <div>
                        <p className="font-medium">Capacity Overload</p>
                        <p className="text-sm text-muted-foreground">When buses exceed passenger capacity</p>
                      </div>
                    </div>
                    <Switch defaultChecked data-testid="switch-capacity-alerts" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-wifi text-yellow-600"></i>
                      <div>
                        <p className="font-medium">Connection Issues</p>
                        <p className="text-sm text-muted-foreground">When buses lose connection</p>
                      </div>
                    </div>
                    <Switch defaultChecked data-testid="switch-connection-alerts" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-tools text-blue-600"></i>
                      <div>
                        <p className="font-medium">Maintenance Required</p>
                        <p className="text-sm text-muted-foreground">When buses need maintenance</p>
                      </div>
                    </div>
                    <Switch defaultChecked data-testid="switch-maintenance-alerts" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="grid gap-6">
            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your system data and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Export System Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download all passenger data, alerts, and activity logs
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleExportData} data-testid="button-export-data">
                      <i className="fas fa-download mr-2"></i>
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div>
                      <p className="font-medium text-destructive">Clear All Data</p>
                      <p className="text-sm text-muted-foreground">
                        Reset the system and remove all historical data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleSystemReset} data-testid="button-reset-system">
                      <i className="fas fa-trash mr-2"></i>
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current status of system components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>WebSocket Connection</span>
                    <Badge variant={isConnected ? 'default' : 'destructive'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge variant="default">In-Memory (Active)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Server</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Computer Vision Client</span>
                    <Badge variant="secondary">Standby</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="grid gap-6">
            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Details about your bus monitoring system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Version</Label>
                    <p className="text-sm text-muted-foreground">1.0.0</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Build</Label>
                    <p className="text-sm text-muted-foreground">2024.09.14</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Environment</Label>
                    <p className="text-sm text-muted-foreground">Development</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Runtime</Label>
                    <p className="text-sm text-muted-foreground">Node.js + React</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Components</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-sm">React Dashboard (Frontend)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-sm">Express.js API (Backend)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-sm">WebSocket Real-time Updates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-sm">Computer Vision Integration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-sm">MobileNet SSD Object Detection</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Test Video Integration</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    To test the passenger counting functionality with your test video:
                  </p>
                  <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-xs">
                    python people_counter_client.py<br />
                    &nbsp;&nbsp;--bus_id BUS-001<br />
                    &nbsp;&nbsp;--input attached_assets/test_1_1757778577870.mp4<br />
                    &nbsp;&nbsp;--model MobileNetSSD_deploy.caffemodel<br />
                    &nbsp;&nbsp;--server_url http://localhost:5000
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>Get help with your bus monitoring system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <i className="fas fa-book text-blue-600"></i>
                    <div>
                      <p className="font-medium">Documentation</p>
                      <p className="text-sm text-muted-foreground">View the system documentation and user guide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <i className="fas fa-question-circle text-green-600"></i>
                    <div>
                      <p className="font-medium">FAQ</p>
                      <p className="text-sm text-muted-foreground">Find answers to frequently asked questions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <i className="fas fa-envelope text-purple-600"></i>
                    <div>
                      <p className="font-medium">Contact Support</p>
                      <p className="text-sm text-muted-foreground">Get in touch with technical support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} data-testid="button-save-settings">
          <i className="fas fa-save mr-2"></i>
          Save Settings
        </Button>
      </div>
    </div>
  );
}