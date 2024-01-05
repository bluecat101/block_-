function MGG_crossover(CHILDLEN,r1,r2,individual){
  //MGG選択
  
    //--- 交差位置の設定
    var rand1 = Math.floor(Math.random()*chrom);
    var rand2 = rand1 + Math.floor(Math.random()*(chrom-rand1));//0<=rand1<rand2<1000
    // var crossposition = Math.floor(Math.random()*3);
    //二点交叉
    
    var child = new Array(CHILDLEN);
    for(var n=0;n<CHILDLEN;n++){
      child[n] = new Array(chrom);
    };
    for(var c=0;c<chrom;c++){
      var parent=[individual[r1][c],individual[r2][c]];
      child[0][c] = parent[0];
      child[1][c] = parent[1];
      if(c<rand1){
        child[2][c] = parent[0];
        child[3][c] = parent[0];
        child[4][c] = parent[0];
        child[5][c] = parent[0];
        child[6][c] = parent[1];
        child[7][c] = parent[1];
        child[8][c] = parent[1];
        child[9][c] = parent[1];
      }else if(rand1<=c && c<rand2){
        child[2][c] = parent[0];
        child[3][c] = parent[0];
        child[4][c] = parent[1];
        child[5][c] = parent[1];
        child[6][c] = parent[0];
        child[7][c] = parent[0];
        child[8][c] = parent[1];
        child[9][c] = parent[1];             
      }else{
        child[2][c] = parent[0];
        child[3][c] = parent[1];
        child[4][c] = parent[0];
        child[5][c] = parent[1];
        child[6][c] = parent[0];
        child[7][c] = parent[1];
        child[8][c] = parent[0];
        child[9][c] = parent[1];
      };
    };
    return child;   
  
}

function MGG_choice(CHILDLEN,child_eval){
 //ルーレット選択で決定した個体番号の取得
  var total = 0;
  for(var n=0;n<CHILDLEN;n++){
    total += child_eval[n][0];
  };
  var arrow = Math.floor(Math.random()*total);
  var select = 0;
  for(var n=0,sum=0.0;n<CHILDLEN;n++){
    sum += child_eval[n][0];
    if(sum>arrow){
      select = n;
      break;
    };
  };
  return select;
}
function MGG_selection(top,select,r1,r2,child,individual){
// トーナメント方式の1番目とルーレット方式によって決める。
for(var c=0;c<chrom;c++){
  individual[r1][c] = child[top[1]][c];
  individual[r2][c] = child[select][c];
};
}