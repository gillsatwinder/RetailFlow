from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine, Base

# Import all models so their tables are created
from models.product import Product
from models.supplier import Supplier
from models.buyer import Buyer
from models.order import Order, OrderItem

# Import all routers
from routes.product import router as products_router
from routes.supplier import router as suppliers_router
from routes.buyer import router as buyers_router
from routes.order import router as orders_router
from routes.analytics import router as analytics_router

# Create all database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(
    title="RetailFlow AI",
    description="Retail inventory, sales, and supply chain management API",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(products_router)
app.include_router(suppliers_router)
app.include_router(buyers_router)
app.include_router(orders_router)
app.include_router(analytics_router)


@app.get("/")
def home():
    return {"message": "RetailFlow AI Backend Running"}