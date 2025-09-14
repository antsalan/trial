import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Station } from "@shared/schema";

export default function Stations() {
  const { isConnected } = useWebSocket();
  
  const { data: stations = [], isLoading } = useQuery<Station[]>({
    queryKey: ['/api/stations/active'],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Station Management</h1>
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
          <h1 className="text-2xl font-bold">Station Management</h1>
          <p className="text-muted-foreground">Monitor passenger activity at bus stations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`status-indicator ${isConnected ? 'status-online pulse' : 'status-offline'}`}></span>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button data-testid="button-add-station">
            <i className="fas fa-plus mr-2"></i>
            Add Station
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => {
          const isHighActivity = station.waitingPassengers > 15;
          const isMediumActivity = station.waitingPassengers > 5;

          return (
            <Card key={station.id} className="relative" data-testid={`card-station-${station.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <Badge 
                    variant={station.status === 'active' ? 'default' : 'secondary'}
                    data-testid={`badge-status-${station.id}`}
                  >
                    {station.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {station.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Waiting Passengers</span>
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`text-lg font-semibold ${
                          isHighActivity ? 'text-destructive' : 
                          isMediumActivity ? 'text-yellow-600' : 'text-green-600'
                        }`}
                        data-testid={`text-waiting-${station.id}`}
                      >
                        {station.waitingPassengers}
                      </span>
                      <i className={`fas fa-users ${
                        isHighActivity ? 'text-destructive' : 
                        isMediumActivity ? 'text-yellow-600' : 'text-green-600'
                      }`}></i>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Activity Level</span>
                    <Badge 
                      variant={isHighActivity ? 'destructive' : isMediumActivity ? 'secondary' : 'default'}
                      data-testid={`badge-activity-${station.id}`}
                    >
                      {isHighActivity ? 'High' : isMediumActivity ? 'Medium' : 'Low'}
                    </Badge>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span className="text-right text-xs">{new Date(station.lastUpdate).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-details-${station.id}`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${station.id}`}>
                    <i className="fas fa-eye mr-1"></i>
                    View
                  </Button>
                </div>

                {isHighActivity && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-3">
                    <div className="flex items-center space-x-2 text-destructive text-sm">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span className="font-medium">High passenger volume at this station</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <i className="fas fa-map-marker-alt text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">No stations found</h3>
          <p className="text-muted-foreground mb-4">Add bus stations to monitor passenger activity.</p>
          <Button data-testid="button-add-first-station">
            <i className="fas fa-plus mr-2"></i>
            Add Your First Station
          </Button>
        </div>
      )}
    </div>
  );
}