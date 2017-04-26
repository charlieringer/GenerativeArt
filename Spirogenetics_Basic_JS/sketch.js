var graphs = [];
var currentGraph;
var centerX = 400;
var centerY = 400;
var numbPop = 10;
var range = 800;

function setup() {
	createCanvas(range,range);
	colorMode(RGB, range);
	for (var i = 0; i < numbPop; i++){
		var dna = [];
		for(var j = 0; j < 9; j++) dna.push(getNextValue()); 
		dna.push(0); //Fitness score
		graphs.push(dna);
	}
	currGraph = 0;
}

function draw() {
	values = graphs[currGraph];
	background(values[0],values[1],values[2]);
	stroke(values[3], values[4], values[5]);
    var a = values[6]; 
    var b = values[7]; 
    var h = values[8]; 

    for (var i=1; i<361; i+=1) {
      var t = radians(i);
      var oldt = radians(i-1);
      var oxpos = (a-b)*cos(a*oldt)+h*cos(a*oldt);
      var oypos = (a-b)*sin(a*oldt)+h*sin(a*oldt);    
      var xpos = (a-b)*cos(t)+h*cos(a*t);
      var ypos = (a-b)*sin(t)+h*sin(a*t);
      line(centerX+oxpos, centerY+oypos, centerX+xpos, centerY+ypos);
    }
}

function applyGenetics(){
  var newGraphs = [];
  var sortedGraphs = sortPopulation(graphs);
  var selectionThreshold = Math.floor(sortedGraphs.length/2);
  //selection
  for (var i = 0; i < selectionThreshold; i++){
    var totalFitness = 0;
    for (var j = 0; j < sortedGraphs.length; j++)  if (sortedGraphs[j] != null)  totalFitness += sortedGraphs[j][9];

    var randomPoint = (totalFitness > 0) ? random(totalFitness) : 0;
    var count = 0;

    for (var j = 0; j < sortedGraphs.length; j++){
      if (sortedGraphs[j] != null){
        count+= sortedGraphs[j][9];
        if (count >= randomPoint){
          newGraphs.push(sortedGraphs[j]);
          sortedGraphs[j] = null;
          break;
        }
      }
    }
  }
  //crossover
  for (var i = 0; i < selectionThreshold; i++ ) {
    var indxA = Math.floor(random(selectionThreshold));
    var indxB = Math.floor(random(selectionThreshold));
    var newValues = [];
    for (var j = 0; j < 9; j++) newValues.push((random(1) < 0.5) ? newGraphs[indxA][j] : newGraphs[indxB][j]);
    newValues.push(0); //fitness
    newGraphs.push(newValues);
  }
  //mutation
  for (var i = 0; i < newGraphs.length; i++ ) {
    if (random(1) < 0.05) {
      for (var j = 0; j < 9; j++ ) if (random(1) < 0.05) newGraphs[i].values[j] = getNextValue();
    }
  }
  graphs = newGraphs;
}

function sortPopulation(population) {
  var sorted = [];
  for (var i = 0; i < population.length; i++) {
    var bestIndex = -1;
    var bestFitness = -1;
    for (var j = 0; j < population.length; j++) {

      if (population[j] != null && population[j][9] > bestFitness) {
        bestFitness = population[j][9];
        bestIndex = j;
      }
    }
    sorted.push(population[bestIndex]);
    population[bestIndex] = null;
  }
  return sorted;
}

function getNextValue(){ return random(0, range);}

function keyPressed() {
  if (key >= 1 && key <= 9) {
    print("Graph "+currGraph+" given fitness of "+(key));
    graphs[currGraph][9] = parseInt(key);
    currGraph = (currGraph == graphs.length-1) ? 0 : currGraph+1;
    if (currGraph==0) {
      print("Population evaluated, applying genetics.");
      applyGenetics();
    }
  }
}