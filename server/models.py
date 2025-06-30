# models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class Users(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default='user')

    orders = db.relationship('Orders', back_populates='user', cascade="all, delete-orphan")
    cart_items = db.relationship('Cart_item', back_populates='users', cascade="all, delete-orphan")

    @property
    def password_hash(self):
        raise AttributeError('password hash is not a readable attribute')

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = generate_password_hash(password)

    def check_password(self, password):
        # print(f"Checking password: '{password}' against hash: '{self._password_hash}'") # Debugging line
        return check_password_hash(self._password_hash, password)

    def to_dict(self):
        return {
           'id':self.id,
            'name':self.name,
            'email':self.email,
            'role':self.role
        }

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Invalid email format")
        return email

    @validates('role')
    def validate_role(self, key, role):
        if role not in ['admin', 'user']:
            raise ValueError("Role must be either 'admin' or 'user'")
        return role

class Products(db.Model, SerializerMixin):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    price = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String)

    cart_items = db.relationship('Cart_item', back_populates='product', cascade="all, delete-orphan")
    order_items = db.relationship('Order_item', back_populates='product', cascade="all, delete-orphan")

    def to_dict(self):
        return {
           'id':self.id,
            'name':self.name,
            'description':self.description,
            'price':self.price,
            'stock_quantity':self.stock_quantity,
            'image_url':self.image_url,
        }

    @validates('price')
    def validate_price(self, key, price):
        if price < 0:
            raise ValueError("Price cannot be negative")
        return price

    @validates('stock_quantity')
    def validate_stock(self, key, qty):
        if qty < 0:
            raise ValueError("Stock quantity cannot be negative")
        return qty

class Orders(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String)
    total_amount = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('Users', back_populates='orders')
    order_items = db.relationship('Order_item', back_populates='order', cascade="all, delete-orphan")

    def to_dict(self):
        order_data = {
           'id': self.id,
            'order_date': self.order_date.isoformat(),
            'status': self.status,
            'total_amount': self.total_amount,
            'user_id': self.user_id,
        }
        order_data['order_items'] = [] # Change 'items' to 'order_items' for consistency with frontend checkout
        for order_item in self.order_items:
            item_dict = order_item.to_dict()
            if order_item.product:
                item_dict['product_name'] = order_item.product.name # Use product_name for clarity
                item_dict['image_url'] = order_item.product.image_url
            order_data['order_items'].append(item_dict)
        return order_data

class Cart_item(db.Model, SerializerMixin):
    __tablename__ = 'cart_item'
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id')) # Changed to Integer
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))

    users = db.relationship('Users', back_populates='cart_items')
    product = db.relationship('Products', back_populates='cart_items')

    def to_dict(self):
        product_data = {}
        if self.product:
            product_data = {
                'id': self.product.id, # Product's actual ID
                'name': self.product.name,
                'description': self.product.description,
                'price': self.product.price,
                'stock_quantity': self.product.stock_quantity,
                'image_url': self.product.image_url, # Corrected from 'image' to 'image_url'
            }
        return {
           'id': self.id, # Cart_item ID
            'quantity': self.quantity,
            'user_id': self.user_id,
            'product_id': self.product_id, # Cart_item's FK to product
            'product': product_data # Nested product data for frontend access
        }

    @validates('quantity')
    def validate_quantity(self, key, qty):
        if qty <= 0:
            raise ValueError("Quantity must be greater than 0")
        return qty

class Order_item(db.Model, SerializerMixin):
    __tablename__ = 'order_item'
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer)
    price_at_purchase = db.Column(db.Float)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))

    order = db.relationship('Orders', back_populates='order_items')
    product = db.relationship('Products', back_populates='order_items')

    def to_dict(self):
        item_data = {
           'id':self.id,
            'quantity':self.quantity,
            'price_at_purchase':self.price_at_purchase,
            'product_id':self.product_id,
            'order_id':self.order_id,
        }
        # Add product name for convenience in frontend display
        if self.product:
            item_data['product_name'] = self.product.name
        return item_data

    @validates('quantity')
    def validate_quantity(self, key, value):
        if value <= 0:
            raise ValueError("Quantity must be greater than 0")
        return value

    @validates('price_at_purchase')
    def validate_price(self, key, value):
        if value < 0:
            raise ValueError("Price at purchase must be non-negative")
        return value