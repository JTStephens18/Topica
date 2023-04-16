import numpy as np
import nltk
import enchant

# d = enchant.Dict("en_US")

# embed_dict = {}
# file_path = '../src/utils/glove.6B.100d.txt'
# with open(file_path, 'r', encoding='UTF-8') as f:
#     for line in f:
#         values = line.split()
#         word = values[0]
#         vector = np.asarray(values[1:], "float32")
#         embed_dict[word] = vector


# def is_noun(pos): return pos[:2] == 'NN'


# for word in embed_dict.keys():
#     print(word)
#     tokenized = nltk.word_tokenize(word)
#     nouns = [word for (word, pos) in nltk.pos_tag(tokenized) if is_noun(pos)]
#     with open("nouns.txt", 'a', encoding='UTF-8') as f:
#         if (str(nouns) != "[]"):
#             if (d.check(str(nouns[0]))):
#                 f.write(str(nouns[0]) + "\n")


with open('nouns1000.txt', 'r') as f:
    i = 0
    lines = f.readlines()
    with open('nouns.txt', 'r') as z:
        zLines = z.readlines()
        for line in lines:
            i += 1
            if line in zLines:
                print("Test" + str(i))
                print(line)
                with open('foundNouns.txt', 'a') as n:
                    n.write(line)
            else:
                print("Not found" + str(i))
                print(line)
                with open('notFoundNouns.txt', 'a') as n:
                    n.write(line)


# tokenized = nltk.word_tokenize(embed_dict.keys())
# nouns = [word for (word, pos) in nltk.pos_tag(tokenized) if is_noun(pos)]

# with open('nouns.txt', 'w') as f:
#     for item in nouns:
#         f.write("%s", item)

print("Done")
