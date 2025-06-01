from collections import Counter

from api.v1.schemas import WordRevision


class GameHandler:

    def __init__(self, correct_word: str):
        self.correct_word = correct_word.upper()

    def check_word(self, word: str) -> WordRevision:
        word_len = len(word)
        assert len(self.correct_word) == len(word), "Проверяемое слово и эталонное слово имеют разную длину."
        word = word.upper()
        count_dict = dict(Counter(self.correct_word).items())
        res = {}
        indx_to_skip = []
        for i in range(word_len):
            if self.correct_word[i] == word[i]:
                res[i] = 'green'
                count_dict[word[i]] -= 1
                indx_to_skip.append(i)
            
        for j in range(word_len):
            if j in indx_to_skip:
                continue
            if count_dict.get(word[j]):
                res[j] = 'yellow'
                count_dict[word[j]] -= 1
            else:
                res[j] = 'red'
    
        return WordRevision(res)



"""



correct_word = 'ВЕСНА'

assert check_word('ВЕСНА') == {0: "green", 1: "green", 2: "green", 3: "green", 4: "green"}
assert check_word('Весна') == {0: "green", 1: "green", 2: "green", 3: "green", 4: "green"}
assert check_word('ручка') == {0: "red", 1: "red", 2: "red", 3: "red", 4: "green"}
assert check_word('ручей') == {0: "red", 1: "red", 2: "red", 3: "yellow", 4: "red"}
assert check_word('басня') == {0: "red", 1: "yellow", 2: "green", 3: "green", 4: "red"}


# correct_word = 'ГОСТЬ'

# assert check_word('СОСНА') == {0: 'red', 1: 'green', 2: 'green', 3: 'red', 4: 'red'}
# assert check_word('СОНCА') == {0: 'yellow', 1: 'green', 2: 'red', 3: 'red', 4: 'red'}



"""