from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database.db import get_db
from models.order import Order, OrderItem
from models.product import Product
from models.buyer import Buyer

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/")
def create_order(order_data: dict, db: Session = Depends(get_db)):
    """
    Create a new order with line items.
    Automatically decrements product stock.
    
    Expected payload:
    {
        "buyer_id": 1,
        "items": [
            {"product_id": 1, "quantity": 5},
            {"product_id": 3, "quantity": 2}
        ]
    }
    """
    # Validate buyer exists
    buyer = db.query(Buyer).filter(Buyer.id == order_data["buyer_id"]).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    # Create the order
    new_order = Order(
        buyer_id=order_data["buyer_id"],
        status=order_data.get("status", "pending"),
        total_amount=0
    )
    db.add(new_order)
    db.flush()  # Get the order ID without committing

    total = 0
    for item_data in order_data.get("items", []):
        # Validate product exists
        product = db.query(Product).filter(Product.id == item_data["product_id"]).first()
        if not product:
            db.rollback()
            raise HTTPException(
                status_code=404,
                detail=f"Product with id {item_data['product_id']} not found"
            )

        qty = item_data["quantity"]

        # Check stock availability
        if product.quantity < qty:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.quantity}, Requested: {qty}"
            )

        # Decrement stock
        product.quantity -= qty

        # Calculate subtotal using selling price
        unit_price = product.selling_price
        subtotal = unit_price * qty
        total += subtotal

        # Create order item
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=unit_price,
            subtotal=subtotal
        )
        db.add(order_item)

    new_order.total_amount = total
    db.commit()
    db.refresh(new_order)

    # Return order with items
    return _serialize_order(new_order, db)


@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).options(
        joinedload(Order.buyer),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).order_by(Order.created_at.desc()).all()

    return [_serialize_order(order) for order in orders]


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).options(
        joinedload(Order.buyer),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return _serialize_order(order)


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Restore stock for each item
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()

    return {"message": "Order deleted and stock restored successfully"}


def _serialize_order(order, db=None):
    """Convert an Order ORM object to a clean dictionary for JSON response."""
    return {
        "id": order.id,
        "buyer_id": order.buyer_id,
        "buyer_name": order.buyer.shop_name if order.buyer else "Unknown",
        "order_date": order.order_date.isoformat() if order.order_date else None,
        "status": order.status,
        "total_amount": order.total_amount,
        "items_count": len(order.items),
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else "Unknown",
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": item.subtotal,
            }
            for item in order.items
        ],
        "created_at": order.created_at.isoformat() if order.created_at else None,
    }
