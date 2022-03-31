import { useEffect, useState } from 'react'
import ScoreBoard from './components/ScoreBoard'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const WIDTH = 8
const CANDY_COLORS = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
]

const App = () => {
  const [candyColorArray, setCandyColorArray] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const createBoard = () => {
    let i = 0;
    let randomColorArray = [];
    while (i < WIDTH * WIDTH) {
      let randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)]
      randomColorArray.push(randomColor)
      i++
    };
    return setCandyColorArray(randomColorArray)
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < candyColorArray.length; i++) {
      const rowOfThree = [i, i + 1 , i + 2]
      const currentColor = candyColorArray[i]
      const isBlank = candyColorArray[i] === blank

      if(rowOfThree.every(square => candyColorArray[square] === currentColor && !isBlank)) {
        setScoreDisplay(score => score + 3)
        rowOfThree.forEach(square => candyColorArray[square] = blank)
        return true
      }
    }  
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < candyColorArray.length; i++) {
      const rowOfFour = [i, i + 1 , i + 2,  i+ 3]
      const currentColor = candyColorArray[i]
      const isBlank = candyColorArray[i] === blank

      if(rowOfFour.every(square => candyColorArray[square] === currentColor && !isBlank)) {
        setScoreDisplay(score => score + 4)
        rowOfFour.forEach(square => candyColorArray[square] = blank)
        return true
      }
    }  
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= candyColorArray.length - WIDTH * 3; i++) {
      const columnOfFour = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3]
      const currentColor = candyColorArray[i]
      const isBlank = candyColorArray[i] === blank

      if(columnOfFour.every(square => candyColorArray[square] === currentColor && !isBlank)) {
        setScoreDisplay(score => score + 4)
        columnOfFour.forEach(square => candyColorArray[square] = blank)
        return true
      }
    }  
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= candyColorArray.length - WIDTH * 2; i++) {
      const columnOfThree = [i, i + WIDTH, i + WIDTH * 2]
      const currentColor = candyColorArray[i]
      const isBlank = candyColorArray[i] === blank

      if(columnOfThree.every(square => candyColorArray[square] === currentColor && !isBlank)) {
        setScoreDisplay(score => score + 3)
        columnOfThree.forEach(square => candyColorArray[square] = blank)
        return true
      }
    }  
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i < candyColorArray.length - WIDTH; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && candyColorArray[i] === blank) {
        let randomNumber = Math.floor(Math.random() * CANDY_COLORS.length)
        candyColorArray[i] = CANDY_COLORS[randomNumber]
      }

      if(candyColorArray[i + WIDTH] === blank) {
        candyColorArray[i + WIDTH] = candyColorArray[i]
        candyColorArray[i] = blank
      }
    }
  } 

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    candyColorArray[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
    candyColorArray[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

    const validMoves = [
        squareBeingDraggedId - 1,
        squareBeingDraggedId - WIDTH,
        squareBeingDraggedId + 1,
        squareBeingDraggedId + WIDTH
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    if (squareBeingReplacedId &&
        validMove &&
        (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
        setSquareBeingDragged(null)
        setSquareBeingReplaced(null)
    } else {
        candyColorArray[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
        candyColorArray[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
        setCandyColorArray([...candyColorArray])
    }
}


  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForRowOfThree();
      checkForRowOfFour();
      checkForColumnOfFour();
      checkForColumnOfThree();
      moveIntoSquareBelow();
      setCandyColorArray([...candyColorArray])
    }, 100)

    return () => clearInterval(timer)
  }, [checkForRowOfThree, checkForRowOfFour, checkForColumnOfFour, checkForColumnOfThree, moveIntoSquareBelow, candyColorArray])

  return (
    <div className="app">
      <div className="game">
        {candyColorArray.map((candyColor, i) => (
          <img
            src={candyColor}
            alt={candyColor}
            key={i}
            data-id={i}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => e.preventDefault()}
            onDragLeave={e => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  );
}

export default App;
