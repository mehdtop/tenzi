import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [bestTime,setBestTime]=React.useState(localStorage.getItem("bestTime")||100000)
    const[time,setTime]=React.useState(0)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const[count,setCount]=React.useState(0)
   
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)

            if (time < bestTime) {
                localStorage.setItem("bestTime", time);}
                setBestTime(localStorage.getItem("bestTime"));
              
            

        }
    }, [dice])
   React.useEffect(() => {
    let timer
    if(!tenzies){
        const timer = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
          };
    }else{
            setTime(prevTime=>prevTime)
    
        }
         
      }, [time]);
       
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setCount(prevCount=>prevCount+1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setTime(0)
            setCount(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            
            <h2>Best Time:{bestTime}</h2>
            <div className="state">
            <h3>Timer:{time}</h3>
            <h3>Count of Rolls:{count}</h3>
           
            </div>
            
        </main>
    )
}