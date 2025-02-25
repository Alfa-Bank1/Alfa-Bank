// Функция для получения user_id
function getTelegramUserId() {
    console.log('Проверка доступности window.Telegram и window.Telegram.WebApp...');
    if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram.WebApp доступен.');

        const initData = window.Telegram.WebApp.initData;
        console.log('initData:', initData); // Отладочное сообщение

        if (initData) {
            console.log('initData не пустой. Пытаемся извлечь user_id...');
            try {
                const params = new URLSearchParams(initData);
                const user = params.get('user');
                if (user) {
                    const userObj = JSON.parse(user);
                    console.log('user_id успешно извлечен:', userObj.id);
                    return userObj.id; // Возвращаем user_id
                } else {
                    console.error('Поле user отсутствует в initData.');
                    return null;
                }
            } catch (error) {
                console.error('Ошибка при парсинге initData:', error);
                return null;
            }
        } else {
            console.error('initData пустой. Убедитесь, что Mini App запущен через Telegram.');
            return null;
        }
    } else {
        console.error('Telegram.WebApp недоступен. Убедитесь, что приложение запущено через Telegram.');
        return null;
    }
}

// Скрываем логотип через 3 секунды
setTimeout(() => {
    document.getElementById('logo').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('logo').style.display = 'none';

        const userId = getTelegramUserId(); // Получаем user_id
        console.log('User ID:', userId); // Отладочное сообщение

        if (userId) {
            if (isUserRegistered(userId)) {
                // Если пользователь уже зарегистрирован, переходим к вводу пароля
                document.getElementById('passwordPage').classList.add('active');
                document.querySelector('#passwordPage h1').textContent = 'Введите пароль';
            } else {
                // Если пользователь не зарегистрирован, переходим к созданию пароля
                document.getElementById('passwordPage').classList.add('active');
                document.querySelector('#passwordPage h1').textContent = 'Придумайте пароль';
            }
        } else {
            console.error('Не удалось получить user_id');
        }
    }, 1000); // Дополнительная задержка для плавного исчезновения
}, 3000);