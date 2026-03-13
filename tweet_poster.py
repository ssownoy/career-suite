```python
import tweepy
import time

# Ключи API
consumer_key = "Brnaqb88edUvlRRKnJPJsyOTk"
consumer_secret = "qMKO12y1yBcfN1xklwVDiwUedv9tEQLg9craJeBPi7HDQYVWgM"
access_token = "1878078717169119232-rhQU1tRYHCSu7pDdosXG8pCZtFdaBJ"
access_token_secret = "ae7Ov91oXUb1bwslxuLyLiPl9ASveHZX3jcSMvEAGrjuG"

# Создаем объект Tweepy
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

# Текст твитов
tweets = [
    "Развивайте свои навыки с Career Suite!",
    "Повышайте свою карьеру с Career Suite!",
    "Улучшайте свои шансы на успех с Career Suite!",
]

# Отправляем твиты каждые 6 часов
while True:
    for tweet in tweets:
        api.update_status(tweet)
        time.sleep(21600)  # 6 часов
```