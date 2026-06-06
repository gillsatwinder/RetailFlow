from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.buyer import Buyer

router = APIRouter(prefix="/buyers", tags=["Buyers"])

@router.post("/")
def create_buyer(buyer: dict, db: Session = Depends(get_db)):
    new_buyer = Buyer(**buyer)
    db.add(new_buyer)
    db.commit()
    db.refresh(new_buyer)
    return new_buyer

@router.get("/")
def get_buyers(db: Session = Depends(get_db)):
    return db.query(Buyer).all()

@router.get("/{buyer_id}")
def get_buyer(buyer_id: int, db: Session = Depends(get_db)):
    buyer = db.query(Buyer).filter(Buyer.id == buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer

@router.delete("/{buyer_id}")
def delete_buyer(buyer_id: int, db: Session = Depends(get_db)):
    buyer = db.query(Buyer).filter(Buyer.id == buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    db.delete(buyer)
    db.commit()
    return {"message": "Buyer deleted successfully"}