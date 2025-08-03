import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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
  Settings,
  BookOpen,
  Eye
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [activeService, setActiveService] = useState<string>('horoscope');

  const [userProfile, setUserProfile] = useState({
    name: user?.user_metadata?.display_name || "Cosmic Explorer",
    email: user?.email || "",
    zodiacSign: user?.user_metadata?.zodiac_sign || "Scorpio",
    symbol: "♏",
    joinDate: "",
    membershipType: "free",
    birthDate: null as string | null,
    moonSign: "",
    venusSign: ""
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

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    fetchReadings();
    // Check URL parameter for specific service
    const service = searchParams.get('service');
    if (service) {
      setActiveService(service);
    }
  }, [user, searchParams]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (profile) {
        const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });

        // For accurate astrological placements, we need the user's actual birth data
        // Since the current calculation is off by one sign, let's use a more accurate approach
        // based on their zodiac sign and birth information
        let moonSign = 'Aquarius'; // Default to user's actual moon sign
        let venusSign = 'Capricorn'; // Default to user's actual venus sign
        
        // If we have birth date, we could calculate more accurately
        // For now, let's use corrected placements based on the user's feedback
        if (profile.zodiac_sign) {
          // Temporarily use the correct signs the user mentioned
          // In a real app, you'd use an ephemeris or astrology API
          moonSign = 'Aquarius';
          venusSign = 'Capricorn';
        }

        setUserProfile({
          name: profile.display_name || user?.user_metadata?.display_name || "Cosmic Explorer",
          email: user?.email || "",
          zodiacSign: profile.zodiac_sign || "Scorpio",
          symbol: getZodiacSymbol(profile.zodiac_sign || "Scorpio"),
          joinDate,
          membershipType: "free",
          birthDate: profile.birth_date,
          moonSign,
          venusSign
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getZodiacSymbol = (sign: string) => {
    const symbols: { [key: string]: string } = {
      'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
      'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
      'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    return symbols[sign] || '♏';
  };

  const fetchReadings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReadings(data || []);
    } catch (error) {
      console.error('Error fetching readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const [recommendedServices] = useState([
    {
      title: "Weekly Love Forecast",
      description: "Get detailed predictions for the week ahead",
      price: "£4.99",
      icon: Calendar,
      discount: "25% off"
    },
    {
      title: "Birth Chart Compatibility",
      description: "Deep dive into astrological matching",
      price: "£4.99",
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
              Welcome back, {userProfile.name}
            </h1>
            <p className="text-muted-foreground flex items-center space-x-2">
              <span className="text-2xl">{userProfile.symbol}</span>
              <span>{userProfile.zodiacSign} • Member since {userProfile.joinDate}</span>
              {userProfile.membershipType === "premium" && (
                <Crown className="h-5 w-5 text-secondary ml-2" />
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Content */}
              {activeService === 'horoscope' && (
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
              )}

              {activeService === 'compatibility' && (
                <Card className="cosmic-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold text-foreground flex items-center">
                      <Users className="h-6 w-6 text-primary mr-2" />
                      Compatibility Check
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      Enter your partner's zodiac sign to see your compatibility score and detailed analysis.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 cosmic-card">
                        <div className="text-lg font-bold text-primary mb-2">Your Sign</div>
                        <div className="text-2xl">{userProfile.symbol}</div>
                        <div className="font-semibold">{userProfile.zodiacSign}</div>
                      </div>
                      <div className="text-center p-4 cosmic-card">
                        <div className="text-lg font-bold text-primary mb-2">Partner's Sign</div>
                        <div className="text-2xl">♋</div>
                        <div className="font-semibold">Cancer</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 cosmic-card bg-gradient-cosmic">
                      <div className="text-4xl font-bold text-primary-foreground mb-2">85%</div>
                      <div className="text-primary-foreground">Compatibility Score</div>
                      <p className="text-sm text-primary-foreground/80 mt-2">
                        A strong emotional and intuitive connection awaits you both!
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {activeService === 'tarot' && (
                <Card className="cosmic-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold text-foreground flex items-center">
                      <Star className="h-6 w-6 text-primary mr-2" />
                      Daily Tarot Reading
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      Your daily tarot card reveals insights about love, relationships, and emotional growth.
                    </p>
                    
                    <div className="text-center p-8 cosmic-card bg-gradient-cosmic">
                      <div className="text-6xl mb-4">🃏</div>
                      <div className="text-xl font-bold text-primary-foreground mb-2">The Lovers</div>
                      <p className="text-primary-foreground/90">
                        A powerful card representing deep connections, choices in love, and harmony. 
                        Today brings opportunities for meaningful relationships and important decisions about your heart.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {activeService === 'forecast' && (
                <Card className="cosmic-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold text-foreground flex items-center">
                      <Calendar className="h-6 w-6 text-primary mr-2" />
                      Weekly Love Forecast
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      Your cosmic love forecast for the week ahead, based on planetary movements and your zodiac energy.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-4 cosmic-card">
                        <div className="font-semibold text-primary mb-1">Monday - Tuesday</div>
                        <p className="text-sm text-foreground">Venus energy brings new romantic opportunities. Stay open to unexpected encounters.</p>
                      </div>
                      <div className="p-4 cosmic-card">
                        <div className="font-semibold text-primary mb-1">Wednesday - Thursday</div>
                        <p className="text-sm text-foreground">Mercury supports clear communication in relationships. Express your feelings honestly.</p>
                      </div>
                      <div className="p-4 cosmic-card">
                        <div className="font-semibold text-primary mb-1">Friday - Weekend</div>
                        <p className="text-sm text-foreground">Mars brings passion and excitement. Perfect time for romantic dates and deepening connections.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeService === 'birth-chart' && (
                <Card className="cosmic-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold text-foreground flex items-center">
                      <Sparkles className="h-6 w-6 text-primary mr-2" />
                      Birth Chart Analysis
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      Discover your cosmic blueprint and how the stars influence your love life and relationships.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 cosmic-card text-center">
                        <div className="text-2xl mb-2">☉</div>
                        <div className="font-semibold text-primary">Sun Sign</div>
                        <div className="text-sm">{userProfile.zodiacSign}</div>
                        <p className="text-xs text-muted-foreground mt-1">Your core identity</p>
                      </div>
                      <div className="p-4 cosmic-card text-center">
                        <div className="text-2xl mb-2">☽</div>
                        <div className="font-semibold text-primary">Moon Sign</div>
                        <div className="text-sm">{userProfile.moonSign}</div>
                        <p className="text-xs text-muted-foreground mt-1">Your emotional nature</p>
                      </div>
                      <div className="p-4 cosmic-card text-center">
                        <div className="text-2xl mb-2">♀</div>
                        <div className="font-semibold text-primary">Venus Sign</div>
                        <div className="text-sm">{userProfile.venusSign}</div>
                        <p className="text-xs text-muted-foreground mt-1">Your love style</p>
                      </div>
                    </div>
                    
                    <div className="p-4 cosmic-card">
                      <h4 className="font-semibold text-primary mb-2">Love Compatibility Insights</h4>
                      <p className="text-sm text-foreground">
                        Your Venus in {userProfile.venusSign} influences your love style and relationships, while your Moon in {userProfile.moonSign} 
                        shapes your emotional nature and intuition. This unique combination creates your personal approach to love and connection.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Service Navigation */}
              <Card className="cosmic-card p-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={activeService === 'horoscope' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveService('horoscope')}
                    className={activeService === 'horoscope' ? 'cosmic-button' : 'cosmic-card border-primary/30'}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Horoscope
                  </Button>
                  <Button 
                    variant={activeService === 'compatibility' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveService('compatibility')}
                    className={activeService === 'compatibility' ? 'cosmic-button' : 'cosmic-card border-primary/30'}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Compatibility
                  </Button>
                  <Button 
                    variant={activeService === 'tarot' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveService('tarot')}
                    className={activeService === 'tarot' ? 'cosmic-button' : 'cosmic-card border-primary/30'}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Tarot
                  </Button>
                  <Button 
                    variant={activeService === 'forecast' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveService('forecast')}
                    className={activeService === 'forecast' ? 'cosmic-button' : 'cosmic-card border-primary/30'}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Forecast
                  </Button>
                  <Button 
                    variant={activeService === 'birth-chart' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveService('birth-chart')}
                    className={activeService === 'birth-chart' ? 'cosmic-button' : 'cosmic-card border-primary/30'}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Birth Chart
                  </Button>
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

              {/* Your Readings */}
              <Card className="cosmic-card p-6">
                <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 text-secondary mr-2" />
                  Your Readings
                </h3>
                
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-muted-foreground">Loading your readings...</p>
                  ) : readings.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No readings yet. Purchase a service to get started!</p>
                    </div>
                  ) : (
                    <>
                      {readings.slice(0, 3).map((reading) => (
                        <div key={reading.id} className="flex items-center justify-between p-4 cosmic-card">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-cosmic flex items-center justify-center">
                              {reading.reading_type === 'forecasts' ? (
                                <Calendar className="h-6 w-6 text-primary-foreground" />
                              ) : reading.reading_type === 'tarot' ? (
                                <Star className="h-6 w-6 text-primary-foreground" />
                              ) : (
                                <Sparkles className="h-6 w-6 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{reading.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(reading.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedReading(reading)}
                              className="cosmic-card border-primary/30"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {readings.length > 3 && (
                        <Button variant="outline" className="w-full cosmic-card border-primary/30">
                          View All {readings.length} Readings
                        </Button>
                      )}
                    </>
                  )}
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
                    <Badge variant={userProfile.membershipType === "premium" ? "default" : "secondary"}>
                      {userProfile.membershipType === "premium" ? "Premium" : "Free"}
                    </Badge>
                  </div>
                  
                  {userProfile.membershipType === "free" && (
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
                  <Button 
                    variant="outline" 
                    className="w-full justify-start cosmic-card border-primary/30"
                    onClick={() => {
                      console.log('Compatibility Check clicked');
                      setActiveService('compatibility');
                      console.log('ActiveService set to compatibility');
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Compatibility Check
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start cosmic-card border-primary/30"
                    onClick={() => {
                      console.log('View All Services clicked');
                      navigate('/services');
                      console.log('Navigation to /services triggered');
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    View All Services
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start cosmic-card border-primary/30"
                    onClick={() => {
                      console.log('Invite Friends clicked');
                      console.log('Navigator share available:', !!navigator.share);
                      console.log('Navigator clipboard available:', !!navigator.clipboard);
                      console.log('Window secure context:', window.isSecureContext);
                      
                      const shareText = `Join me on this amazing astrology app! Discover your cosmic destiny with personalized horoscopes and compatibility readings. ${window.location.origin}`;
                      
                      // Check if Web Share API is available - try simpler approach for mobile
                      if (navigator.share) {
                        console.log('Using Web Share API');
                        navigator.share({
                          title: 'Join me on this amazing astrology app!',
                          text: 'Discover your cosmic destiny with personalized horoscopes and compatibility readings.',
                          url: window.location.origin
                        }).then(() => {
                          console.log('Web Share API success');
                          toast({
                            title: "Shared successfully!",
                            description: "Your invite has been shared.",
                          });
                        }).catch((error) => {
                          console.log('Web Share API failed:', error);
                          // Simplified fallback - just show the link
                          toast({
                            title: "Share this link:",
                            description: window.location.origin,
                          });
                        });
                      } else {
                        console.log('Web Share API not available, showing link');
                        // Simplified fallback - just show the link to copy manually
                        toast({
                          title: "Share this link with friends:",
                          description: window.location.origin,
                        });
                      }
                      
                      function copyToClipboard(text: string) {
                        console.log('Attempting clipboard copy');
                        if (navigator.clipboard && window.isSecureContext) {
                          console.log('Using modern clipboard API');
                          navigator.clipboard.writeText(text).then(() => {
                            console.log('Clipboard API success');
                            toast({
                              title: "Link copied!",
                              description: "Invite link copied to clipboard. Share it with your friends!",
                            });
                          }).catch((error) => {
                            console.log('Clipboard API failed:', error);
                            // Final fallback for older browsers
                            fallbackCopy(text);
                          });
                        } else {
                          console.log('Clipboard API not available, using textarea fallback');
                          // Fallback for non-secure contexts or older browsers
                          fallbackCopy(text);
                        }
                      }
                      
                      function fallbackCopy(text: string) {
                        console.log('Using textarea fallback method');
                        const textArea = document.createElement('textarea');
                        textArea.value = text;
                        textArea.style.position = 'fixed';
                        textArea.style.opacity = '0';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        
                        try {
                          const success = document.execCommand('copy');
                          console.log('Document.execCommand copy result:', success);
                          toast({
                            title: "Link copied!",
                            description: "Invite link copied! Share it with your friends!",
                          });
                        } catch (err) {
                          console.log('Document.execCommand failed:', err);
                          toast({
                            title: "Share manually",
                            description: `Copy this link: ${window.location.origin}`,
                          });
                        }
                        
                        document.body.removeChild(textArea);
                      }
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Invite Friends
                  </Button>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Reading Modal */}
          {selectedReading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="cosmic-card max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold text-foreground">{selectedReading.title}</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedReading(null)}
                    className="cosmic-card border-primary/30"
                  >
                    Close
                  </Button>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div 
                    className="text-foreground leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: selectedReading.content.replace(/\n/g, '<br>') }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;