var AI = {
  
  // Assumes that the AI is Maximizer and controls pockets 7,8,9,10,11,12(,13)
  bestMove(currentGameState, depth){

    // Import the game state
    var gameState = this.copyToNewArray(currentGameState)
    var uncapGems = this.getTotalUncapturedGems(gameState) // Uncaptured gems
    if (uncapGems < 15){
      depth += 3
    } else if (uncapGems < 20){
      depth += 2 
    } else if (uncapGems < 30){
      depth += 1
    } else if (uncapGems > 45) {
      depth -= 1
    }
    depth = Math.max(depth, 1)
    console.log("searching at depth " + depth + "...")
    var [bestMove, value] = this.minimax(gameState, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, true)
    console.log("best move: " + bestMove)
    return [bestMove, -value] // value flipped because this is from player 2's perspective
  },

  minimax(currentGameState, depth, alpha, beta, maximizer, isRoot){
    //console.log(currentGameState)
    // Gets possible moves for the player
    var possibleMoves = this.findPossibleMoves(currentGameState, !maximizer)

    // Base case
    if((depth <= 0 && maximizer) || possibleMoves.length == 0){
      
      if(possibleMoves.length == 0){
        currentGameState = this.getEndGame(currentGameState)
      }
      return currentGameState[13]-currentGameState[6] // returns the difference between player 2 and player 1 scores
    }


    var bestMove = null
    var value = null

    if (maximizer){
      value = Number.NEGATIVE_INFINITY
      for(let i = 0; i < possibleMoves.length; i++){
        var [nextGameState, bonusTurn] = this.makeMove(currentGameState, possibleMoves[i]+7)
        var nextValue
        if (bonusTurn) {
          nextValue = this.minimax(nextGameState, depth-1, alpha, beta, true, false)
        } else {
          nextValue = this.minimax(nextGameState, depth-1, alpha, beta, false, false)
        }
        if (nextValue > value){
          bestMove = possibleMoves[i]
        }
        value = Math.max(value, nextValue)
        alpha = Math.max(alpha, value)
        if(value >= beta){
          break
        }
      }
    } else {
      value = Number.POSITIVE_INFINITY
      for(let i = 0; i < possibleMoves.length; i++){
        var [nextGameState, bonusTurn] = this.makeMove(currentGameState, possibleMoves[i])
        var nextValue
        if (bonusTurn) {
          nextValue = this.minimax(nextGameState, depth-1, alpha, beta, false, false)
        } else {
          nextValue = this.minimax(nextGameState, depth-1, alpha, beta, true, false)
        }
        value = Math.min(value, nextValue)
        beta = Math.min(beta, value)
        if(value <= alpha){
          break
        }
      }
    }

    if(isRoot){
      console.log("Value for move: " + value)
      return [bestMove, value]
    } else {
      return value
    }
  },

  copyToNewArray(array){
    var newArray = []
    for (let i = 0; i < array.length; i++){
      newArray.push(array[i])
    }
    return newArray
  },

  makeMove(currentGameState, move){
    var newGameState = this.copyToNewArray(currentGameState)
    var bonusTurn = false
    var player1 = null
    if(move < 6) {
      player1 = true
    } else {
      player1 = false
    }

    // Variables
    var gemCount = newGameState[move] // gem count in clicked pocket
    var currentPocket = move

    // Empties clicked pocket
    newGameState[currentPocket] = 0

    // Redistributes gems
    for(let i = 0; i < gemCount; i++){
      currentPocket = this.getNextPocket(currentPocket, player1)
      newGameState[currentPocket]++
    }

    // Check for capture
    newGameState = this.checkCapture(newGameState, currentPocket, player1)

    // Check for bonus move
    if(this.checkBonusTurn(currentPocket)){
      bonusTurn = true
    }
    
    return [newGameState, bonusTurn]
  },

  checkBonusTurn(currentPocket, p1){
    if (currentPocket == 6 || currentPocket == 13){
      return true
    }
    return false
  },

  getNextPocket(currentPocket, player1){
    currentPocket++
    if(player1){
        if(currentPocket == 13){
          currentPocket = 0
        }
      } else {
        if(currentPocket == 6){
          currentPocket = 7
        }
      }
      currentPocket = currentPocket%14
    return currentPocket
  },

  checkCapture(currentGameState, currentPocket, p1){
    var capturedPocket = 12-currentPocket
    var newGameState = this.copyToNewArray(currentGameState)
    if(currentGameState[currentPocket] == 1 && currentGameState[capturedPocket] != 0){
      if(p1){
        if(currentPocket < 6){
          newGameState = this.performCapture(newGameState, currentPocket, p1)
        }
      } else {
        if(currentPocket > 6 && currentPocket < 13){

          newGameState = this.performCapture(newGameState, currentPocket, p1)
        }
      }
    }
    return newGameState
  },

  performCapture(currentGameState, currentPocket, p1){
    var newGameState = this.copyToNewArray(currentGameState)
    var capturedPocket = 12-currentPocket
    var amount = newGameState[capturedPocket] + 1
    if(p1){
      newGameState[6]+=amount
    } else {
      newGameState[13]+=amount
    }
    newGameState[currentPocket] = 0
    newGameState[capturedPocket] = 0
    return newGameState
  },

  findPossibleMoves(currentGameState, player1){
    var moveList = []
    var offset = 0
    if(!player1) {offset = 7}
    for (let i = 0; i < 6; i++){
      if (currentGameState[i+offset] != 0){
        moveList.push(i)
      }
    }
    return moveList
  },

  getTotalUncapturedGems(currentGameState){
    var count = 0
    for(let i = 0; i<6; i++){
      count += currentGameState[i]
    }
    for(let i = 7; i<13; i++){
      count += currentGameState[i]
    }
    return count
  },

  getEndGame(currentGameState){
    for (let i = 0; i < 6; i++){
      currentGameState[6] += currentGameState[i]
      currentGameState[i] = 0
    }
    for (let i = 7; i < 13; i++){
      currentGameState[13] += currentGameState[i]
      currentGameState[i] = 0
    }
    return currentGameState
  },

}

export default AI