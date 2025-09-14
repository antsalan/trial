import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { Bus } from "@shared/schema";

export default function Dispatch() {
  const { isConnected } = useWebSocket();
  
  const { data: buses = [], isLoading } = useQuery<Bus[]>({
    queryKey: ['/api/buses/active'],
  });

  const activeBuses = buses.filter(bus => bus.status === 'active');
  const busesNeedingAttention = buses.filter(bus => {
    const occupancyPercentage = bus.capacity > 0 ? (bus.currentPassengers / bus.capacity) * 100 : 0;
    return occupancyPercentage > 80 || bus.status !== 'active';
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dispatch Center</h1>
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
          <h1 className="text-2xl font-bold">Dispatch Center</h1>
          <p className="text-muted-foreground">Manage routes and coordinate bus operations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button data-testid="button-create-route">
            <i className="fas fa-route mr-2"></i>
            Create Route
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-active-buses-count">
              {activeBuses.length}
            </div>
            <p className="text-xs text-muted-foreground">of {buses.length} total buses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Buses Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-attention-buses-count">
              {busesNeedingAttention.length}
            </div>
            <p className="text-xs text-muted-foreground">high capacity or maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-total-passengers-count">
              {buses.reduce((total, bus) => total + bus.currentPassengers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">across all buses</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Actions */}
      {busesNeedingAttention.length > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Priority Actions Required
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              The following buses need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {busesNeedingAttention.map((bus) => {
                const occupancyPercentage = bus.capacity > 0 ? (bus.currentPassengers / bus.capacity) * 100 : 0;
                const isOverCapacity = occupancyPercentage > 100;
                const isNearCapacity = occupancyPercentage > 80;
                
                return (
                  <div key={bus.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={bus.status === 'active' ? 'default' : 'destructive'}>
                        Bus {bus.busNumber}
                      </Badge>
                      <span className="text-sm">{bus.route}</span>
                      {(isOverCapacity || isNearCapacity) && (
                        <Badge variant="destructive" className="text-xs">
                          {Math.round(occupancyPercentage)}% capacity
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" variant="outline" data-testid={`button-action-${bus.id}`}>
                      Take Action
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dispatch Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
          <CardDescription>Real-time status of all buses in your fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => {
                const occupancyPercentage = bus.capacity > 0 ? (bus.currentPassengers / bus.capacity) * 100 : 0;
                const isOverCapacity = occupancyPercentage > 100;
                
                return (
                  <TableRow key={bus.id} data-testid={`row-bus-${bus.id}`}>
                    <TableCell className="font-medium">Bus {bus.busNumber}</TableCell>
                    <TableCell>{bus.route}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={bus.status === 'active' ? 'default' : bus.status === 'maintenance' ? 'destructive' : 'secondary'}
                      >
                        {bus.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex justify-between text-sm">
                          <span>{bus.currentPassengers}/{bus.capacity}</span>
                          <span className={isOverCapacity ? 'text-destructive' : ''}>
                            {Math.round(occupancyPercentage)}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(occupancyPercentage, 100)} 
                          className="h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{bus.location}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(bus.lastSeen).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" data-testid={`button-track-${bus.id}`}>
                          <i className="fas fa-map-marker-alt"></i>
                        </Button>
                        <Button size="sm" variant="ghost" data-testid={`button-contact-${bus.id}`}>
                          <i className="fas fa-phone"></i>
                        </Button>
                        <Button size="sm" variant="ghost" data-testid={`button-details-${bus.id}`}>
                          <i className="fas fa-info-circle"></i>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {buses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <i className="fas fa-route text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">No buses to dispatch</h3>
              <p className="text-muted-foreground mb-4">Add buses to your fleet to start dispatching.</p>
              <Button data-testid="button-add-buses">
                <i className="fas fa-plus mr-2"></i>
                Add Buses
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}