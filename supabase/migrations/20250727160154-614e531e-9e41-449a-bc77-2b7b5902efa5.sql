-- Update existing services with new prices (convert £ to pence)

-- One-Time Payments (£4.99 each = 499 pence)
UPDATE services SET price_credits = 499 WHERE name = 'Soul Mate Analysis';
UPDATE services SET price_credits = 499 WHERE name = 'Weekly Love Forecast';
UPDATE services SET price_credits = 499 WHERE name = 'Birth Chart Compatibility';
UPDATE services SET price_credits = 499 WHERE name = 'Birth Chart Analysis';
UPDATE services SET price_credits = 499 WHERE name = 'Celtic Cross Tarot';
UPDATE services SET price_credits = 499 WHERE name = 'Tarot Reading';
UPDATE services SET price_credits = 499 WHERE name = 'Numerology Report';

-- Monthly Subscriptions
UPDATE services SET price_credits = 799 WHERE name = 'Monthly Astro Calendar'; -- £7.99/month = 799 pence
UPDATE services SET price_credits = 499 WHERE name = 'Moon Phase Love Guide'; -- £4.99 one-time

-- Premium One-Time Services
UPDATE services SET price_credits = 1499 WHERE name = 'Relationship Timeline Planner'; -- £14.99 = 1499 pence
UPDATE services SET price_credits = 1499 WHERE name = 'Couples Dashboard'; -- £14.99 = 1499 pence

-- Insert missing services
INSERT INTO services (name, description, category, price_credits, is_premium, is_active) VALUES
('Zodiac Personality Profile', 'Complete personality breakdown based on your zodiac sign with relationship and career insights', 'profiles', 499, true, true),
('Monthly Unlimited', 'Unlimited access to all services for a month', 'subscription', 2499, true, true),
('Complete Reading Package', 'Bundle of our most popular readings at a discounted price', 'bundle', 1999, true, true)
ON CONFLICT (name) DO UPDATE SET 
    price_credits = EXCLUDED.price_credits,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_premium = EXCLUDED.is_premium;