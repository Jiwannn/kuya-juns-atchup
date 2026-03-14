-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, is_available) VALUES
('Classic Atchup Meal', 'Savory pork stew with vegetables and rice', 149.00, 'Packed Meals', '/images/atchup-classic.jpg', true),
('Special Sizzling Atchup', 'Sizzling pork atchup with extra toppings', 199.00, 'Packed Meals', '/images/atchup-special.jpg', true),
('Family Size Tray - Classic', 'Serves 4-6 persons with rice', 599.00, 'Food Trays', '/images/tray-classic.jpg', true),
('Family Size Tray - Special', 'Serves 6-8 persons with extra meat', 899.00, 'Food Trays', '/images/tray-special.jpg', true),
('Party Pack Atchup', 'Serves 10-12 persons perfect for events', 1499.00, 'Catering', '/images/party-pack.jpg', true),
('Atchup with Sizzling Plate', 'Complete sizzling plate experience', 249.00, 'Packed Meals', '/images/sizzling.jpg', true),
('Vegetable Atchup', 'Healthy vegetable version of our classic', 169.00, 'Packed Meals', '/images/vegetable.jpg', true);

-- Insert owner account (password: admin123 - you should change this)
-- Note: The password should be hashed using bcrypt
INSERT INTO users (email, name, password, provider) 
VALUES ('febiemosura983@gmail.com', 'Febie Mosura', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrN6eUxJZQqZqZqZqZqZqZqZqZqZqZu
', 'credentials');