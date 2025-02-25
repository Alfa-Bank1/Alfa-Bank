from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes, MessageHandler, filters
from dotenv import load_dotenv
import os
import json

# Загружаем переменные из .env
load_dotenv()

# Получаем токен
BOT_TOKEN = os.getenv('BOT_TOKEN')

# Команда /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Создаем кнопку для открытия мини-приложения
    keyboard = [
        [InlineKeyboardButton("Открыть 🅰️-Bank", web_app={'url': 'https://alfa-bank.vercel.app'})]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    # Отправляем сообщение с кнопкой
    await update.message.reply_text(
        "Нажмите кнопку ниже, чтобы открыть мини-приложение:",
        reply_markup=reply_markup
    )

# Обработчик нажатия на кнопку
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    # Здесь можно добавить логику для обработки нажатия на кнопку
    await query.edit_message_text(text="Мини-приложение открыто!")

# Обработчик данных от Web App
async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Получаем данные от Web App
    web_app_data = update.message.web_app_data
    data = json.loads(web_app_data.data)  # Парсим JSON

    # Пример данных: {"user_id": 123456789, "password": "1234"}
    user_id = data.get("user_id")
    password = data.get("password")

    # Отправляем данные в чат
    await update.message.reply_text(f"Получены данные от Web App:\nID: {user_id}\nПароль: {password}")

# Основная функция для запуска бота
def main():
    application = ApplicationBuilder().token(BOT_TOKEN).build()

    # Регистрируем обработчики команд
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(button_callback))

    # Регистрируем обработчик данных от Web App
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))

    # Запускаем бота
    application.run_polling()

if __name__ == '__main__':
    main()