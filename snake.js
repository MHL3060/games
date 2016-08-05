

function Game(size, numberOfObstacle, htmlElementToRender, isMachinePlay) {




  this.htmlElementToRender = htmlElementToRender;
  this.size = size;
  this.numberOfObstacle = numberOfObstacle;
  this.isMachinePlay = isMachinePlay;
  var growAfterThisMove = 50;
  var elementSize = 5;

  var NORTH = [0, -1];
  var EAST =  [1, 0];
  var SOUTH = [0, 1];
  var WEST =  [-1, 0];
  var allPossibleDirections = [
    [NORTH, EAST, SOUTH, WEST],
    [NORTH, EAST, WEST, SOUTH],
    [NORTH, SOUTH, EAST, WEST],
    [NORTH, SOUTH, WEST, EAST],
    [NORTH, WEST, SOUTH, EAST],
    [NORTH, WEST, EAST, SOUTH],
    [EAST, NORTH, WEST, SOUTH],
    [EAST, NORTH, SOUTH, WEST],
    [EAST, WEST, NORTH, SOUTH],
    [EAST, WEST, SOUTH, NORTH],
    [EAST, SOUTH, NORTH, WEST],
    [EAST, SOUTH, WEST, NORTH],
    [SOUTH, EAST, WEST, NORTH],
    [SOUTH, EAST, NORTH, WEST],
    [SOUTH, NORTH, EAST, WEST],
    [SOUTH, NORTH, WEST, EAST],
    [SOUTH, WEST, EAST, NORTH],
    [SOUTH, WEST, NORTH, EAST],
    [WEST, SOUTH, NORTH, EAST],
    [WEST, SOUTH, EAST, NORTH],
    [WEST, NORTH, EAST, SOUTH],
    [WEST, NORTH, SOUTH, EAST],
    [WEST, EAST, NORTH, SOUTH],
    [WEST, EAST, SOUTH, NORTH]
  ];
  var plate = [];
  var obstacleLocation = [];
  var currentDirection;
  var snake = [];
  initialize();
  var totalMove = 0;


  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  function Snake(x, y){
    this.x = x;
    this.y = y;
  }

  function clear() {
    for (var i = 0; i < size; i++) {
      plate[i] = [];
      for (var j = 0; j < size; j++) {

        if (i == 0 || i == (size-1) || j == 0 || j == (size -1)) {
          plate[i][j] = '#';
        }else {
          plate[i][j] = '';
        }

      }
    }
    for (var i = 0; i < numberOfObstacle; i++){
      plate[obstacleLocation[i][0]][obstacleLocation[i][1]] = '#';
    }
  }
  function generateObstacle() {
    for (var i = 0; i < numberOfObstacle; i ++){
      obstacleLocation[i] = [Math.trunc(Math.random() * size), Math.trunc(Math.random() * size)];
    }
  }
  function initialize() {
    if (isMachinePlay ==false){
      registerUserInput();
    }
    generateObstacle();
    clear();
    var center = size/2;

    var snakeBody = new Snake(center,center-1);

    snake.push(snakeBody);
    snake.push(new Snake(center,center));
  }
  function generateRandomDirections() {
    var number = Math.trunc(Math.random() * 100) % allPossibleDirections.length;
    return allPossibleDirections[number];
  }
  function determineDirection(x, y, currentLocation) {
    if ((getLocation(x,y, currentDirection) == '#' || getLocation(x,y, currentDirection) == 's') == false) {
      return currentDirection;
    }else {
      var allDirections = generateRandomDirections();
      for (var i = 0; i < allDirections.length; i++){
        if ((getLocation(x,y,allDirections[i]) == '#' || getLocation(x,y,allDirections[i]) == 's') == false) {
          return allDirections[i];
        }
      }
      throw new Error("GAME OVER");
    }
  }
  function getLocation(x, y, direction) {

    var symbol = plate[x + direction[0]][y+ direction[1]];

    return symbol;
  }
  function move () {
    totalMove++;
    var oldHead = snake[0];
    if (isMachinePlay){
      currentDirection = determineDirection(oldHead.x, oldHead.y, currentDirection);
    }else {
      if (getLocation(oldHead.x, oldHead.y, currentDirection) == '#' || getLocation(oldHead.x, oldHead.y, currentDirection) == 's') {
        throw new Error("GAME OVER");
      }
    }
    var s = new Snake(oldHead.x + currentDirection[0], oldHead.y + currentDirection[1]);
    snake.unshift(s);
    if (totalMove % growAfterThisMove != 0) {
      snake.pop();
    }
  }
  function display() {
    clear();
    for (var i = 0; i < snake.length; i++) {
      plate[snake[i].x][snake[i].y] = 's';
    }
   showInCanvas();
  }
  function showInCanvas() {
    var canvas = document.getElementById(htmlElementToRender);
    canvas.setAttribute("width", size * elementSize);
    canvas.setAttribute("height", size * elementSize);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    for (var i = 0; i < plate.length; i++) {
      for(var j = 0; j < plate[i].length; j++) {

        if (plate[i][j] == '') {
          ctx.fillStyle = "#F0F0F0";
        }else if (plate[i][j] == '#') {
          ctx.fillStyle = "grey";
        }else if (plate[i][j] == 's'){
          ctx.fillStyle = "green";
        }
        ctx.fillRect(i * elementSize, j* elementSize, elementSize, elementSize);
        ctx.fillStyle = "#F0F0F0";
      }
    }
  }
  function registerUserInput() {
    window.addEventListener( "keypress", onKeyPress, false );
  }
  function onKeyPress(e) {
    if (e.key == 'a') {
      currentDirection = WEST;
    }else if (e.key == 'w') {
      currentDirection = NORTH;
    }else if (e.key == 'd') {
      currentDirection = EAST;
    }else if (e.key == 's'){
      currentDirection = SOUTH;
    }else{
      currentDirection =  generateRandomDirections();
    }
  }
  this.start = function() {
    currentDirection = EAST;
    var interval = setInterval((function() {
      try {
        move();
      }catch (e) {

        clearInterval(interval);
        document.getElementById("score").innerHTML = "totalMove: "+ totalMove;
      }

      display();
    }).bind(this), 50);
  }
}


var game = new Game(100, 184,'game', false);
game.start();
var machine = new Game(100, 100, 'machine', true);
machine.start();


/*
* north = 0;
* east = 90
* south = 180;
* west = 270;

[0][0][0]
[0][0][0]
[0][0][0]


[0][90][180]
*/
