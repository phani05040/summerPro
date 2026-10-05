"""Small persistent SQLite store so EcoTrack works without cloud credentials."""
import json
import os
import sqlite3
from pathlib import Path

DB_PATH = Path(os.environ.get("ECOTRACK_DB_PATH", Path(__file__).with_name("ecotrack.db")))


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("""CREATE TABLE IF NOT EXISTS daily_logs (
        user_id TEXT NOT NULL, date TEXT NOT NULL, data TEXT NOT NULL,
        PRIMARY KEY (user_id, date)
    )""")
    connection.execute("""CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY, data TEXT NOT NULL DEFAULT '{}'
    )""")
    connection.execute("""CREATE TABLE IF NOT EXISTS user_badges (
        user_id TEXT PRIMARY KEY, data TEXT NOT NULL DEFAULT '{}'
    )""")
    return connection


def get_logs(user_id, limit=30):
    with connect() as db:
        rows = db.execute("SELECT data FROM daily_logs WHERE user_id=? ORDER BY date DESC LIMIT ?", (user_id, limit)).fetchall()
        return [json.loads(row["data"]) for row in rows]


def save_log(user_id, date, data):
    with connect() as db:
        db.execute("INSERT INTO daily_logs(user_id,date,data) VALUES(?,?,?) ON CONFLICT(user_id,date) DO UPDATE SET data=excluded.data", (user_id, date, json.dumps(data)))


def delete_log(user_id, date):
    with connect() as db:
        result = db.execute("DELETE FROM daily_logs WHERE user_id=? AND date=?", (user_id, date))
        return result.rowcount > 0


def get_record(table, user_id):
    if table not in ("user_settings", "user_badges"):
        raise ValueError("Unknown record table")
    with connect() as db:
        row = db.execute(f"SELECT data FROM {table} WHERE user_id=?", (user_id,)).fetchone()
        return json.loads(row["data"]) if row else {}


def merge_record(table, user_id, data):
    if table not in ("user_settings", "user_badges"):
        raise ValueError("Unknown record table")
    current = get_record(table, user_id)
    current.update(data)
    with connect() as db:
        db.execute(f"INSERT INTO {table}(user_id,data) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data", (user_id, json.dumps(current)))
    return current
