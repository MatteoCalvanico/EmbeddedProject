from flask import Blueprint, render_template 
from flask import request, jsonify, redirect, url_for, current_app
from database import db 

views = Blueprint(__name__, "views")

# Visualizza il template "index.html" passandogli il 
# parametro "Pippo" tramite la renderizzazione
@views.route("/")
def home():
    return render_template("index.html", name="Pippo")

# Visualizza il template "index.html" passandogli il 
# parametro tramite URL
@views.route("/testValue/<value>")
def testValue(value):
    return render_template("index.html", name=value)

# Visualizza il template "index.html" passandogli il 
# parametro tramite QueryString
@views.route("/testArgs")
def testArgs():
    args = request.args
    name = args.get('name')
    return render_template("index.html", name=name)

# Visualizza un semplice JSON formattato
@views.route("/json")
def get_json():
    return jsonify({'name' : 'tim'})

# Visualizza i dati prelevati dal DB, eseguendo 
# la query vista negli esercizi precedenti,
# formattando i dati come un json
@views.route("/data")
def get_data():
    #return db(user='test', pwd='test', url='192.168.0.8', db='tuoDB').select("SELECT * FROM Datas")
    return db(user='test', pwd='test', url='192.168.0.8', db='tuoDB').select("SELECT * FROM Datas")

@views.route("/insert")
def insert_data():
    db(user='test', pwd='test', url='192.168.0.8', db='tuoDB').insert([2, 5], "Datas", "value")
    return redirect(url_for("views.get_data"))

@views.route("/insert_from_form", methods=['POST'])
def insert_from_form():
    if request.method == 'POST':
        dato_da_form = request.form['dato_da_form']
        db(user='test', pwd='test', url='192.168.0.8', db='tuoDB').insert([float(dato_da_form)], "Datas", "value")
        return redirect(url_for("views.get_data"))

@views.route("/insert_from_jquery", methods=['POST'])
def insert_from_jquery():
    if request.method == 'POST':
        data = request.get_json()
        array_di_valori = data.get('arrayDiValori')
        db(user='test', pwd='test', url='192.168.0.8', db='tuoDB').insert(array_di_valori, "Datas", "value")
    
    return db(user='test', pwd='test', url='192.168.0.8', db='tuoDB').select("SELECT * FROM Datas")

# Effettua un redirect verso la pagina json 
# NB: nel redirect occorre inserire il nome della
# funzione, non il link completo
@views.route("/goToGetJson")
def goToGetJson():
    return redirect(url_for("views.get_json"))


