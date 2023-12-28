function selection(child,individual,sorted_eval){
  //--- 淘汰  
  var min = new Array(NUM_OF_CHILD);
  for(var i=0;i<NUM_OF_CHILD;i++){
    min[i] = new Array(2);
    min[i][0] = sorted_eval[sorted_eval.length-(i+1)][0]
    min[i][1] = sorted_eval[sorted_eval.length-(i+1)][1]
  };
  
  for(var c=0;c<chrom;c++){
    for(var i=0;i<NUM_OF_CHILD;i++){
      individual[min[i][1]][c] = child[i][c]; 
    }
  };
}