function selection(child,individual,sorted_eval){
  //--- 淘汰  
  var min = new Array(2);
  for(var i=0;i<2;i++){
    min[i] = new Array(2);
  };
  min[0][0] = sorted_eval[sorted_eval.length-1][0]
  min[0][1] = sorted_eval[sorted_eval.length-1][1]
  min[1][0] = sorted_eval[sorted_eval.length-2][0]
  min[1][1] = sorted_eval[sorted_eval.length-2][1]
  for(var c=0;c<chrom;c++){
    individual[min[0][1]][c] = child[0][c]; 
    individual[min[1][1]][c] = child[1][c];
  };
}