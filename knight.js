
// Square class with name and coordinates properties
class Square{
    constructor(number, coordinates) {
        this.name = number;
        this.coordinates = coordinates;
      }
}

// Create the board array and fill it with 64 Square objects
let board = [];
let number = 0;

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++){
        board.push(new Square(number, [i, j]));
        number ++;
    }
}

// Determine the neighbors for each square
// Neighbors are other squares which are reachable with one valid knight move
function determineNeighbors(square){
    let x = square.coordinates[0];
    let y = square.coordinates[1];
    
    let possiblities = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
    let neighbors = [];

    for (let n = 0; n < possiblities.length;n++){
        let comboX = x + possiblities[n][0];
        let comboY = y + possiblities[n][1];
        if(comboX >=0 && comboX < 8 && comboY >=0 && comboY < 8){
            const indexHelper = (element) => JSON.stringify(element.coordinates) === JSON.stringify([comboX, comboY]);
            let index = board.findIndex(indexHelper);
            neighbors.push(index);
        }
    }
    return neighbors;
}

// For each square in the board array determine its neighbors with the above function
board.forEach((element) => element.neighbors = determineNeighbors(element));

// Create the adjacency list graph representation of the board
let adjList = [];
board.forEach((element) => adjList.push(element.neighbors));

/* A Queue object for queue-like functionality over JavaScript arrays. Copied from one of the Khan Academy exercises*/
class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(obj) {
        this.items.push(obj);
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}

// A function which performs a BFS on the graph (adjacency list) and for each node determines its distance from the source
// and contains the reference to its predecessor on the path
function doBFS(graph, source) {
    const bfsInfo = [];

    for (let i = 0; i < graph.length; i++) {
	    bfsInfo[i] = {
	        distance: null,
	        predecessor: null };
    }

    bfsInfo[source].distance = 0;

    let queue = new Queue();
    queue.enqueue(source);

    // Traverse the graph
    
    while (!queue.isEmpty()) {
        let u = queue.dequeue();

        for (let dist = 0; dist < graph[u].length; dist++) {
            let v = graph[u][dist];

        if (bfsInfo[v].distance === null) {
            bfsInfo[v].distance = bfsInfo[u].distance + 1;
            bfsInfo[v].predecessor = u;
            queue.enqueue(v);
        }
        }
}
    return bfsInfo;
};

// Function which builds upon the BFS function and uses recursion to determine the exact path from the source to the goal via predecessors
function path(allPaths, station, result = []){
    if (allPaths[station].predecessor === null){
        return result;
    } else {
        result.push(allPaths[station].predecessor);
        return path(allPaths, allPaths[station].predecessor, result);
    }
}

// This function converts the start and goal square coordinates to indexes which can be used with BFS and path functions 
// in order to return the coordinates of all the squares on the path from start to goal
function knightMoves(start, goal){
    const startNumber = (element) => JSON.stringify(element.coordinates) === JSON.stringify(start);
    const goalNumber = (element) => JSON.stringify(element.coordinates) === JSON.stringify(goal);
    let startIndex = board.findIndex(startNumber);
    let goalIndex = board.findIndex(goalNumber);

    let bfsInfo = doBFS(adjList, goalIndex);
    let pointsList = path(bfsInfo, startIndex);

    let numberOfMoves = bfsInfo[startIndex].distance;

    let pointsArray = []
    pointsList.unshift(startIndex);
    pointsList.forEach((element) => pointsArray.push(board[element].coordinates));

    return `You made it in ${numberOfMoves} moves!  Here's your path: ${JSON.stringify(pointsArray)}`;
}

console.log(knightMoves([0,0],[7,7]));
console.log(knightMoves([1,1],[5,7]));
console.log(knightMoves([3,4],[3,3]));
console.log(knightMoves([2,2],[3,3]));
