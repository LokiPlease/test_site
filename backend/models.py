from sqlalchemy import Column, Integer, String, Float
   from sqlalchemy.ext.declarative import declarative_base

   Base = declarative_base()

   class User(Base):
       __tablename__ = "users"
       id = Column(Integer, primary_key=True, index=True)
       username = Column(String, unique=True, index=True)
       email = Column(String, unique=True, index=True)
       hashed_password = Column(String)
       role = Column(String, default="buyer")  # New field: role (admin or buyer)
       balance = Column(Float, default=0.0)    # New field: balance