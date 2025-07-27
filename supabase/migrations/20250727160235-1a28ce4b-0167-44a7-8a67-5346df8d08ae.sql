-- Update existing services with new prices (convert £ to pence)

-- One-Time Payments (£4.99 each = 499 pence)
UPDATE services SET price_credits = 499 WHERE name = 'Soul Mate Analysis';
UPDATE services SET price_credits = 499 WHERE name = 'Weekly Love Forecast';
UPDATE services SET price_credits = 499 WHERE name = 'Birth Chart Compatibility';
UPDATE services SET price_credits = 499 WHERE name = 'Birth Chart Analysis';
UPDATE services SET price_credits = 499 WHERE name = 'Celtic Cross Tarot';
UPDATE services SET price_credits = 499 WHERE name = 'Tarot Reading';
UPDATE services SET price_credits = 499 WHERE name = 'Numerology Report';

-- Update Zodiac Personality Profile if it exists, otherwise insert it
UPDATE services SET price_credits = 499 WHERE name = 'Zodiac Personality Profile';

-- Monthly Subscriptions
UPDATE services SET price_credits = 799 WHERE name = 'Monthly Astro Calendar'; -- £7.99/month = 799 pence
UPDATE services SET price_credits = 499 WHERE name = 'Moon Phase Love Guide'; -- £4.99 one-time

-- Premium One-Time Services
UPDATE services SET price_credits = 1499 WHERE name = 'Relationship Timeline Planner'; -- £14.99 = 1499 pence
UPDATE services SET price_credits = 1499 WHERE name = 'Couples Dashboard'; -- £14.99 = 1499 pence

-- Insert new services if they don't exist
INSERT INTO services (name, description, category, price_credits, is_premium, is_active) 
SELECT 'Monthly Unlimited', 'Unlimited access to all services for a month', 'subscription', 2499, true, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Monthly Unlimited');

INSERT INTO services (name, description, category, price_credits, is_premium, is_active) 
SELECT 'Complete Reading Package', 'Bundle of our most popular readings at a discounted price', 'bundle', 1999, true, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Complete Reading Package');