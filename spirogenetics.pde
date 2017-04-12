Spirograph[] graphs;
int currGraph, selectionThreshold;
float mutationRate = 0.1;

void setup() {
  size(600, 600);
  colorMode(HSB, 600);
  graphs = new Spirograph[20];
  for (int i = 0; i < graphs.length; i++) graphs[i] = new Spirograph();
  currGraph = 0;
  selectionThreshold = (int)(graphs.length*0.5);
}

void draw() {
  graphs[currGraph].display();
}

void applyGenetics()
{
  Spirograph[] newGraphs = new Spirograph[graphs.length];
  Spirograph[] sorted = sortPopulation(graphs);

  //selection
  for (int i = 0; i < selectionThreshold; i++)
  {
    int totalFitness = 0;
    for (int j = 0; j < sorted.length; j++) if (sorted[j] != null)totalFitness += sorted[j].fitness;
    int randomPoint = (totalFitness > 0) ? (int)random(totalFitness) : 0;
    int count = 0;

    for (int j = 0; j < sorted.length; j++)
    {
      if (sorted[j] != null)
      {
        count+=(int)sorted[j].fitness;
        if (count >=  randomPoint)
        {
          newGraphs[i] = new Spirograph(sorted[j].values);
          sorted[j] = null;
          break;
        }
      }
    }
  }

  //crossover
  for (int i = selectionThreshold; i < newGraphs.length; i++ ) {
    int indxA = (int)random(selectionThreshold);
    int indxB = (int)random(selectionThreshold);
    int[] newValues = new int[9];
    for (int j = 0; j < newValues.length; j++) newValues[j] = (random(1) < 0.5) ? newGraphs[indxA].values[j] : newGraphs[indxB].values[j];
    newGraphs[i] = new Spirograph(newValues) ;
  }
  //mutation
  for (int i = 0; i < newGraphs.length; i++ ) {
    if (random(1) < mutationRate) {
      for (int j = 0; j < newGraphs[i].values.length; j++ ) if (random(1) < mutationRate) newGraphs[i].values[j] = (int)random(0, 600);
    }
  }
  graphs = newGraphs;
}

public Spirograph[] sortPopulation(Spirograph[] population) {
  Spirograph[] sorted = new Spirograph[population.length];
  for (int i = 0; i < population.length; i++) {
    int bestIndex = -1;
    float bestFitness = -1.0f;
    for (int j = 0; j < population.length; j++) {
      if (population[j] != null && population[j].fitness > bestFitness) {
        bestFitness = population[j].fitness;
        bestIndex = j;
      }
    }
    sorted[i] = population[bestIndex];
    population[bestIndex] = null;
  }
  return sorted;
}

void keyPressed() {
  if (key >= 49 && key <= 57) {
    println("Graph "+currGraph+" given fitness of "+(key-48));
    graphs[currGraph].fitness = key-48;
    currGraph = (currGraph == graphs.length-1) ? 0 : currGraph+1;
    if (currGraph==0) {
      println("Population evaluated, applying genetics.");
      applyGenetics();
    }
  }
}

void mousePressed() {
  save("Image_" + graphs[currGraph].values[0] + "_" + 
    graphs[currGraph].values[1] + "_"+ 
    graphs[currGraph].values[2] + "_"+ 
    graphs[currGraph].values[3] + "_"+ 
    graphs[currGraph].values[4] + "_"+ 
    graphs[currGraph].values[5] + "_"+ 
    graphs[currGraph].values[6] + "_"+ 
    graphs[currGraph].values[7] + "_"+ 
    graphs[currGraph].values[8] + ".png");
  println("Graph saved.");
}