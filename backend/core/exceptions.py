class GameNotFound(Exception):
    def __init__(self, msg="Игра с таким идентификатором не найдена"):
        super().__init__(msg)


class DailyGameNotFound(Exception):
    def __init__(self, msg="Ежедневная игра не найдена"):
        super().__init__(msg)


class WordNotFound(Exception):
    def __init__(self, msg="Такого слова нет в словаре"):
        super().__init__(msg)


class StatNotFound(Exception):
    def __init__(self, msg="Статистика для этой игры не найдена"):
        super().__init__(msg)

