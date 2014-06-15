var Vector2D = function (x, y) {
    this.x = x;
    this.y = y;
};

var Map = function (size) {
    var mapTiles = [];
    for (var x = 0; x < size.x; x++) {
        var row = [];
        for (var y = 0; y < size.y; y++) {
            row.push(0);
        }
        mapTiles.push(row);
    }


    for (var i = 0; i < 5000; i++) {
        mapTiles[Math.floor(Math.random() * mapTiles.length)][Math.floor(Math.random() * mapTiles[0].length)] = 1;
    }


    this.getState = function (position) {
        if(mapTiles[position.x] != undefined && mapTiles[position.x][position.y] != undefined){
            return mapTiles[position.x][position.y];
        }
        else{
            return false
        }
    };
    this.setState = function (position, state) {
        mapTiles[position.x][position.y] = state;
    };
    this.getSize = function () {
        return size;
    }

};

var mapIterator = function (map, callback) {
    var size = map.getSize();
    for (var x = 0; x < size.x; x++) {
        for (var y = 0; y < size.y; y++) {
            var position = new Vector2D(x, y);
            callback(map, position);
        }
    }
};

var Game = function (map) {


    var getNextState = function (position) {
        //console.log(position);
        var positionR = {x: position.x +1, y: position.y};
        var positionL = {x: position.x -1, y: position.y};
        var positionU = {x: position.x, y: position.y -1};
        var positionD = {x: position.x, y: position.y + 1};

        var positionDL = {x: position.x - 1, y: position.y + 1};
        var positionDR = {x: position.x + 1, y: position.y + 1};
        var positionUL = {x: position.x - 1, y: position.y - 1};
        var positionUR = {x: position.x + 1, y: position.y - 1};
        var allAround = map.getState(positionL) + map.getState(positionR) + map.getState(positionU) + map.getState(positionD) + map.getState(positionUL) + map.getState(positionUR) + map.getState(positionDR) + map.getState(positionDL)

        if (map.getState(position) == 1 && !(allAround == 2 || allAround == 3 )) {

            return 0;
        } else if(map.getState(position) == 0 && (allAround == 3)) {
            //console.log(allAround);
            return 1;
        } else if (map.getState(position) == 0){
            return 0;
        }else{
            return 1;
        }


    };

    this.nextStep = function () {
        var size = map.getSize();
        var newMap = new Map(size);
        mapIterator(map, function (map, position) {
            newMap.setState(position, getNextState(position));
        });
        map = newMap;
    };
    this.getMap = function () {
        return map;
    };
};

var MapRenderer = function () {
    var renderPoint = function (position, state) {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        if (state == 1) {
            ctx.fillStyle = 'black';
        }else if (state == 0){
            ctx.fillStyle = 'white';
        }


        ctx.beginPath();
        ctx.fillRect(position.x * 3, position.y * 3, 3, 3);
        ctx.stroke();
    }


    this.renderMap = function (map) {
        mapIterator(map, function (map, position) {
            renderPoint(position, map.getState(position));
        });
    }
}


var map = new Map(new Vector2D(100, 100));
var game = new Game(map);
var map2 = game.getMap();

var mapRenderer = new MapRenderer();
mapRenderer.renderMap(map2);

var intervalFunction = function(){
    game.nextStep();
    var map2 = game.getMap();

    var mapRenderer = new MapRenderer();
    mapRenderer.renderMap(map2);
}


window.setInterval(intervalFunction, 20);

// TODO: ZAGADKI: dlaczego nie ustala się rozmiar canvas pixela