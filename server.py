from flask import Flask, render_template, request, session, redirect, url_for, flash
import hashing
import db

app = Flask(__name__)
app.secret_key = b'Gx8Q_64t8_XxE9yPZpD6Ww'


@app.route('/')
def home_page():
    if 'email' in session:
        user_info = db.get_data_by_email(session['email'])
        return render_template('home_page.html', user_info=user_info)
    return render_template('home_page.html')


@app.route('/index')
def index():
    if 'email' in session:
        user_info = db.get_data_by_email(session['email'])
        return render_template('index.html', user_info=user_info, logged=True)
    return render_template('home_page.html', logged=False)


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
            return render_template('home_page.html', user_info=user_info)
        else:
            flash('Incorrect password!', 'danger')
            return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    flash('You are now logged out', 'info')
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(
        debug=True
    )
