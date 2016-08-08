function Tetrix (size, htmlElementToRender){

    this.size = size;
    var LEFT = [-1, 0];
    var RIGHT = [1, 0];
    var DOWN = [0, 1];
    var ROTATE_RIGHT = []
    var plate = [];

    var SHAPE_SIZE = 20;

    function Shape(x, y) {
        this.x = x;
        this.y = y;
    }

    var allShape = [
      new Square(),
      new Line(),
      new LShape(),
      new ReverseLShape(),
      new SShape(),
      new ZShape(),
      new TShape()
    ];
    function isEqual(obj1, obj2) {
      return JSON.stringify(obj1) == JSON.stringify(obj2);
    }
    function Square() {
        var x = size/2 -2;
        var y = 0;
        var structure =  [new Shape(x,y), new Shape(x+1, y), new Shape(x, y+1), new Shape(x+1, y+1)];
        return structure;
    }
    function Line() {
      var x = size/2 -2;
        var y = 0;
        var structure = [new Shape(x,y), new Shape(x+1, y), new Shape(x+2, y), new Shape(x+3, y)];
        return structure;
    }
    function LShape() {
      var x = size/2 -2;
      var y = 0;
      var structure = [new Shape(x,y), new Shape(x+1, y), new Shape(x+2, y), new Shape(x+2, y+1)];
      return structure;

    }
    function ReverseLShape() {
      var x = size/2 -2;
      var y = 0;
      var structure = [new Shape(x,y), new Shape(x+1, y), new Shape(x+2, y), new Shape(x, y+1)];
      return structure;
    }
    function SShape() {
      var x = size/2 -2;
      var y = 0;
      var structure= [new Shape(x,y), new Shape(x, y+1), new Shape(x+1, y+1), new Shape(x+1, y+2)];
      return structure;
    }
    function ZShape() {
      var x = size/2 -2;
      var y = 0;
      var structure = [new Shape(x,y), new Shape(x+1, y), new Shape(x+1, y+1), new Shape(x+2, y+1)];
      return structure;
    }
    function TShape() {
      var x = size/2 -2;
      var y = 0;
      var structure = [new Shape(x,y), new Shape(x+1, y), new Shape(x+2, y), new Shape(x+1, y+1)];
      return structure;
    }
    function rotate(direction) {

    }
    function getNextShape() {
      var next = Math.trunc((Math.random() * 10) % allShape.length);
      console.log(next);
      return allShape[next];
    }

    function initialize(){
      for (var i =0; i < size; i++) {
        plate[i] = [];
        for (var j =0; j < size; j++){
          if (i == 0 || i == (size -1) || j == (size -1)){
            plate[i][j] = new Shape(i, j);
          }else {
            plate[i][j] = null;
        }
        }
      }
    }
    function clearRow() {
       var scanToRow = size -1;
      for (var i = 0; i < scanToRow; i++) {
        var canRemoveThisRow = true;

        for (var j = 0; j < size ; j++) {
          if (plate[i][j] == null){
            canRemoveThisRow = false;
            break;
          }
        }
        if (canRemoveThisRow) {
          shiftRow(i);
        }
      }
    }
    function move(currentShape, direction) {
      var nextMove = [];
      var success = true;
      currentShape.forEach(function(shape) {
        nextMove.push(new Shape(shape.x + direction[0] ,shape.y + direction[1]));
      });

      var effectiveShape = removeSameElementFrom(nextMove, currentShape);

      for (var i = 0; i < effectiveShape.length; i++) {
        if (plate[effectiveShape[i].x][effectiveShape[i].y] != null) {
          success = false;
          break;
        }
      }
      if (success){
        return nextMove;
      }else {
        return currentShape;
      }
    }

    function removeSameElementFrom(from, shapeChekers) {
      var shapes = from.filter(function (shape) {
        return !shapeChekers.find(function(c) {
          return isEqual(shape, c)
        });
      });
      return shapes;
    }

    function shiftRow(row) {
      var rowToMove = row -1;
      while (row > 0) {
        for (var i = 0; i < size; i++) {
          plate[row][i] = plate[row -1][i];
        }
        row--;
      }
      for(var i = 0; i < size; i++){
        plate[0][i] == null;
      }
    }
    function toPlate(previousShape, currentShape) {
      previousShape.forEach(function(shape) {
        plate[shape.x][shape.y] = null;
      });
      currentShape.forEach(function(shape) {
        plate[shape.x][shape.y] = shape;
      });


    }
    function display(){
      var canvas = document.getElementById(htmlElementToRender);
      canvas.setAttribute("width", size * SHAPE_SIZE);
      canvas.setAttribute("height", size * SHAPE_SIZE);
      var ctx = canvas.getContext("2d");
      for (var i =0; i < size; i++){
        for (var j =0; j < size; j++){
          if (plate[i][j] == null){
            ctx.fillStyle = "#F0F0F0";
          }else {
            ctx.fillStyle = 'red';
          }
          ctx.fillRect(i * SHAPE_SIZE, j* SHAPE_SIZE, SHAPE_SIZE, SHAPE_SIZE);
        }
      }
    }

    this.start =function() {
      initialize();
      var shape = null;
      var canMove = false;
      var interval = setInterval(function() {
        if (canMove == false){
          clearRow();
          shape = getNextShape();
        }
        var movedShape = move(shape, DOWN);
        if (isEqual(movedShape, shape) ==false) {
          canMove = true;
          toPlate(shape, movedShape);
          shape = movedShape;
        }else {
          canMove = false;
        }
        display();
      }, 200);


    }
}

(function(){
  var tetrix = new Tetrix(20, "tetrix");
  tetrix.start();
})();

