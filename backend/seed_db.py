#!/usr/bin/env python3
"""
Database seeding script for SmartHaul
Run this to populate the database with sample data for development
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.base import SessionLocal
from app.models.seed import seed_database

def main():
    """Main function to seed the database"""
    db = SessionLocal()
    try:
        seed_database(db)
        print("✅ Database seeded successfully!")
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main() 