/* 単一交叉 */
function single_crossover(child,parent){
  var rand = getRandoms(NUM_OF_CHILD/2); // 子の数の半分の交叉位置の乱数を用意する
  for(var c=0;c<chrom;c++){
    for(var i=0;i<NUM_OF_CHILD/2;i++){
      /* 交叉 */
      if(c<rand[i]){
        child[i][c] = parent[0][c];
        child[NUM_OF_CHILD-1-i][c] = parent[1][c];
      }else{
        child[i][c] = parent[1][c];
        child[NUM_OF_CHILD-1-i][c] = parent[0][c];
      }  
    }
  }
}
 
/* 複数交叉 */
function double_crossover(child,parent){
  var rand_len = Math.log(NUM_OF_CHILD) / Math.log(2)-1; // 必要な交叉位置を取得
  var rand = getRandoms(rand_len); // 交叉位置用の乱数生成
  var rand_position =0; // 現在どの交叉位置を使用するのか
  var choiced_parent =0; // どの子に受け継ぐのか
  var count=0;
  for(var c=0;c<chrom;c++){ // 全ての遺伝子に対して処理
    if(c>=rand[rand_position]){ // 遺伝子が交差位置を超えたなら
      rand_position++; // 交叉位置を更新
    }
    for(var i=0;i<NUM_OF_CHILD;i++){ //子の数だけ繰り返す
      child[i][c] = parent[choiced_parent][c]; // 親の情報を受け継ぐ
      count++;
      if(count >= 2**(rand_len-1-rand_position)){ // 親がある一定(1/2,1/4,1/8...)の子に引き継いだなら
        count=0;
        choiced_parent = choiced_parent ^ 1; // どの親を受け継ぐのかの更新
      }
    }
  }
  child.shift(); // 子の先頭は親と全く同じなので除去
  child.pop();   // 子の最後は親と全く同じなので除去
}
/* 引数の長さの重複しない乱数を生成する */
function getRandoms(length){
  var rand = new Array(length);
  for(var i=0;i<length;i++){
    while(true){
      tmp = Math.floor(Math.random()*chrom); // 乱数生成
      if(!rand.includes(tmp)){ // 新しい乱数なら
        rand[i] = tmp;
        break;
      }
    }
  }
  return rand.sort(); // 乱数を昇順にソートして返す
}

