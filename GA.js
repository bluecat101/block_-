/* 描画しないで計算を行う */
function simulate(In){ 
  var isAllBreak = false; // 全てのブロックが破壊されているかどうか
  while (numberOfFrames<10000){
    p.x += p.vx; // ボールのx座標の更新
    p.y += p.vy; // ボールのy座標の更新
    // 10フレームごとに遺伝子番号を変える
    if(numberOfFrames % 10 == 0){
      if(positionOfChrom >= chrom){ // 遺伝子が短い場合
        console.error("遺伝子長が短すぎます");
        paused = true;
        return;
      }
      moveBar(In); // バーを動かす
      positionOfChrom++; // 遺伝子番号を更新
    }
    if (p.y>=280){
      for (var i=0,I=b.x.length,hit=false; i<I; i++){
        if ((p.y-b.y[i])*p.vy<0 && Math.abs(p.x-b.x[i])<=b.w && Math.abs(p.y-b.y[i])<=b.h+p.r){
          p.vy *= -1; hit = true; break;}
        else if ((p.x-b.x[i])*p.vx<0 && Math.abs(p.y-b.y[i])<=b.h && Math.abs(p.x-b.x[i])<=b.w+p.r){
          p.vx *= -1; hit = true; break;}
      }
      // ブロックが壊されたなら
      if (hit){
        score += 10;                      // スコアの更新
        numberOfBreakedBlock += 1;        // 破壊されたブロックの更新
        b.x.splice(i,1); b.y.splice(i,1); 
        if (b.x.length==0) { // 全てのブロックが壊された時
          console.error("すべてのブロックが破壊されました。");
          score+= 10000/(getSecond());
          isAllBreak = true;
          break;
        }
      }
    }
    /* 壁にぶつかったなら */
    if (p.x>w-p.r){ p.x = w-p.r; p.vx *= -1;} // 右の壁
    if (p.x<p.r){p.x = p.r; p.vx *= -1;}      // 左の壁
    if (p.y>h-p.r){ p.y = h-p.r; p.vy *= -1;} // 上の壁
    if (p.y<p.r+bar.y){ // barにあたっている
      var p_bar = Math.abs(p.x-bar.x); // バーとボールの位置の取得
      score+=scoreByPosition(p_bar);   // バーとボールの位置によってスコアを決める
      // バーに触れているなら
      if (p_bar<=bar.L){
        var X = (p.x>bar.x) ? 1 : -1;     //衝突点のバーの法線ベクトル(X,1);
        /* バーのどこに触れたか */
        if (p_bar<=bar.L-bar.edge) X = 0; //バーの中央
        else if (p_bar<=bar.L-bar.edge/3) X *= (p_bar-bar.L+bar.edge)/100; //0～0.3（バーの端は約73°）
        else X *= 0.3; // バーの中央と端以外
        var L = Math.sqrt(X*X+1);   // 法線ベクトルの長さ
        var vec = {x: X/L, y: 1/L}; // 法線ベクトルの正規化
        
        /* ボールの速度の更新 */
        var dot = vec.x*p.vx+vec.y*p.vy;
        p.y = p.r+bar.y;
        p.vx -= 2*dot*vec.x;
        p.vy -= 2*dot*vec.y;
        if (Math.abs(p.vx)/p.vy>1.5){ //角度が付き過ぎないよう調整
          var v2 = p.vx*p.vx+p.vy*p.vy;
          p.vy = Math.sqrt(v2/3.25);
          p.vx = (p.vx<0) ? -p.vy*1.5 : p.vy*1.5;
        }
      }else if (p.y<p.r){ // ゲームオーバー
        break;      
      };
    };
    numberOfFrames++;
  };
  score = Math.floor(100*score)/100 // スコアの更新
  tmp = [score,positionOfChrom];
  /* 記録 */
  tmp.push(isAllBreak?getSecond():-1); 
  for(var c =0;c<chrom;c++){ // 遺伝子を保持する
    tmp.push(individual[count_n-1][c]);
  }
  recordIndividual[count_ge-1][count_n-1] =tmp;
};

