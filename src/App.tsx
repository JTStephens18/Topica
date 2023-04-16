import { FormEvent, useState, useRef, useEffect } from 'react';
import './App.css'

function App() {

  const [userInput, setUserInput] = useState("");

  const [userScore, setUserScore] = useState([{"score": -1, "word": "", "width": 0}]);

  const [userHasInput, setUserHasInput] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [hasWon, setHasWon] = useState(false);

  const associatedWords = useRef([""]);

  useEffect(() => {
   initiateWordOfTheDay(); 
  }, [])

  useEffect(() => {
    adjustBar();
  }, [userScore])

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.toLowerCase());
  }

  const listenForEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      checkUserCloseness()
    }
  }

  const initiateWordOfTheDay = () => {
    fetch('/initiateWord').then(
      res => res.json()
    ).then(
      data => {
        console.log("data", data);
        let targetArray = data.Word;
        associatedWords.current = targetArray;
      }
    )
  }


  const checkUserCloseness = async () => {
    if(userInput == "") {
      await handleInputAnimation();
      setErrorMessage("Please enter a word")
      return;
    }
    if(userScore.find(item => item.word == userInput)) {
      await handleInputAnimation();
      setErrorMessage(`${userInput} has already been guessed!`)
      return;
    }

    var score = associatedWords.current.indexOf(userInput);
    console.log("Score", score);

    if(score == 0) {
      console.log("You got it right!");
      setHasWon(true);
    } else if (score == -1) {
      await handleInputAnimation();
      setErrorMessage(`Sorry, I don't know what ${userInput} is`)
      return;
    }

    setErrorMessage("");

    // Calculates the width of the inner bar
    const width = await calculateBarWidth(score);
    const sortedGuesses = await handleUserGuesses(score, width);

    // Spread operator takes all elements from sortedScore and put them into new array so component rerenders
    setUserScore([...sortedGuesses]);

    // Clears the input field after submit
    (document.getElementById("inputField") as HTMLInputElement)!.value = "";
    setUserInput("");
  }

  const calculateBarWidth = async (score: number) => {
    let maxValue = 1250;
    if (score > maxValue) {
      return 1;
    }
    let width = (score / maxValue) - 1;
    width = width * -100;
    return width;
  }

  const handleUserGuesses = async (score: number, width: number) => {
    let tempArr = userScore;
    tempArr.push({"score": score, "word": userInput, "width": width});

    // Removes the iniitialized value from userScore
    if(tempArr[0].score == -1) {
      tempArr.shift();
      setUserHasInput(true);
    }

    const sortedScore = tempArr.sort((a, b) => {
      return a.score - b.score;
    });
    return sortedScore;
  }

  const adjustBar = async () => {
    const innerBars = await getInnerBars();
    for(let i=0; i < innerBars.length; i++) {
      let index = innerBars[i].getAttribute("inner-data-key") ?? -1;
      let width = userScore[index as number].width;
      if (width < 25) {
        innerBars[i].style.backgroundColor = "var(--inner-bar-color-4)";
      } else if (width >= 25 && width < 50) {
        innerBars[i].style.backgroundColor = "var(--inner-bar-color-3)";
      } else if (width >= 50 && width < 85) {
        innerBars[i].style.backgroundColor = "var(--inner-bar-color-2)";
      } else if (width >= 85) {
        innerBars[i].style.backgroundColor = "var(--inner-bar-color-1)";
      }
      innerBars[i].style.width = width.toString() + "%";
    }
  }

  const getInnerBars = async () => {
    const innerBars = Array.from(document.getElementsByClassName("inner-bar") as HTMLCollectionOf<HTMLElement>);
    console.log("Inner bars", innerBars);
    return innerBars;
  }

  const handleInputAnimation = async () => {
    const input = document.getElementById("inputField") as HTMLInputElement;
    input.classList.add("inputAnimation");
    setTimeout(() => {
      input.classList.remove("inputAnimation");
    }, 500);
  }

  return (
    <div className="App">
      <div className="title-container">
        <h1>TOPICA</h1>
      </div>
      {hasWon && (
      <div className="win-modal">
        <h1>You guessed correctly in {userScore.length} guesses!</h1>
      </div>
      )}
      <div className="main">
        <input id="inputField" placeholder="Type a word" type="string" onChange={(e) => handleUserInput(e)} onKeyDown={(e) => listenForEnter(e)}/>
          <div className="error-container">
            {errorMessage && (
              errorMessage
            )}
          </div>
          <div className="guess-container">
            {userHasInput && userScore.slice(0,10).map((item, index) => {
              return (
                <div className="guesses" data-key={index} key={index}>
                  <div className="outer-bar">
                    <div className="inner-bar" inner-data-key={index}>
                    </div>
                  </div>
                  <div className="row">
                    <span>{item.word}</span>
                    <span>{item.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
      </div>
    </div>
  )
}

export default App
