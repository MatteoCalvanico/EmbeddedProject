import mysql.connector
from flask import jsonify


class db:
    def __init__(self, url, user, pwd, db):
        self.connection = mysql.connector.connect(user=user, password=pwd, host=url, database=db)
    
    def select(self, query):
        cursor = self.connection.cursor()
        cursor.execute(query)
        row_headers=[x[0] for x in cursor.description]
        json_data=[]
        for result in cursor.fetchall():
            json_data.append(dict(zip(row_headers, result)))
        cursor.close()
        return jsonify(json_data)
    
    def insert(self, elements, table, col):
        cursor = self.connection.cursor()
        for element in elements:
            cursor.execute("INSERT INTO " + table + " (" + col + ") VALUES (%f)" % (element))

        self.connection.commit()

        return "Insert ok", 200