/* 計算用のループ */
function loopForEvolve(){
  for(var ge=0;ge<GENERATION;ge++){ // 世代の更新
    if (ge == GENERATION-1){ // 最後の世代なら
      var sortedEval = sortEvaluation(individual); // 各個体を評価してソートする
      saveByGeneration(sortedEval,recordIndividual[count_ge-1]); // 個体を保存する
      best = [sortedEval[0][0],sortedEval[0][1]]; // 最大スコアの個体を取得する
      console.log("best : ", best[0], best[1],recordIndividual[recordIndividual.length - 1][best[1]][2]); // スコア、個体番号、秒数を出力する
      console.warn("finish_calculate"); // 計算の終了
      count_n = best[1]; // 個体番号を最大スコアのものにする
      count_ge = GENERATION; // 表示する世代の更新
      break;
    };
    evolve(); // 進化
    count_n=0; // 個体番号を初期化
    count_ge++; // 世代の更新
  };  
}

/* 進化 */
function evolve(){
  /* 親の生成 */
  var parent = new Array(2);
  for(var i=0;i<2;i++){
    parent[i] = new Array(chrom);
  };

  /* 子供の生成 */
  var child = new Array(NUM_OF_CHILD);
  for(var n=0;n<NUM_OF_CHILD;n++){
      child[n] = new Array(chrom);
  };

  //選択と交叉
  if(CHOICE_TYPE == "MGG-rulet"){
    var sortedEval = sortEvaluation(individual); // 評価する
    if(crossrate>Math.random()){
      var r1 = Math.floor(Math.random()*N); //--- ランダムで親を選ぶ
      var r2 = Math.floor(Math.random()*N); //--- ランダムで親を選ぶ
      for(var c=0; c < chrom;c++){
        parent[0][c] = individual[r1][c];
        parent[1][c] = individual[r2][c];
      }
      double_crossover(child,parent); // 交叉
      var sortedChildEval = sortEvaluation(child,true); // 子供の評価
      var select = rulet1(sortedChildEval); // 子供を選択
      // 淘汰
      for(var c=0;c<chrom;c++){
        individual[r1][c] = child[sortedChildEval[0][1]][c]; // ルーレットによって選ばれたもの
        individual[r2][c] = child[select][c]; // エリートによって選ばれたもの
      };
    };
  }else if(CHOICE_TYPE == "elite" || CHOICE_TYPE == "rulet"){
    var sortedEval = sortEvaluation(individual); // 評価
    /* 子供の生成 */
    var child = new Array(NUM_OF_CHILD);
    for(var n=0;n<NUM_OF_CHILD;n++){
        child[n] = new Array(chrom);
    };
    
    // 選択-交叉
    if(crossrate>Math.random()){
      // 選択
      if(CHOICE_TYPE == "elite" ){elite(parent,individual,sortedEval);}
      else if(CHOICE_TYPE == "rulet"){rulet2(parent,sortedEval,individual);}
      // 交叉
      if(CROSSOVER_TYPE == "single"){single_crossover(child,parent)}
      else if(CROSSOVER_TYPE == "double"){double_crossover(child,parent)}
    }
    // 淘汰
    selection(child,individual,sortedEval); 
  }

  /* 突然変異 */
  // 10世代連続でスコアが一緒かどうかを判断する
  var isSameScore =false;
  if(record.length > 10){ // 10世代以上あるか
    isSameScore = true;
    for(var i=1;i<10;i++){
      if(record[record.length-1][1] != record[record.length-1-i][1]){
        isSameScore = false;
        break;
      }
    }
  }
  // 個体ごとに繰り返す
  for(var n=0;n<N;n++){
    if(isSameScore){ // 10世代連続でスコアが同じ
      mutantrate = 50; // 突然変異率の更新
      if(Math.random() < mutantrate/100){
        if(Math.random() < 0.5){ // 処理された遺伝子の終端らへん(±10)全てを突然変異
          /* 実際の突然変異確率は0.5*0.5*2/3= 16%(突然変異をしても同じ遺伝子になる可能性もあるため) */
          for(var i=0;i<20;i++){
            var position = recordIndividual[count_ge-1][n][1]-10+i;
            individual[n][position] = Math.floor(Math.random()*3) - 1; // 遺伝子を-1~1にする
          }
        }else{ // 全ての遺伝子からランダムに位置を決める
          // 突然変異する個数を決める
          var num_of_mutation = Math.floor(Math.random()*20); 
          // 突然変異する位置を取得
          var rands = getRandoms(num_of_mutation,recordIndividual[count_ge-1][n][1])
          // 突然変異
          for(var i=0;i<num_of_mutation;i++){
            individual[n][rands[i]] = Math.floor(Math.random()*3) - 1; // 遺伝子を-1~1にする
          }
        }
      }
    }else if(Math.random()<mutantrate/100){ // 10世代連続でスコアが同じでないなら
      var position = Math.floor(Math.random()*recordIndividual[count_ge-1][n][1]); // 突然変異する位置を決める
      var r3 = Math.floor(Math.random()*2) +1;                                     // 遺伝子をどう変化させるかを決める 1 or 2
      individual[n][position] = (individual[n][position]+r3)%3 != 2? (individual[n][position]+r3)%3 : -1; // 必ず違う遺伝子になる
    };
  };
  saveByGeneration(sortedEval,recordIndividual[count_ge-1]); // 記録する
}

