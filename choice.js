/* エリート選択 */
function elite(parent,individual,sorted_eval){
  var max = new Array(2);
  for(var i=0;i<2;i++){
    max[i] = new Array(2);
  };
  /* 最大値(1番目、2番目)取得 */
  max[0][0] = sorted_eval[0][0]
  max[0][1] = sorted_eval[0][1]
  max[1][0] = sorted_eval[1][0]
  max[1][1] = sorted_eval[1][1]
  for(var c=0;c<chrom;c++){
    parent[0][c] = individual[max[0][1]][c]; // 親1に遺伝子を格納
    parent[1][c] = individual[max[1][1]][c]; // 親2に遺伝子を格納
  }
}

// ルーレット選択(1つを選択する)
function rulet1(child_eval){
  /* 合計値の計算 */ 
  var total = 0;
  for(var n=0;n<NUM_OF_CHILD-2;n++){
    total += child_eval[n][0];
  };
  var arrow1 = Math.floor(Math.random()*total); // 親1の位置を選択
  for(var n=0,sum=0.0;n<N;n++){
      sum += child_eval[n][0];
      if(sum > arrow1){return n;} // 見つかったなら
  };
}

// ルーレット選択(2つを選択する)
function rulet2(parent,eval,individual){
  /* 合計値の計算 */ 
  var total = 0;
  for(var n=0;n<N;n++){
    total += eval[n][0];
  };
  var arrow1 = Math.floor(Math.random()*total); // 親1の位置を選択
  var arrow2 = Math.floor(Math.random()*total); // 親2の位置を選択
  var select1 = 0, select2 = 0;
  for(var n=0,sum=0.0;n<N;n++){
      sum += eval[n][0];
      if(select1 == 0 && sum>arrow1){select1 = n;}
      if(select2 == 0 && sum>arrow2){select2 = n;}
      if(select1!=0 && select2!=0){break;} // どちらの親も見つかったなら
  };
  for(var c=0;c<chrom;c++){
      parent[0][c] = individual[select1][c]; // 親1に遺伝子を格納
      parent[1][c] = individual[select2][c]; // 親2に遺伝子を格納
  }
}

