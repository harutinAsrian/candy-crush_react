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
      }
    }  
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < candyColorArray.length; i++) {
      const rowOfFour = [i, i + 1 , i + 2,  i+ 3]
      const currentColor = candyColorArray[i]

      if(rowOfFour.every(square => candyColorArray[square] === currentColor)) {
        rowOfFour.forEach(square => candyColorArray[square] = '')
      }
    }  
  };



  const checkForColumnOfFour = () => {
    for (let i = 0; i < candyColorArray.length - WIDTH * 3; i++) {
      const columnOfFour = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3]
      const currentColor = candyColorArray[i]

      if(columnOfFour.every(square => candyColorArray[square] === currentColor)) {
        columnOfFour.forEach(square => candyColorArray[square] = '')
      }
    }  
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i < candyColorArray.length - WIDTH * 2; i++) {
      const columnOfThree = [i, i + WIDTH, i + WIDTH * 2]
      const currentColor = candyColorArray[i]

      if(columnOfThree.every(square => candyColorArray[square] === currentColor)) {
        columnOfThree.forEach(square => candyColorArray[square] = '')
      }
    }  
  };



  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForRowOfThree();
      checkForRowOfFour();
      checkForColumnOfFour();
      checkForColumnOfThree();
      setCandyColorArray([...candyColorArray])
    }, 100)

    return () => clearInterval(timer)
  }, [checkForRowOfThree, checkForRowOfFour, checkForColumnOfFour, checkForColumnOfThree, candyColorArray])

  return (
    <div className="app">
      <div className="game">
        {candyColorArray.map((candyColor, i) => (
          <img
            src=""
            alt={candyColor}
            key={i}
            style={{backgroundColor: candyColor}}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
