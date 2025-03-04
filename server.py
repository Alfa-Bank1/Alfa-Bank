from flask import Flask, request, jsonify, send_from_directory
import bcrypt

app = Flask(__name__, static_folder='static')

# Пример базы данных
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
    registered_users[user_id] = hashed_password.decode('utf-8')

    return jsonify({"success": True, "message": "Пользователь зарегистрирован!"})

# Маршрут для отдачи HTML-страницы
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Маршрут для отдачи статических файлов
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True)