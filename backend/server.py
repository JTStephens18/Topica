from flask import Flask, request
import numpy as np
import pandas as pd
from scipy import spatial
import random

app = Flask(__name__)

embed_dict = {}
file_path = '../src/utils/glove.6B.100d.txt'
with open(file_path, 'r', encoding='UTF-8') as f:
    for line in f:
        values = line.split()
        word = values[0]
        vector = np.asarray(values[1:], "float32")
        embed_dict[word] = vector


@app.route("/findWord")
def find_similar_word(requestedWord):
    # requestedWord = request.args.get('embedes')
    embedes = embed_dict[requestedWord]
    nearest = sorted(embed_dict.keys(), key=lambda word: spatial.distance.euclidean(
        embed_dict[word], embedes))
    return nearest


@app.route('/tester')
def tester():
    test = request.args.get('test')
    return {"Tester": test}


# Members API route

@app.route('/members')
def members():
    return {"Members": ["John", "Paul", "George", "Ringo"]}


@app.route('/initiateWord')
def initiateWord():
    with open('foundNouns.txt', 'r') as f:
        num = random.randrange(0, 954)
        for i, line in enumerate(f):
            if i == num:
                print(line)
                wordList = find_similar_word(line.replace("\n", ""))
                return {"Word": wordList}


if __name__ == '__main__':
    app.run(debug=True)
