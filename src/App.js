import { useEffect, useState } from 'react'

const WIDTH = 8
const CANDY_COLORS = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow'
]

const App = () => {
  const [candyColorArray, setCandyColorArray] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)

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

      if(rowOfThree.every(square => candyColorArray[square] === currentColor)) {
        rowOfThree.forEach(square => candyColorArray[square] = '')
        return true
      }
    }  
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < candyColorArray.length; i++) {
      const rowOfFour = [i, i + 1 , i + 2,  i+ 3]
      const currentColor = candyColorArray[i]

      if(rowOfFour.every(square => candyColorArray[square] === currentColor)) {
        rowOfFour.forEach(square => candyColorArray[square] = '')
        return true
      }
    }  
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= candyColorArray.length - WIDTH * 3; i++) {
      const columnOfFour = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3]
      const currentColor = candyColorArray[i]

      if(columnOfFour.every(square => candyColorArray[square] === currentColor)) {
        columnOfFour.forEach(square => candyColorArray[square] = '')
        return true
      }
    }  
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= candyColorArray.length - WIDTH * 2; i++) {
      const columnOfThree = [i, i + WIDTH, i + WIDTH * 2]
      const currentColor = candyColorArray[i]

      if(columnOfThree.every(square => candyColorArray[square] === currentColor)) {
        columnOfThree.forEach(square => candyColorArray[square] = '')
        return true
      }
    }  
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i < candyColorArray.length - WIDTH; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && candyColorArray[i] === '') {
        let randomNumber = Math.floor(Math.random() * CANDY_COLORS.length)
        candyColorArray[i] = CANDY_COLORS[randomNumber]
      }

      if(candyColorArray[i + WIDTH] === '') {
        candyColorArray[i + WIDTH] = candyColorArray[i]
        candyColorArray[i] = ''
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

    candyColorArray[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor
    candyColorArray[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - WIDTH,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + WIDTH,
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isAColumnOfFour = checkForColumnOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfFour = checkForRowOfFour()
    const isARowOfThree = checkForRowOfThree()

    if (squareBeingReplacedId && validMove &&
      (isARowOfFour || isAColumnOfThree || isAColumnOfFour || isARowOfThree)) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
      candyColorArray[squareBeingReplacedId] = squareBeingReplaced.style.backgroundColor
      candyColorArray[squareBeingDraggedId] = squareBeingDragged.style.backgroundColor
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
            src=""
            alt={candyColor}
            key={i}
            style={{backgroundColor: candyColor}}
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
    </div>
  );
}

export default App;
