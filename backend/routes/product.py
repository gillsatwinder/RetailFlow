from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.product import Product

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/")
def create_product(product: dict, db: Session = Depends(get_db)):
    new_product = Product(
        name=product["name"],
        sku=product["sku"],
        category=product.get("category", ""),
        supplier=product.get("supplier", ""),
        quantity=product.get("quantity", 0),
        cost_price=product["cost_price"],
        selling_price=product["selling_price"],
        reorder_threshold=product.get("reorder_threshold", 10),
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}


@router.put("/{product_id}")
def update_product(product_id: int, product_data: dict, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product_data.items():
        if hasattr(product, key):
            setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


@router.post("/{product_id}/reorder")
def reorder_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Add twice the reorder threshold, or default 50
    amount_to_add = (product.reorder_threshold * 2) if product.reorder_threshold > 0 else 50
    product.quantity += amount_to_add

    db.commit()
    db.refresh(product)
    return {"message": f"Restocked {amount_to_add} units of {product.name}", "new_quantity": product.quantity}