// スコアを評価する
function evaluation(In,isChild=false){
  if(!isChild)count_n++; // 親を評価する時に個体番号を追加する
  reset();      // リセット
  simulate(In); // 個体がゲームをする
  return score; // スコアを返す
};

// 描画する際に次の個体に進む(1つずつ描画する場合)
function next_individual(){
  if(count_ge == GENERATION && count_n == N-1){ // 全ての進化が終了したなら
    isFinish = true;
    var sortedEval = sortEvaluation(individual); // 評価
    saveByGeneration(sortedEval,recordIndividual[count_ge-1]); // 記録する
    best = [sortedEval[0][0],sortedEval[0][1]]; // 最大スコアの設定
    count_ge = GENERATION; // 表示する世代の設定
    console.log(best); // 最大スコアの表示
    count_n = best[1]; // 表示する個体番号の設定
    return;
  }
  // スコアを記録
  tmp = [score,positionOfChrom];
  recordIndividual[count_n] = tmp;
  count_n++;
  if(count_n == N){ // 最後の個体なら
    evolve(); // 進化
    count_ge++;
    count_n = 0; // 初期化
  } 
}


// 個体を評価して評価値をソートして返す
function sortEvaluation(evaluatedArray,isChild = false){
  len = evaluatedArray.length; // 配列の長さを取得
  var eval = new Array(len);
  for(var i=0;i<len;i++){
    eval[i] = evaluation(evaluatedArray[i],isChild); // 個体を評価する
  }
  var sortedEval = selfSort(eval); // ソート
  return sortedEval;
}

function scoreByPosition(p_bar){ // バーとボールの位置によって評価する
  if(p_bar<=bar.L){return 1;} // ボールがバーに当たったなら
  else {return ((0.5-(Math.floor((p_bar-bar.L)/30)+1)/10)*100)/100} // 位置によって評価値を指定
}

/* indexを保持したままソートする関数 */
function selfSort(array){
  var len = array.length;
  var sortArray = new Array(len);
  for(var i=0;i<len;i++){ 
    sortArray[i] = [array[i],i]; // arrayの値、インデックス番号の順にして作成
  }
  return sortArray.sort(function(a,b){return(b[0]-a[0]);}); // ソートして降順で返す
}