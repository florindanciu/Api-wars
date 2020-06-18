from flask import Flask, render_template, request, session, redirect, url_for, flash
import hashing
import db

app = Flask(__name__)
app.secret_key = b'Gx8Q_64t8_XxE9yPZpD6Ww'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm = request.form.get('confirm')
        secure_password = hashing.hash_password(password)
        if password == confirm:
            db.add_data(full_name, email, secure_password)
            flash('Registration successful!', 'success')
            return redirect(url_for('login'))
        else:
            flash('Registration does not mach!', 'danger')
            return redirect(url_for('register'))
    return render_template('register.html')


@app.route('/login')
def login():
    return render_template('login.html')

#
# @app.route('/logout')
# def logout():
#     pass


if __name__ == '__main__':
    app.run(
        debug=True
    )
