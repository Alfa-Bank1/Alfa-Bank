from flask import Flask, request, jsonify
import bcrypt  # Для хеширования паролей

app = Flask(__name__)

# Пример базы данных (в реальном проекте используйте SQLite, PostgreSQL и т.д.)
registered_users = {}

# Маршрут для регистрации
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    user_id = data.get('user_id')
    password = data.get('password')

    # Проверка, что пользователь еще не зарегистрирован
    if user_id in registered_users:
        return jsonify({"success": False, "message": "Пользователь уже зарегистрирован"})

    # Хеширование пароля
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Сохраняем пользователя
    registered_users[user_id] = hashed_password.decode('utf-8')  # Сохраняем хеш в виде строки

    return jsonify({"success": True, "message": "Пользователь зарегистрирован!"})

# Маршрут для отдачи HTML-страницы
@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)