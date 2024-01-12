// エリート探索で淘汰しています。
function selection(child,individual,sorted_eval){
  // 淘汰  
  var rands = getRandoms(num_of_choiced,child.length);
  console.log(rands);
  // 削除する子を探す
  var min = new Array(num_of_choiced);
  for(var i=0;i<num_of_choiced;i++){
    min[i] = new Array(2);
    min[i][0] = sorted_eval[sorted_eval.length-(i+1)][0]
    min[i][1] = sorted_eval[sorted_eval.length-(i+1)][1]
  };
  // 淘汰
  for(var i=0;i<num_of_choiced;i++){
    for(var c=0;c<chrom;c++){
      individual[min[i][1]][c] = child[rands[i]][c]; 
    }
  };
}