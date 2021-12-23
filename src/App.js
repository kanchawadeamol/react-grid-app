import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState(0);
  const [cols, setColumns] = useState(0);
  const [grid, setGrid] = useState([]);
  const [characters, setCharacters] = useState("");
  const [searchText, setSearchText] = useState("");
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setHighlightedCells([]);
    let emptyGrid = Array(rows).fill(Array(cols).fill(""));
    let filledGrid = emptyGrid.map((row, rowIndex) => {
      return row.map(
        (cell, cellIndex) => characters[cellIndex + rowIndex * cols] ?? "-"
      );
    });

    setGrid(filledGrid);

    if (searchText && grid.length) {
      findWword();
    }
  }, [showGrid, searchText]);

  const findWword = () => {
    setHighlightedCells([]);

    let firstCharPosition = "";

    grid.some((row, rowIndex) => {
      row.length &&
        row.some((cell, cellIndex) => {
          if (cell === searchText[0]) {
            firstCharPosition = `${rowIndex}-${cellIndex}`;
          }
          return cell === searchText[0];
        });
    });

    let searchTextArr = searchText.split("");

    checkHorizontal(firstCharPosition, searchTextArr);
    checkVertical(firstCharPosition, searchTextArr);
    checkDiagonal(firstCharPosition, searchTextArr);
  };

  const checkHorizontal = (firstCharPosition, searchTextArr) => {
    let rowNumber = parseInt(firstCharPosition.split("-")[0]);
    let colNumber = parseInt(firstCharPosition.split("-")[1]);

    let wordPosition = [];

    let isInvalid = searchTextArr.some((char, index) => {
      if (colNumber + index >= cols) return true;
      wordPosition.push(`${rowNumber}-${colNumber + index}`);
      return char !== grid[rowNumber]?.[colNumber + index];
    });

    if (!isInvalid) setHighlightedCells([...highlightedCells, ...wordPosition]);
    console.log();
  };

  const checkVertical = (firstCharPosition, searchTextArr) => {
    let rowNumber = parseInt(firstCharPosition.split("-")[0]);
    let colNumber = parseInt(firstCharPosition.split("-")[1]);

    let wordPosition = [];

    let isInvalid = searchTextArr.some((char, index) => {
      if (rowNumber + index >= rows) return true;
      wordPosition.push(`${rowNumber + index}-${colNumber}`);
      return char !== grid[rowNumber + index]?.[colNumber];
    });

    if (!isInvalid) setHighlightedCells([...highlightedCells, ...wordPosition]);
  };

  const checkDiagonal = (firstCharPosition, searchTextArr) => {
    let rowNumber = parseInt(firstCharPosition.split("-")[0]);
    let colNumber = parseInt(firstCharPosition.split("-")[1]);

    let wordPosition = [];

    let isInvalid = searchTextArr.some((char, index) => {
      if (colNumber + index >= cols || rowNumber + index >= rows) return true;
      wordPosition.push(`${rowNumber + index}-${colNumber + index}`);
      return char !== grid[rowNumber + index]?.[colNumber + index];
    });

    if (!isInvalid) setHighlightedCells([...highlightedCells, ...wordPosition]);
    console.log("highlightedCells : " + highlightedCells);
  };

  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "rows":
        setRows(parseInt(e.target.value));
        break;

      case "columns":
        setColumns(parseInt(e.target.value));
        break;

      case "characters":
        setCharacters(e.target.value.replace(/\s/g, ""));
        break;

      case "searchText":
        setSearchText(e.target.value);
        break;

      default:
        return;
    }
  };

  const resetClickHandler = () => {
    setRows(0);
    setColumns(0);
    setGrid([]);
    setCharacters("");
    setSearchText("");
    setHighlightedCells([]);
    setShowGrid(false);
  };

  const displayGridHandler = () => {
    const totalGridNumber = rows * cols;

    if (totalGridNumber !== characters.length) {
      setError(true);
      return;
    }

    if (rows <= 0 || cols <= 0) {
      return;
    }

    setError(false);
    setShowGrid(true);
  };

  return (
    <div className="container">
      {!showGrid && (
        <div className="form-div">
          <div className="input-field">
            <label>Rows</label>
            <input
              min="0"
              name="rows"
              type="number"
              value={rows}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-field">
            <label>Columns</label>
            <input
              min="0"
              name="columns"
              type="number"
              value={cols}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-field">
            <label>Characters</label>
            <input
              name="characters"
              type="text"
              value={characters}
              onChange={handleInputChange}
            />
          </div>
          {error && (
            <div className="error">{`Please Enter ${
              rows * cols
            } characters`}</div>
          )}
          <div className="action">
            {!showGrid && (
              <button onClick={displayGridHandler}>Display Grid</button>
            )}
          </div>
        </div>
      )}
      {showGrid && (
        <div className="grid-container">
          <div className="input-field">
            <label>Search Text</label>
            <input
              name="searchText"
              type="text"
              value={searchText}
              onChange={handleInputChange}
            />
          </div>
          {grid.length &&
            grid.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="row">
                  {row.map((cell, cellIndex) => {
                    let cellPosition = `${rowIndex}-${cellIndex}`;
                    return (
                      <div
                        key={cellIndex}
                        className={`cell ${
                          highlightedCells.includes(cellPosition)
                            ? "highlight"
                            : ""
                        }`}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          <div className="action">
            <button onClick={resetClickHandler}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
