function selection(child,individual,sorted_eval){
  var child_len = child.length;
  console.log(child_len); // double_crossoverの際に親と同じコピーが存在し、削除しているため個数がNUM_OF_CHILDと異なる。
  //--- 淘汰  
  var min = new Array(child_len);
  for(var i=0;i<child_len;i++){
    min[i] = new Array(2);
    min[i][0] = sorted_eval[sorted_eval.length-(i+1)][0]
    min[i][1] = sorted_eval[sorted_eval.length-(i+1)][1]
  };
  
  for(var c=0;c<chrom;c++){
    for(var i=0;i<child_len;i++){
      individual[min[i][1]][c] = child[i][c]; 
    }
  };
}