from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db import get_db
from models.product import Product
from models.supplier import Supplier
from models.buyer import Buyer
from models.order import Order, OrderItem

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    """Returns high-level counts and revenue figures for the dashboard cards."""
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_suppliers = db.query(func.count(Supplier.id)).scalar() or 0
    total_buyers = db.query(func.count(Buyer.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0

    revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.status != 'cancelled'
    ).scalar() or 0

    # Approximate costs: sum(order_item.quantity * product.cost_price) for non-cancelled orders
    costs = db.query(func.sum(OrderItem.quantity * Product.cost_price)).join(
        Order, OrderItem.order_id == Order.id
    ).join(
        Product, OrderItem.product_id == Product.id
    ).filter(
        Order.status != 'cancelled'
    ).scalar() or 0

    return {
        "products": total_products,
        "suppliers": total_suppliers,
        "buyers": total_buyers,
        "orders": total_orders,
        "revenue": round(revenue, 2),
        "costs": round(costs, 2),
    }


@router.get("/sales-trend")
def get_sales_trend(days: int = 30, db: Session = Depends(get_db)):
    """
    Returns daily revenue totals for the last N days.
    Used for the revenue trend AreaChart on the dashboard.
    """
    start_date = datetime.utcnow() - timedelta(days=days)

    results = db.query(
        func.date(Order.order_date).label("date"),
        func.sum(Order.total_amount).label("revenue")
    ).filter(
        Order.order_date >= start_date,
        Order.status != 'cancelled'
    ).group_by(
        func.date(Order.order_date)
    ).order_by(
        func.date(Order.order_date)
    ).all()

    return [
        {
            "date": str(row.date),
            "revenue": round(row.revenue, 2)
        }
        for row in results
    ]


@router.get("/top-products")
def get_top_products(limit: int = 5, db: Session = Depends(get_db)):
    """
    Returns the top N products by total units sold.
    Used for the horizontal BarChart on the dashboard.
    """
    results = db.query(
        Product.name,
        func.sum(OrderItem.quantity).label("units")
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).join(
        Order, OrderItem.order_id == Order.id
    ).filter(
        Order.status != 'cancelled'
    ).group_by(
        Product.name
    ).order_by(
        func.sum(OrderItem.quantity).desc()
    ).limit(limit).all()

    return [
        {"name": row.name, "units": int(row.units)}
        for row in results
    ]


@router.get("/low-stock")
def get_low_stock(db: Session = Depends(get_db)):
    """
    Returns products approaching their reorder threshold.
    Calculates average daily sales velocity and predicts days until stockout.
    This powers the 'Smart Reorder Alerts' section of the dashboard.
    """
    # Get products that are at or below their reorder threshold
    low_products = db.query(Product).filter(
        Product.quantity <= Product.reorder_threshold
    ).all()

    # Calculate average daily sales for each product over the last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    alerts = []
    for product in low_products:
        daily_sales_result = db.query(
            func.sum(OrderItem.quantity)
        ).join(
            Order, OrderItem.order_id == Order.id
        ).filter(
            OrderItem.product_id == product.id,
            Order.order_date >= thirty_days_ago,
            Order.status != 'cancelled'
        ).scalar() or 0

        # Average daily sales over 30 days
        daily_sales = round(daily_sales_result / 30, 1)

        # Predict days until stockout
        if daily_sales > 0:
            days_left = round(product.quantity / daily_sales)
        else:
            days_left = 999  # Not selling, so no urgency

        alerts.append({
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "current_stock": product.quantity,
            "reorder_threshold": product.reorder_threshold,
            "daily_sales": daily_sales,
            "days_left": days_left,
        })

    # Sort by days_left ascending (most urgent first)
    alerts.sort(key=lambda x: x["days_left"])

    return alerts
