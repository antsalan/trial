import { useQuery, useMutation } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Alert } from "@shared/schema";

export default function Alerts() {
  const { isConnected } = useWebSocket();
  const { toast } = useToast();
  
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const readAlerts = alerts.filter(alert => alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

  const markAsReadMutation = useMutation({
    mutationFn: (alertId: string) => 
      apiRequest(`/api/alerts/${alertId}/read`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert marked as read",
        description: "The alert has been marked as read.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark alert as read.",
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => 
      apiRequest('/api/alerts/mark-all-read', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "All alerts marked as read",
        description: `${unreadAlerts.length} alerts have been marked as read.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark all alerts as read.",
        variant: "destructive",
      });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: (alertId: string) => 
      apiRequest(`/api/alerts/${alertId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert deleted",
        description: "The alert has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete alert.",
        variant: "destructive",
      });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-bell';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Alert Management</h1>
          <div className="flex items-center space-x-2">
            <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alert Management</h1>
          <p className="text-muted-foreground">Monitor and manage system alerts</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {unreadAlerts.length > 0 && (
            <Button 
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              data-testid="button-mark-all-read"
            >
              <i className="fas fa-check-double mr-2"></i>
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-alerts">
              {alerts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-unread-alerts">
              {unreadAlerts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-critical-alerts">
              {criticalAlerts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-read-alerts">
              {readAlerts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>View and manage alerts from your bus monitoring system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unread" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unread" data-testid="tab-unread">
                Unread ({unreadAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="critical" data-testid="tab-critical">
                Critical ({criticalAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">
                All Alerts ({alerts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="mt-6">
              {unreadAlerts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unreadAlerts.map((alert) => {
                      const { date, time } = formatTimestamp(alert.timestamp);
                      return (
                        <TableRow key={alert.id} data-testid={`row-alert-${alert.id}`}>
                          <TableCell>
                            <Badge variant={getSeverityColor(alert.severity)} className="flex items-center space-x-1 w-fit">
                              <i className={getSeverityIcon(alert.severity)}></i>
                              <span>{alert.severity}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="space-y-1">
                              <p className="font-medium">{alert.message}</p>
                              {alert.details && (
                                <p className="text-sm text-muted-foreground">{alert.details}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{alert.source}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{date}</div>
                              <div className="text-muted-foreground">{time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => markAsReadMutation.mutate(alert.id)}
                                disabled={markAsReadMutation.isPending}
                                data-testid={`button-mark-read-${alert.id}`}
                              >
                                <i className="fas fa-check"></i>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteAlertMutation.mutate(alert.id)}
                                disabled={deleteAlertMutation.isPending}
                                data-testid={`button-delete-${alert.id}`}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <i className="fas fa-check-circle text-4xl text-green-500"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No unread alerts at this time.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="critical" className="mt-6">
              {criticalAlerts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalAlerts.map((alert) => {
                      const { date, time } = formatTimestamp(alert.timestamp);
                      return (
                        <TableRow key={alert.id} data-testid={`row-critical-${alert.id}`}>
                          <TableCell>
                            <Badge variant={alert.isRead ? 'outline' : 'destructive'}>
                              {alert.isRead ? 'Read' : 'Unread'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="space-y-1">
                              <p className="font-medium text-destructive">{alert.message}</p>
                              {alert.details && (
                                <p className="text-sm text-muted-foreground">{alert.details}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{alert.source}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{date}</div>
                              <div className="text-muted-foreground">{time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {!alert.isRead && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => markAsReadMutation.mutate(alert.id)}
                                  disabled={markAsReadMutation.isPending}
                                  data-testid={`button-mark-read-${alert.id}`}
                                >
                                  <i className="fas fa-check"></i>
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteAlertMutation.mutate(alert.id)}
                                disabled={deleteAlertMutation.isPending}
                                data-testid={`button-delete-${alert.id}`}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <i className="fas fa-shield-alt text-4xl text-green-500"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No critical alerts</h3>
                  <p className="text-muted-foreground">Your system is running smoothly.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              {alerts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => {
                      const { date, time } = formatTimestamp(alert.timestamp);
                      return (
                        <TableRow key={alert.id} data-testid={`row-all-${alert.id}`}>
                          <TableCell>
                            <Badge variant={getSeverityColor(alert.severity)} className="flex items-center space-x-1 w-fit">
                              <i className={getSeverityIcon(alert.severity)}></i>
                              <span>{alert.severity}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={alert.isRead ? 'outline' : 'default'}>
                              {alert.isRead ? 'Read' : 'Unread'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="space-y-1">
                              <p className="font-medium">{alert.message}</p>
                              {alert.details && (
                                <p className="text-sm text-muted-foreground">{alert.details}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{alert.source}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{date}</div>
                              <div className="text-muted-foreground">{time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {!alert.isRead && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => markAsReadMutation.mutate(alert.id)}
                                  disabled={markAsReadMutation.isPending}
                                  data-testid={`button-mark-read-${alert.id}`}
                                >
                                  <i className="fas fa-check"></i>
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteAlertMutation.mutate(alert.id)}
                                disabled={deleteAlertMutation.isPending}
                                data-testid={`button-delete-${alert.id}`}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <i className="fas fa-bell-slash text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No alerts</h3>
                  <p className="text-muted-foreground">Your system will generate alerts when issues arise.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}