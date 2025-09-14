import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Bus } from "@shared/schema";

export default function Buses() {
  const { isConnected } = useWebSocket();
  
  const { data: buses = [], isLoading } = useQuery<Bus[]>({
    queryKey: ['/api/buses/active'],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bus Management</h1>
          <div className="flex items-center space-x-2">
            <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded w-full mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bus Management</h1>
          <p className="text-muted-foreground">Monitor and manage your bus fleet</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button data-testid="button-add-bus">
            <i className="fas fa-plus mr-2"></i>
            Add Bus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => {
          const occupancyPercentage = bus.capacity > 0 ? (bus.currentPassengers / bus.capacity) * 100 : 0;
          const isOverCapacity = occupancyPercentage > 100;
          const isNearCapacity = occupancyPercentage > 80;

          return (
            <Card key={bus.id} className="relative" data-testid={`card-bus-${bus.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Bus {bus.busNumber}</CardTitle>
                  <Badge 
                    variant={bus.status === 'active' ? 'default' : bus.status === 'maintenance' ? 'destructive' : 'secondary'}
                    data-testid={`badge-status-${bus.id}`}
                  >
                    {bus.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  Route: {bus.route}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Passengers</span>
                    <span className={isOverCapacity ? 'text-destructive font-semibold' : ''}>
                      {bus.currentPassengers} / {bus.capacity}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(occupancyPercentage, 100)} 
                    className="h-2"
                    data-testid={`progress-occupancy-${bus.id}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(occupancyPercentage)}% occupied</span>
                    {isOverCapacity && <span className="text-destructive">Over capacity!</span>}
                    {isNearCapacity && !isOverCapacity && <span className="text-yellow-600">Near capacity</span>}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right" data-testid={`text-location-${bus.id}`}>{bus.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span className="text-right text-xs">{new Date(bus.lastSeen).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-details-${bus.id}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-track-${bus.id}`}>
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {buses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <i className="fas fa-bus text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">No buses found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first bus to the fleet.</p>
          <Button data-testid="button-add-first-bus">
            <i className="fas fa-plus mr-2"></i>
            Add Your First Bus
          </Button>
        </div>
      )}
    </div>
  );
}