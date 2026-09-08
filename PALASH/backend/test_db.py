from app.database.session import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT current_database();")
        )

        print("Database connection successful!")
        print("Database:", result.scalar())

except Exception as e:
    print("Database connection failed!")
    print(e)
