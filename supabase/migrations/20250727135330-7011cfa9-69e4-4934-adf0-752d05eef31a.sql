-- Create services table to define available astrology services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'horoscope', 'compatibility', 'tarot', 'numerology', etc.
  price_credits INTEGER DEFAULT 0, -- 0 for free services
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create readings table to store user reading history
CREATE TABLE public.readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  reading_type TEXT NOT NULL, -- 'daily_horoscope', 'love_compatibility', 'tarot', etc.
  metadata JSONB, -- for storing additional data like partner zodiac sign, card spreads, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create horoscopes table for storing daily/weekly/monthly horoscopes
CREATE TABLE public.horoscopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zodiac_sign TEXT NOT NULL,
  horoscope_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  date_for DATE NOT NULL, -- the date this horoscope is for
  content TEXT NOT NULL,
  love_forecast TEXT,
  career_forecast TEXT,
  health_forecast TEXT,
  lucky_numbers INTEGER[],
  lucky_colors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(zodiac_sign, horoscope_type, date_for)
);

-- Create compatibility_reports table for love compatibility readings
CREATE TABLE public.compatibility_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_zodiac TEXT NOT NULL,
  partner_zodiac TEXT NOT NULL,
  compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  overall_summary TEXT NOT NULL,
  love_compatibility TEXT,
  friendship_compatibility TEXT,
  communication_style TEXT,
  challenges TEXT,
  strengths TEXT,
  advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table for storing user settings and preferences
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_horoscope_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  preferred_reading_time TIME DEFAULT '09:00:00',
  favorite_services TEXT[] DEFAULT '{}',
  credits_balance INTEGER DEFAULT 10, -- starting credits for new users
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'premium', 'pro'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for services table (public read access)
CREATE POLICY "Anyone can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Create policies for readings table
CREATE POLICY "Users can view their own readings" 
ON public.readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own readings" 
ON public.readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for horoscopes table (public read access)
CREATE POLICY "Anyone can view horoscopes" 
ON public.horoscopes 
FOR SELECT 
USING (true);

-- Create policies for compatibility_reports table
CREATE POLICY "Users can view their own compatibility reports" 
ON public.compatibility_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compatibility reports" 
ON public.compatibility_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for user_preferences table
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for timestamp updates
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to initialize user preferences when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create preferences when profile is created
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_preferences();

-- Insert initial services data
INSERT INTO public.services (name, description, category, price_credits, is_premium) VALUES
('Daily Horoscope', 'Get your personalized daily horoscope based on your zodiac sign', 'horoscope', 0, false),
('Weekly Horoscope', 'Detailed weekly forecast for love, career, and personal growth', 'horoscope', 2, false),
('Monthly Horoscope', 'Comprehensive monthly astrological guidance', 'horoscope', 5, false),
('Love Compatibility', 'Discover your romantic compatibility with any zodiac sign', 'compatibility', 3, false),
('Friendship Compatibility', 'Explore friendship dynamics between zodiac signs', 'compatibility', 2, false),
('Tarot Reading', 'Get insights with a personalized 3-card tarot spread', 'tarot', 8, true),
('Celtic Cross Tarot', 'Deep dive with a comprehensive 10-card Celtic Cross reading', 'tarot', 15, true),
('Numerology Report', 'Discover your life path number and personal numerology', 'numerology', 6, true),
('Birth Chart Analysis', 'Complete natal chart reading with planetary positions', 'astrology', 20, true),
('Crystal Guidance', 'Find the perfect crystals for your current energy needs', 'crystal', 4, false);