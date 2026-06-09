import sys
import os
import random
from datetime import datetime, timedelta

# Add the parent directory to the path so python can locate the database and models folders
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.db import SessionLocal, engine, Base
from models.product import Product
from models.supplier import Supplier
from models.buyer import Buyer
from models.order import Order, OrderItem

def seed_database():
    print("Connecting to database...")
    db = SessionLocal()
    
    try:
        # 1. Clean existing data (cascade will clear OrderItem via Order)
        print("Clearing old data...")
        db.query(OrderItem).delete()
        db.query(Order).delete()
        db.query(Product).delete()
        db.query(Buyer).delete()
        db.query(Supplier).delete()
        db.commit()
        
        # 2. Seed Suppliers
        print("Seeding suppliers...")
        suppliers = [
            Supplier(name="Apex Electronics Corp", contact_person="John Doe", email="contact@apexelectronics.com", phone="+1 (555) 123-4567", address="123 Tech Way", city="San Jose", country="USA", payment_terms="Net 30"),
            Supplier(name="Global Garments Inc", contact_person="Jane Smith", email="sales@globalgarments.com", phone="+1 (555) 987-6543", address="456 Fashion Blvd", city="New York", country="USA", payment_terms="Net 60"),
            Supplier(name="Nourish Foods Ltd", contact_person="David Miller", email="wholesale@nourishfoods.com", phone="+44 20 7946 0958", address="78 Organic Lane", city="London", country="UK", payment_terms="COD"),
            Supplier(name="Homeland Goods Co", contact_person="Sarah Connor", email="orders@homelandgoods.com", phone="+1 (555) 362-9182", address="99 Shelter Dr", city="Austin", country="USA", payment_terms="Net 90"),
        ]
        for s in suppliers:
            db.add(s)
        db.flush() # flush to get IDs

        # 3. Seed Buyers (Customers)
        print("Seeding buyers...")
        buyers = [
            Buyer(name="Alice Johnson", shop_name="TechMart Electronics", contact_person="Alice Johnson", email="info@techmart.com", phone="+1 (555) 831-2947", address="707 Silicon Alley", city="San Francisco", country="USA", credit_limit=10000.0, account_status="active"),
            Buyer(name="Bob Smith", shop_name="GreenLeaf Grocers", contact_person="Bob Smith", email="fresh@greenleaf.com", phone="+1 (555) 948-2039", address="102 Farmer St", city="Seattle", country="USA", credit_limit=5000.0, account_status="active"),
            Buyer(name="Clara Oswald", shop_name="StyleHub Fashion", contact_person="Clara Oswald", email="clara@stylehub.com", phone="+1 (555) 283-9182", address="50 Fashion Row", city="Los Angeles", country="USA", credit_limit=8000.0, account_status="active"),
            Buyer(name="Danny Pink", shop_name="HomeBase Supplies", contact_person="Danny Pink", email="contact@homebase.com", phone="+1 (555) 193-8472", address="800 Timber St", city="Denver", country="USA", credit_limit=15000.0, account_status="active"),
            Buyer(name="Ethan Hunt", shop_name="SportZone Outlet", contact_person="Ethan Hunt", email="ops@sportzone.com", phone="+1 (555) 723-9184", address="99 Mission Rd", city="Miami", country="USA", credit_limit=12000.0, account_status="active"),
        ]
        for b in buyers:
            db.add(b)
        db.flush()

        # 4. Seed Products
        print("Seeding products...")
        products = [
            # High-value electronics
            Product(name="Wireless Headphones", sku="WH-200", category="Electronics", supplier="Apex Electronics Corp", quantity=35, cost_price=45.0, selling_price=99.99, reorder_threshold=10),
            Product(name="USB-C Hub 8-in-1", sku="UH-302", category="Electronics", supplier="Apex Electronics Corp", quantity=4, cost_price=15.0, selling_price=39.99, reorder_threshold=15),  # Low Stock!
            Product(name="Wireless Mouse", sku="WM-204", category="Electronics", supplier="Apex Electronics Corp", quantity=2, cost_price=8.0, selling_price=24.99, reorder_threshold=8),   # Very Low Stock!
            Product(name="Mechanical Keyboard", sku="MK-500", category="Electronics", supplier="Apex Electronics Corp", quantity=18, cost_price=35.0, selling_price=79.99, reorder_threshold=10),
            
            # Clothing
            Product(name="Slim Fit Denim Jeans", sku="DJ-101", category="Clothing", supplier="Global Garments Inc", quantity=50, cost_price=20.0, selling_price=49.99, reorder_threshold=15),
            Product(name="Premium Cotton T-Shirt", sku="TS-202", category="Clothing", supplier="Global Garments Inc", quantity=12, cost_price=7.0, selling_price=19.99, reorder_threshold=20),  # Low Stock!
            Product(name="Winter Fleece Jacket", sku="FJ-808", category="Clothing", supplier="Global Garments Inc", quantity=25, cost_price=30.0, selling_price=69.99, reorder_threshold=10),

            # Food
            Product(name="Organic Coffee Beans (1kg)", sku="CB-012", category="Food & Beverage", supplier="Nourish Foods Ltd", quantity=8, cost_price=6.0, selling_price=17.99, reorder_threshold=20),  # Low Stock!
            Product(name="Extra Virgin Olive Oil (500ml)", sku="OO-050", category="Food & Beverage", supplier="Nourish Foods Ltd", quantity=40, cost_price=5.0, selling_price=12.99, reorder_threshold=15),
            Product(name="Premium Matcha Powder (100g)", sku="MP-100", category="Food & Beverage", supplier="Nourish Foods Ltd", quantity=30, cost_price=12.0, selling_price=29.99, reorder_threshold=10),

            # Sports
            Product(name="Running Shoes Pro", sku="RS-501", category="Sports", supplier="Global Garments Inc", quantity=45, cost_price=40.0, selling_price=109.99, reorder_threshold=15),
            Product(name="Yoga Mat Non-Slip", sku="YM-040", category="Sports", supplier="Homeland Goods Co", quantity=3, cost_price=9.0, selling_price=24.99, reorder_threshold=10),    # Low Stock!
            
            # Home
            Product(name="Smart LED Bulb", sku="LB-100", category="Home & Garden", supplier="Homeland Goods Co", quantity=60, cost_price=8.0, selling_price=21.99, reorder_threshold=15),
            Product(name="Ergonomic Laptop Stand", sku="LS-045", category="Home & Garden", supplier="Homeland Goods Co", quantity=15, cost_price=14.0, selling_price=34.99, reorder_threshold=5),
        ]
        for p in products:
            db.add(p)
        db.flush()

        # 5. Seed Historical Orders (Last 14 days)
        print("Seeding order history for the last 14 days...")
        start_date = datetime.now() - timedelta(days=14)
        
        # iterate day-by-day to simulate sales data
        for i in range(15):
            current_date = start_date + timedelta(days=i)
            # Create between 1 and 3 orders per day
            num_orders = random.randint(1, 3)
            
            for _ in range(num_orders):
                buyer = random.choice(buyers)
                # Randomize order time during that day
                order_time = current_date.replace(
                    hour=random.randint(9, 18),
                    minute=random.randint(0, 59),
                    second=random.randint(0, 59)
                )
                
                # Create the order
                order = Order(
                    buyer_id=buyer.id,
                    order_date=order_time,
                    status="completed" if i < 14 else random.choice(["completed", "pending"]),
                    total_amount=0.0
                )
                db.add(order)
                db.flush()
                
                # Pick 1 to 4 random unique products for this order
                num_items = random.randint(1, 4)
                order_products = random.sample(products, num_items)
                
                total_order_amount = 0.0
                for prod in order_products:
                    # Quantity sold in this order
                    qty = random.randint(1, 5)
                    unit_price = prod.selling_price
                    subtotal = unit_price * qty
                    
                    order_item = OrderItem(
                        order_id=order.id,
                        product_id=prod.id,
                        quantity=qty,
                        unit_price=unit_price,
                        subtotal=subtotal
                    )
                    db.add(order_item)
                    total_order_amount += subtotal
                
                order.total_amount = total_order_amount
        
        db.commit()
        print("Database seeded successfully with rich, realistic data!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
