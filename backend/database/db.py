'''This file handles:
database URL
engine creation
session management
reusable DB access '''

import os
from dotenv import load_dotenv   
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()  #reads your .env file

DATABASE_URL = os.getenv("DATABASE_URL") #get database connection string

engine = create_engine(DATABASE_URL)  #create the connection bridge to PostgreSQL

SessionLocal = sessionmaker(           #create database sessions
    autocommit=False,  
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

try:
    connection = engine.connect()
    print("Database connected successfully!")
    connection.close()
except Exception as e:
    print("Database connection failed!")
    print(e)

