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
                res[i] = 'true'
                count_dict[word[i]] -= 1
                indx_to_skip.append(i)
            
        for j in range(word_len):
            if j in indx_to_skip:
                continue
            if count_dict.get(word[j]):
                res[j] = 'false'
                count_dict[word[j]] -= 1
            else:
                res[j] = 'none'
    
        return WordRevision(res)



"""



correct_word = 'ВЕСНА'

assert check_word('ВЕСНА') == {0: "true", 1: "true", 2: "true", 3: "true", 4: "true"}
assert check_word('Весна') == {0: "true", 1: "true", 2: "true", 3: "true", 4: "true"}
assert check_word('ручка') == {0: "none", 1: "none", 2: "none", 3: "none", 4: "true"}
assert check_word('ручей') == {0: "none", 1: "none", 2: "none", 3: "false", 4: "none"}
assert check_word('басня') == {0: "none", 1: "false", 2: "true", 3: "true", 4: "none"}


# correct_word = 'ГОСТЬ'

# assert check_word('СОСНА') == {0: 'none', 1: 'true', 2: 'true', 3: 'none', 4: 'none'}
# assert check_word('СОНCА') == {0: 'false', 1: 'true', 2: 'none', 3: 'none', 4: 'none'}



"""