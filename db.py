from typing import List, Dict
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import database_common


@database_common.connection_handler
def add_data(cursor: RealDictCursor, full_name, email, password):
    query = """
        INSERT INTO users (full_name, email, password)
        VALUES (%s, %s, %s);
        """
    cursor.execute(query, (full_name, email, password,))


@database_common.connection_handler
def get_data_by_email(cursor: RealDictCursor, email) -> list:
    query = """
            SELECT *
            FROM users
            WHERE email = %s"""
    cursor.execute(query, (email,))
    return cursor.fetchone()


@database_common.connection_handler
def get_votes_by_planet_name_and_user_id(cursor: RealDictCursor, planet_name, user_id) -> list:
    query = """
            SELECT planet_name
            FROM planet_votes
            WHERE planet_name = %s and user_id = %s"""
    cursor.execute(query, (planet_name, user_id,))
    return cursor.fetchone()


@database_common.connection_handler
def get_votes_by_user_id(cursor: RealDictCursor, user_id) -> list:
    query = """
            SELECT planet_name, vote_numbers
            FROM planet_votes
            WHERE user_id = %s"""
    cursor.execute(query, (user_id,))
    return cursor.fetchall()


@database_common.connection_handler
def update_vote(cursor: RealDictCursor, planet_name, user_id):
    query = """
        UPDATE planet_votes
        SET vote_numbers = vote_numbers + 1
        WHERE planet_name = %s and user_id = %s;
        """
    cursor.execute(query, (planet_name, user_id))


@database_common.connection_handler
def add_vote(cursor: RealDictCursor, planet_name, user_id, submission_time, vote_numbers, planet_id):
    query = """
        INSERT INTO planet_votes (planet_name, user_id, submission_time, vote_numbers, planet_id)
        VALUES (%s, %s, %s, %s, %s);
        """
    cursor.execute(query, (planet_name, user_id, submission_time, vote_numbers, planet_id,))
