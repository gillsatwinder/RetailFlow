from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float
from database.db import Base


class Buyer(Base):
    __tablename__ = 'Buyers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    shop_name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    credit_limit = Column(Float, default=0, nullable=False)
    account_status = Column(String(50), default='active', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Buyer(id={self.id}, shop_name='{self.shop_name}', email='{self.email}')>"