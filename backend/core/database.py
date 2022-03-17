import sqlite3

def createConnection():
    with sqlite3.connect('project.db') as conn:
        c = conn.cursor()
    try:
        c.execute("""CREATE TABLE IF NOT EXISTS paragraphs (
                            pid INTEGER PRIMARY KEY AUTOINCREMENT,
                            _url TEXT NOT NULL,
                            paragraph TEXT NOT NULL
        )""")
    except:
        pass
    conn.commit()
    return conn

def addParagraphs (data):
    conn = createConnection()
    insert = 'INSERT INTO paragraphs(_url,paragraph) VALUES(?,?)'
    cursor = conn.cursor()
    cursor.execute(insert,data)
    conn.commit()
    if conn:
        conn.close()