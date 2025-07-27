import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Star, 
  Sparkles, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  RefreshCw,
  Crown,
  Settings
} from "lucide-react";

const Dashboard = () => {
  const [user] = useState({
    name: "Sarah",
    email: "sarah@example.com",
    zodiacSign: "Scorpio",
    symbol: "♏",
    joinDate: "March 2024",
    membershipType: "free"
  });

  const [dailyLimits] = useState({
    compatibilityChecks: { used: 2, total: 3 },
    freeReadings: { used: 1, total: 1 }
  });

  const [todaysHoroscope] = useState({
    love: "Venus is shining brightly in your love sector today, bringing opportunities for deep romantic connections. Trust your intuition when it comes to matters of the heart.",
    mood: "Passionate",
    luckyNumber: 7,
    compatibility: "Cancer",
    luckyTime: "2:00 PM - 4:00 PM"
  });

  const [recentReadings] = useState([
    {
      id: 1,
      type: "Soul Mate Analysis",
      partner: "Leo",
      score: 87,
      date: "2 days ago",
      status: "completed"
    },
    {
      id: 2,
      type: "Compatibility Check",
      partner: "Virgo",
      score: 72,
      date: "5 days ago",
      status: "completed"
    }
  ]);

  const [recommendedServices] = useState([
    {
      title: "Weekly Love Forecast",
      description: "Get detailed predictions for the week ahead",
      price: "$2.99",
      icon: Calendar,
      discount: "25% off"
    },
    {
      title: "Birth Chart Compatibility",
      description: "Deep dive into astrological matching",
      price: "$6.99",
      icon: Star,
      popular: true
    }
  ]);

  const refreshHoroscope = () => {
    console.log("Refreshing horoscope...");
    // TODO: Implement horoscope refresh
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-muted-foreground flex items-center space-x-2">
              <span className="text-2xl">{user.symbol}</span>
              <span>{user.zodiacSign} • Member since {user.joinDate}</span>
              {user.membershipType === "premium" && (
                <Crown className="h-5 w-5 text-secondary ml-2" />
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Love Horoscope */}
              <Card className="cosmic-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold text-foreground flex items-center">
                    <Heart className="h-6 w-6 text-primary mr-2" />
                    Today's Love Horoscope
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={refreshHoroscope}
                    className="cosmic-card border-primary/30"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">{todaysHoroscope.love}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 cosmic-card">
                      <div className="text-sm text-muted-foreground">Mood</div>
                      <div className="font-semibold text-accent">{todaysHoroscope.mood}</div>
                    </div>
                    <div className="text-center p-3 cosmic-card">
                      <div className="text-sm text-muted-foreground">Lucky #</div>
                      <div className="font-semibold text-secondary">{todaysHoroscope.luckyNumber}</div>
                    </div>
                    <div className="text-center p-3 cosmic-card">
                      <div className="text-sm text-muted-foreground">Best Match</div>
                      <div className="font-semibold text-primary">{todaysHoroscope.compatibility}</div>
                    </div>
                    <div className="text-center p-3 cosmic-card">
                      <div className="text-sm text-muted-foreground">Lucky Time</div>
                      <div className="font-semibold text-foreground text-xs">{todaysHoroscope.luckyTime}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Daily Limits */}
              <Card className="cosmic-card p-6">
                <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-accent mr-2" />
                  Daily Usage
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground">Compatibility Checks</span>
                      <span className="text-sm text-muted-foreground">
                        {dailyLimits.compatibilityChecks.used}/{dailyLimits.compatibilityChecks.total}
                      </span>
                    </div>
                    <Progress 
                      value={(dailyLimits.compatibilityChecks.used / dailyLimits.compatibilityChecks.total) * 100} 
                      className="h-2"
                    />
                    {dailyLimits.compatibilityChecks.used >= dailyLimits.compatibilityChecks.total && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Limit reached. <Button variant="link" className="p-0 h-auto text-primary">Upgrade for unlimited</Button>
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Recent Readings */}
              <Card className="cosmic-card p-6">
                <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-secondary mr-2" />
                  Recent Readings
                </h3>
                
                <div className="space-y-4">
                  {recentReadings.map((reading) => (
                    <div key={reading.id} className="flex items-center justify-between p-4 cosmic-card">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-cosmic flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{reading.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {reading.partner} • {reading.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{reading.score}%</div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full cosmic-card border-primary/30">
                    View All Readings
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account */}
              <Card className="cosmic-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-foreground">Account</h3>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Membership</span>
                    <Badge variant={user.membershipType === "premium" ? "default" : "secondary"}>
                      {user.membershipType === "premium" ? "Premium" : "Free"}
                    </Badge>
                  </div>
                  
                  {user.membershipType === "free" && (
                    <Button className="cosmic-button w-full">
                      Upgrade to Premium
                    </Button>
                  )}
                </div>
              </Card>

              {/* Recommended Services */}
              <Card className="cosmic-card p-6">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-accent mr-2" />
                  Recommended
                </h3>
                
                <div className="space-y-4">
                  {recommendedServices.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <div key={index} className="p-4 cosmic-card space-y-3">
                        <div className="flex items-start space-x-3">
                          <IconComponent className="h-6 w-6 text-primary mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{service.title}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-primary">{service.price}</span>
                            {service.discount && (
                              <Badge className="bg-secondary text-secondary-foreground text-xs">
                                {service.discount}
                              </Badge>
                            )}
                            {service.popular && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button size="sm" className="cosmic-button w-full">
                          Get Reading
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="cosmic-card p-6">
                <h3 className="font-display font-bold text-foreground mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start cosmic-card border-primary/30">
                    <Heart className="h-4 w-4 mr-2" />
                    Compatibility Check
                  </Button>
                  <Button variant="outline" className="w-full justify-start cosmic-card border-primary/30">
                    <Star className="h-4 w-4 mr-2" />
                    View All Services
                  </Button>
                  <Button variant="outline" className="w-full justify-start cosmic-card border-primary/30">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Friends
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;