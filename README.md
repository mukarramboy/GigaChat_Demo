# GigaChat

Короткая инструкция по запуску на Linux (bash).

## Быстрый старт

```bash
# 1) Создать виртуальное окружение
python3 -m venv env

# 2) Активировать окружение
source env/bin/activate

# 3) Установить зависимости
pip install -r requirements.txt
```

## Запустить приложение bot
![Bot Results](docs/bot/screenshots/result_bot1.png)
![](docs/bot/screenshots/result_bot2.png)
```bash
cd bot
python3 main.py
```


## Запускать backend 
![Backend Docs(Swagger)](docs/backend/screenshots/docs_api.png)
```bash
cd backend
uvicorn app.main:app --reload
```

## Полезно знать
- Если команда `python3 -m venv` недоступна:
  ```bash
  sudo apt update && sudo apt install -y python3-venv
  ```
- Деактивировать окружение: `deactivate`.

