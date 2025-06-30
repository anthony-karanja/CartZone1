# seed.py
from app import app
from models import db, Users, Products, Cart_item, Orders, Order_item
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash

with app.app_context():

    # Optional: Clear all data
    db.session.query(Order_item).delete()
    db.session.query(Cart_item).delete()
    db.session.query(Orders).delete()
    db.session.query(Products).delete()
    db.session.query(Users).delete()

    db.session.commit()

    print(" Seeding users...")

    user1 = Users(name="Alice", email="alice@example.com", password_hash="password123", role="admin")
    user2 = Users(name="Bob", email="bob@example.com", password_hash="password456", role="user") 
    db.session.add_all([user1, user2])
    db.session.commit()

    print(" Seeding products...")

    p1 = Products(
        name="Laptop", description="Powerful laptop", price=15000.00,
        stock_quantity=10, image_url="https://i.pinimg.com/736x/c9/71/c4/c971c4efdcfe6c6c7784c22eb514d45e.jpg"
    )
    p2 = Products(
        name="Smartphone", description="Android phone", price=28000.00,
        stock_quantity=25, image_url="https://i.pinimg.com/736x/84/39/90/843990f9e631091df25ba5a3ab6d3543.jpg"
    )
    p3 = Products(
        name="Charger", description="Android charger", price=800.00, # Capitalized 'Charger'
        stock_quantity=25, image_url="https://i.pinimg.com/736x/5d/2f/65/5d2f65985f9722fb09c24cc742dc3a8d.jpg"
    )

    db.session.add_all([p1, p2, p3]) # Add p3 as well
    db.session.commit()

    print(" Seeding cart items...")

    cart1 = Cart_item(user_id=user1.id, product_id=p1.id, quantity=1)
    cart2 = Cart_item(user_id=user1.id, product_id=p2.id, quantity=2)
    # Add a cart item for user2 as well to test non-admin user cart
    cart3 = Cart_item(user_id=user2.id, product_id=p3.id, quantity=5)


    db.session.add_all([cart1, cart2, cart3])
    db.session.commit()

    print(" Seeding order...")

    order = Orders(
        user_id=user1.id,
        order_date = datetime.now(timezone.utc),
        status="Processing", # Changed from Pending to Processing
        total_amount=0
    )
    db.session.add(order)
    db.session.flush()

    item1 = Order_item(
        order_id=order.id,
        product_id=p1.id,
        quantity=1,
        price_at_purchase=p1.price
    )
    item2 = Order_item(
        order_id=order.id,
        product_id=p2.id,
        quantity=2,
        price_at_purchase=p2.price
    )

    total = (item1.quantity * item1.price_at_purchase) + (item2.quantity * item2.price_at_purchase)
    order.total_amount = total

    db.session.add_all([item1, item2])
    db.session.commit()

    print(" Seed complete.")