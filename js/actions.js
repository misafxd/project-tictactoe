const RenderGames = (function(){
    const main = document.querySelector(".main");

    const clean = () => {
        while(main.firstChild){
            main.removeChild(main.firstChild);
        }
    }
    
    const renderCells = () =>{
        Gameboard.showBoard().forEach((c, index) =>{
            const cell = document.createElement("button");
            cell.classList.add("cell");
            cell.setAttribute("data-id", index)
            cell.textContent = c;
            cell.addEventListener('click', () => {
                Game.cellClickHandler(index);
            });
            main.append(cell)
        })
    }

    return {
        renderCells, clean,
    }
})();


const Gameboard = (function(){
    let board = new Array(9).fill(" ");
    const winCombinations = {
        1 : [0,1,2],
        2 : [3,4,5],
        3 : [6,7,8],
        4 : [0,4,8],
        5 : [2,4,6],
        6 : [0,3,6],
        7 : [1,4,7],
        8 : [2,5,8]
    }

    const cleanBoard = () => {
        board.fill(" ")
    }

    const showBoard = () => {
        return board;
    }
    
    const setMark = (position ,mark) =>{
        return board[position] == " " ? board.splice(position, 1, mark) : console.log("position already taken");
    }

    const emptyCell = (position) => {
        return board[position] == " ";  
    }

    const full = () => {
        return !board.includes(" ");
    }

    const win = (mark) => {
        const currentMark = mark;
        for (let combination in winCombinations) {
            let [a, b, c] = winCombinations[combination];
            if (board[a] === currentMark && board[b] === currentMark && board[c] === currentMark) {
                return true;
            }
        }
        return false;
    };

    return {
        showBoard, setMark, full, cleanBoard, emptyCell, win
    }
})();

function Player(mark){

    return {mark}
}

const Game = (function (){
    const maincontent = document.querySelector(".main-content");
    const player1 = Player("X");
    const player2 = Player("O");
    let currentPlayer = player1;
    let gameOver = false;

    const newGame = () =>{
        RenderGames.clean();
        Gameboard.cleanBoard();
        RenderGames.renderCells();
        gameOver = false;
        if(maincontent.childElementCount > 1){
            maincontent.removeChild(maincontent.lastChild);
        }
    }

    const switchPlayer = () =>{
        currentPlayer == player1 ? currentPlayer = player2 :  currentPlayer = player1;
        return currentPlayer;
    }

    const cellClickHandler = (position) => {
        if(gameOver) return;

        if (Gameboard.emptyCell(position)) {
            Gameboard.setMark(position, currentPlayer.mark);
            if (!gameStatus()) {
                RenderGames.clean();
                RenderGames.renderCells(); 

            } else {
                switchPlayer(); 
                RenderGames.clean();
                RenderGames.renderCells();
                gameOver = true;
            }
        } 
    }

    const gameStatus = () =>{
        let current = currentPlayer.mark;
        let message = document.createElement("p");
        let player1name = document.getElementById("player1");
        let player2name = document.getElementById("player2");

        message.classList.add("result");
        if(Gameboard.win(current)){
            if(current == "X"){
                maincontent.appendChild(message).textContent = `${player1name.textContent} wins!`
            } else if(current == "O"){
                maincontent.appendChild(message).textContent = `${player2name.textContent} wins!`
            }else{
                maincontent.appendChild(message).textContent = `Player "${current}" wins!`
            }
            return true;
        }
        if(Gameboard.full()){
            maincontent.appendChild(message).textContent = "It's a tie"
            return true;
        }
        switchPlayer();
        return false;
    }


    return {
        newGame, cellClickHandler
    }
})();

Game.newGame();




