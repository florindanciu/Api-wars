from typing import List, Dict
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import database_connection


@database_connection.connection_handler
def add_data(cursor: RealDictCursor, full_name, email, password):
    query = """
        INSERT INTO users (full_name, email, password)
        VALUES (%s, %s, %s);
        """
    cursor.execute(query, (full_name, email, password,))

# @database_connection.connection_handler
# def get_data_by_email(cursor: RealDictCursor, email) -> list:
#     query = """
#             SELECT *
#             FROM users
#             WHERE user_email = %s"""
#     cursor.execute(query, (email,))
#     return cursor.fetchone()
#
#
# @database_connection.connection_handler
# def get_email_by_email(cursor: RealDictCursor, email) -> list:
#     query = """
#             SELECT user_email
#             FROM users
#             WHERE user_email = %s"""
#     cursor.execute(query, (email,))
#     return cursor.fetchone()
#
#
# @database_connection.connection_handler
# def get_password_by_email(cursor: RealDictCursor, email) -> list:
#     query = """
#             SELECT password
#             FROM users
#             WHERE user_email = %s"""
#     cursor.execute(query, (email,))
#     return cursor.fetchall()
