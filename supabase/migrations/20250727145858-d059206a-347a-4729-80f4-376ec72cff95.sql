-- Insert the 10 services into the existing services table
INSERT INTO public.services (name, description, category, price_credits, is_premium, is_active) VALUES
('Daily Love Horoscope', 'Start your day with cosmic guidance about your love life and romantic opportunities', 'daily', 0, false, true),
('Basic Compatibility Score', 'Quick compatibility check between any two zodiac signs. Get instant insights into your relationship potential', 'compatibility', 0, false, true),
('Soul Mate Analysis', 'Deep dive into your cosmic connection with detailed compatibility insights and relationship guidance', 'compatibility', 499, true, true),
('Weekly Love Forecast', 'Seven days of detailed romantic predictions covering love, dates, and relationship milestones', 'forecasts', 299, true, true),
('Birth Chart Compatibility', 'Advanced astrological matching using Sun, Moon, and Rising signs for deeper romantic insights', 'compatibility', 699, true, true),
('Zodiac Personality Profile', 'Complete personality breakdown based on your zodiac sign with relationship and career insights', 'profiles', 399, true, true),
('Moon Phase Love Guide', 'Monthly moon cycle guidance for romance. Learn when to start relationships and have important conversations', 'monthly', 499, true, true),
('Monthly Astro Calendar', '30-day personalized calendar with daily romantic guidance and cosmic event tracking', 'monthly', 799, true, true),
('Relationship Timeline Planner', '6-month relationship roadmap for couples with milestone predictions and compatibility cycles', 'planning', 999, true, true),
('Couples Dashboard', 'Joint account for couples with shared compatibility tracking and daily couples horoscope', 'premium', 1499, true, true);