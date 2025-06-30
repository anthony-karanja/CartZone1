#  E-Commerce Platform

A simple e-commerce platform built with **Flask** (backend) and **React** (frontend). It supports user authentication (JWT), product uploads by admins, shopping cart functionality, and order management.

---

##  Features

- User registration & login (JWT-based auth)
- Role-based access control (admin/user)
- Admins can upload products with image URLs
- Users can view products, add to cart, and place orders
- Persistent storage using SQLAlchemy & SQLite
- Clean UI with React

---

##  Technologies

### Backend (Flask)
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS

### Frontend (React)
- React.js
- React Router
- Fetch API for backend communication

---

##  Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/anthony-karanja/CartZone.git
cd ecommerce
2. Backend Setup (Flask)
bash
Copy
Edit
cd Backend
pipenv install
pipenv shell

# Setup DB
flask db init
flask db migrate -m "initial"
flask db upgrade

# Seed data
python seed.py

# Run server
flask run
Flask server runs on http://localhost:5555

3. Frontend Setup (React)
bash
Copy
Edit
cd Frontend
npm install
npm run dev
React app runs on http://localhost:5173 

 Admin Credentials (Default)
These come from your seed file

bash
Copy
Edit
email: admin@example.com
password: admin123
role: admin
 Example Product Format (from seed.py)
python
Copy
Edit
Products(
    name="Jacket",
    description="Black windbreaker",
    price=1234,
    stock_quantity=23,
    image_url="https://i.pinimg.com/736x/3c/7d/88/3c7d88c5384efcb554d0a1aacb5d4574.jpg"
)
 API Endpoints (Sample)
Auth
POST /signup

POST /login

Products
GET /products

POST /products (admin only)

Cart
GET /cart

POST /cart

Orders
GET /orders

POST /orders

 To Do
Add product categories

Add image upload (instead of URL)

Payment integration

Responsive styling

 License
This project is licensed under the MIT License.

