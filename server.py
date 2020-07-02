from flask import Flask, render_template, request, session, redirect, url_for, flash, jsonify
from datetime import datetime
import json
import hashing
import db

app = Flask(__name__)
app.secret_key = b'Gx8Q_64t8_XxE9yPZpD6Ww'


@app.route('/')
def home_page():
    if 'email' in session:
        user_info = db.get_data_by_email(session['email'])
        return render_template('home_page.html', user_info=user_info, logged=True)
    return render_template('home_page.html', logged=False)


@app.route('/index')
def index():
    if 'email' in session:
        user_info = db.get_data_by_email(session['email'])
        planets_info = db.get_votes_by_user_id(user_info['user_id'])
        return render_template('index.html', user_info=user_info, planets_info=planets_info)
    return render_template('home_page.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm = request.form.get('confirm')
        secure_password = hashing.hash_password(password)
        user_info = db.get_data_by_email(email)

        if user_info is not None:
            flash('Email already used!', 'info')
        elif password == confirm:
            db.add_data(full_name, email, secure_password)
            flash('Registration successful!', 'success')
            return redirect(url_for('login'))
        else:
            flash('Registration does not mach!', 'danger')
            return redirect(url_for('register'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user_info = db.get_data_by_email(email)

        if user_info is None:
            flash('Email not found!', 'danger')
            return redirect(url_for('login'))
        elif hashing.verify_password(password, user_info['password']):
            session['email'] = email
            flash('You are now logged in', 'success')
            return render_template('index.html', user_info=user_info)
        else:
            flash('Incorrect password!', 'danger')
            return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    flash('You are now logged out', 'info')
    return redirect(url_for('index'))


@app.route('/votes', methods=['POST'])
def votes():
    submission_time = datetime.now()
    planet_name = json.loads(request.data.decode("utf-8"))["planet"]
    planet_id = json.loads(request.data.decode("utf-8"))["id"]
    email = session['email']
    user_id = db.get_data_by_email(email)['user_id']
    planet_name_db = db.get_votes_by_planet_name_and_user_id(planet_name, user_id)

    if planet_name_db:
        db.update_vote(planet_name, user_id)
    else:
        db.add_vote(planet_name, user_id, submission_time, 1, planet_id)

    # Why need a return?, Is there other option without using fake return?
    return 'OK'


# Sending data to JS
@app.route("/api/votes_data")
def votes_data():
    user_info = db.get_data_by_email(session['email'])
    votes_info = db.get_votes_by_user_id(user_info['user_id'])
    return jsonify(votes_info)


if __name__ == '__main__':
    app.run(
        debug=True
    )
