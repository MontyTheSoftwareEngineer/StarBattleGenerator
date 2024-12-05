class GameBoard {
  constructor(rows, cols, cellSize, seed, starDifficulty) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.seed = seed;
    this.starDifficulty = starDifficulty;
    this.rNG = new SeededRandom(seed);
    this.grid = [];
    this.starStack = [];
    this.currCol = 0;
    this.backUpA = 0;

    for (let x = 0; x < this.cols; x++) {
      let col = [];
      for (let y = 0; y < this.rows; y++) {
        let cell = new Cell(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize
        );
        col.push(cell);
      }
      this.grid.push(col);
    }

    //create first star
    const startCell = [0, this.rNG.randomInt(0, rows - 1)];
    this.starStack.push([startCell[0], startCell[1]]);
    this.grid[startCell[0]][startCell[1]].state = 1;
    this.grid[startCell[0]][startCell[1]].starEligible = false;

    this.markIneligibles(startCell);
  }

  /**
   * @brief Draws all the cells in the gameboard.
   */
  draw() {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        this.grid[x][y].display();
      }
    }
  }

  /**
   * @brief Clears all the columns from END to colNum.
   *
   * @param colNum Index of column(x)  to end the clearing.
   *
   */
  clearCol(colNum) {
    for (let cc = this.cols - 1; cc >= colNum; cc--) {
      for (let row = 0; row < this.rows; row++) {
        this.grid[cc][row].state = 0;
        this.grid[cc][row].starEligible = true;
        this.grid[cc][row].state = 0;
      }
    }
  }

  /**
   * @brief Attempts to create a star for the next column (x).
   *
   */
  createNextStarInCol() {
    let passed = false;
    let attempts = 0;

    while (!passed && attempts < 20) {
      const newCell = [this.currCol, this.rNG.randomInt(0, this.rows - 1)];
      let starCount = this.countStars(newCell);

      if (
        this.grid[newCell[0]][newCell[1]].starEligible &&
        starCount[0] < this.starDifficulty
      ) {
        this.grid[newCell[0]][newCell[1]].state = 1;
        this.grid[newCell[0]][newCell[1]].starEligible = false;
        this.markIneligibles(newCell);
        this.starStack.push(newCell);
        passed = true;
      }

      attempts++;
    }
  }

  /**
   * @brief Counts the number of "stars" in the horizontal and vertical lines passing through the given cell.
   *
   * @param currentCell An array where the first element is the column(x) index and the second element is the row(y) index of the cell.
   * @return An array where the first element is the count of stars in the horizontal line,
   *         and the second element is the count of stars in the vertical line.
   */
  countStars(currentCell) {
    let countVertical = 0;
    let countHorizontal = 0;

    for (let y = 0; y < this.rows; y++) {
      if (this.grid[currentCell[0]][y].state == 1) countVertical++;
    }

    for (let x = 0; x < this.cols; x++) {
      if (this.grid[x][currentCell[1]].state == 1) countHorizontal++;
    }

    return [countHorizontal, countVertical];
  }

  /**
   * @brief Marks the given cell and its surrounding cells as ineligible for placing a star.
   *
   * @param currentCell An array where the first element is the column(x) index and the second element is the row(y) index of the cell.
   */
  markIneligibles(currentCell) {
    const upperRow = currentCell[1] - 1;
    const rightCol = currentCell[0] + 1;
    const leftCol = currentCell[0] - 1;
    const lowerRow = currentCell[1] + 1;

    //mark current cell as ineligible
    this.grid[currentCell[0]][currentCell[1]].starEligible = false;

    let starCount = this.countStars(currentCell);

    //detect if horizontally we've reached star limit, if so
    //mark rest of cells horizontally as ineligible
    if (starCount[0] == starDifficulty) {
      for (let col = currentCell[0]; col < this.cols; col++) {
        this.grid[col][currentCell[1]].starEligible = false;
      }
    }

    if (upperRow >= 0) {
      //cell above
      this.grid[currentCell[0]][upperRow].starEligible = false;

      //cell top right
      if (rightCol < this.cols) {
        this.grid[rightCol][upperRow].starEligible = false;
      }

      //cell top left
      if (leftCol >= 0) {
        this.grid[leftCol][upperRow].starEligible = false;
      }
    }

    if (lowerRow < this.rows) {
      //cell below
      this.grid[currentCell[0]][lowerRow].starEligible = false;

      //cell bottom right
      if (rightCol < this.cols) {
        this.grid[rightCol][lowerRow].starEligible = false;
      }

      //cell bottom left
      if (leftCol >= 0) {
        this.grid[leftCol][lowerRow].starEligible = false;
      }
    }

    //cell to the right
    if (rightCol < this.cols) {
      this.grid[rightCol][currentCell[1]].starEligible = false;
    }

    //cell to the left; currently commented out since we are already working left to right
    //   if (leftCol >= 0) {
    //     grid[leftCol][currentCell[1]].starEligible = false;
    //   }
  }

  /**
   * @brief Iterative gameboard creation to visualize and debug. Called each time we want to step into the next
   * step of gameboard creation.
   */
  nextIteration() {
    if (this.starStack.length == 0) {
      return;
    }

    const currentCell = this.starStack[0];
    this.starStack.shift();

    //determine stars needed to be added in relation to current star.
    let starCount = this.countStars(currentCell);
    const starsNeededVert = starDifficulty - starCount[1];
    const starsNeededHoriz = starDifficulty - starCount[0];

    //add stars vertically
    let starsAdded = 0;
    let attempts = 0;
    while (starsAdded < starsNeededVert && attempts < 20) {
      let newRow = this.rNG.randomInt(0, rows - 1);

      let rowStarCount = this.countStars([currentCell[0], newRow]);
      if (
        this.grid[currentCell[0]][newRow].starEligible &&
        rowStarCount[0] < this.starDifficulty
      ) {
        this.grid[currentCell[0]][newRow].state = 1;
        this.markIneligibles([currentCell[0], newRow]);
        starsAdded++;
      } else {
        attempts++;
      }
    }

    if (attempts >= 20) {
      this.backUpA++;
      if (this.backUpA >= 20) {
        console.log("Too many reattempts");
        return;
      }
      this.currCol--;

      this.clearCol(this.currCol);

      let prevCol = this.currCol - 1;
      for (let row = 0; row < this.rows; row++) {
        if (this.grid[prevCol][row].state) {
          this.markIneligibles([prevCol, row]);
        }
      }

      this.createNextStarInCol();
    } else {
      this.currCol++;

      if (this.currCol < cols) {
        this.createNextStarInCol();

        //stepOne();
      }
    }
  }
}
