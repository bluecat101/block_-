function simulate(In){ //--- 全ての個体に対して実行される
//--- 全ての遺伝子に対して実行
  while (numberOfFrames<10000){ 
    p.x += p.vx;
    p.y += p.vy;
    moveBar(In);
    if (p.y>=280){
      for (var i=0,I=b.x.length,hit=false; i<I; i++){
        if ((p.y-b.y[i])*p.vy<0 && Math.abs(p.x-b.x[i])<=b.w && Math.abs(p.y-b.y[i])<=b.h+p.r){
          p.vy *= -1; hit = true; break;}
        else if ((p.x-b.x[i])*p.vx<0 && Math.abs(p.y-b.y[i])<=b.h && Math.abs(p.x-b.x[i])<=b.w+p.r){
          p.vx *= -1; hit = true; break;}
      }
      if (hit){
        score += 10;
        numberOfBreakedBlock +=1;
        // reward += 10;
        b.x.splice(i,1); b.y.splice(i,1);
        if (b.x.length==0) break;
      }
    }
    if (p.x>w-p.r){ p.x = w-p.r; p.vx *= -1;} //right
    if (p.x<p.r){   p.x = p.r; p.vx *= -1;} //left
    if (p.y>h-p.r){ p.y = h-p.r; p.vy *= -1;} //up
    if (p.y<p.r+bar.y){
      //--- barにあたっている
      var p_bar = Math.abs(p.x-bar.x);
      if (p_bar<=bar.L){
        var X = (p.x>bar.x) ? 1 : -1; //衝突点のバーの法線ベクトル(X,1);
        if (p_bar<=bar.L-bar.edge) X = 0; //バーの中央
        else if (p_bar<=bar.L-bar.edge/3) X *= (p_bar-bar.L+bar.edge)/100; //0～0.3（バーの端は約73°）
        else X *= 0.3;
        // var distance = Math.abs(p.x-bar.x);
        // numberOfBreakedBlock +=1;
        score += 1;
        var L = Math.sqrt(X*X+1); //法線ベクトルの長さ
        var vec = {x: X/L, y: 1/L}; //法線ベクトルの正規化
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
  tmp = [score,numberOfFrames];
  recordIndevidual[count_n] = tmp;
};



function loopForEvolve(){
  for(var ge=0;ge<GENERATION;ge++){
    // console.log("GENETATION["+ge+"]");
    if (ge == GENERATION-1){
      var sortedEval = sortEvaluation(individual);
      // // //--- 最大値の取得
      // tmp_best = getBestIn(individual);
      saveTmp(sortedEval);
      best = [sortedEval[0][0],sortedEval[0][1]];
      console.log("best : ", best[0], best[1]); //--- 評価値と何番目の個体か
      if(CHOICE_TYPE == "MGG-rulet"){    
        if(best[0]>100){ //--- 目標値に達成しているかどうか
          console.log("break");
          console.log(record.slice(-1));
          console.log(recordIndevidual);
          count_n = best[1];
          count_ge = GENERATION;
          // saveCSV(record);
          break;
        }else{
          console.log("not break");
          ge = 0;
          count_n=0;
          count_ge=1;
        };
      }else{
        console.log(record.slice(-1));
        console.log(recordIndevidual);
        console.log("finish_calculate");
        // isFinish = true;
        count_n = best[1];
        count_ge = GENERATION;
        // saveCSV(record);
        break;
      }
    };
    evolve();
    count_n=0;
    count_ge++;
  };  
}

function evolve(){
  var parent = new Array(2);
  if(CHOICE_TYPE != "MGG-rulet"){    
    for(var i=0;i<2;i++){
      parent[i] = new Array(chrom);
    };
  }
  //選択と交叉
  if(CHOICE_TYPE == "MGG-rulet"){
    var sortedEval = sortEvaluation(individual);
    const crossrate = 0.8;
    if(crossrate>Math.random()){
      //親選択
      var r1 = Math.floor(Math.random()*N); //--- ランダムで親を選ぶ
      var r2 = Math.floor(Math.random()*N); //--- ランダムで親を選ぶ
      const CHILDLEN = 10;//2+2^3
      var child = MGG_crossover(CHILDLEN,r1,r2,individual);
      var sortedChildEval = sortEvaluation(child);
      var select = MGG_choice(CHILDLEN,sortedChildEval);
      var top = [sortedChildEval[0][0],sortedChildEval[0][1]];
      MGG_selection(top,select,r1,r2,child,individual);
    };
  }else if(CHOICE_TYPE == "elite" || CHOICE_TYPE == "rulet"){
    //---　評価
    //--- 最大値の取得
    var sortedEval = sortEvaluation(individual);
    var child = new Array(NUM_OF_CHILD);
    for(var n=0;n<NUM_OF_CHILD;n++){
        child[n] = new Array(chrom);
    };
    
    //--- 選択
    // console.log("choice");
    if(CHOICE_TYPE == "elite" ){elite(parent,individual,sortedEval);}
    else if(CHOICE_TYPE == "rulet"){rulet(parent,eval,individual);}
    //--- 交叉
    // console.log("crossover");
    if(CROSSOVER_TYPE == "single"){single_crossover(child,parent)}
    else if(CROSSOVER_TYPE == "double"){double_crossover(child,parent)}
    // console.log("selection");
    selection(child,individual,sortedEval);
  }

  //突然変異
  // console.log("mutation");
  const mutantrate = 0.01;
  for(var n=0;n<N;n++){
    if(Math.random()<mutantrate){
      var m = Math.floor(Math.random()*numberOfFrames);
      var r3 = Math.floor(Math.random()*2); //--- 0 or 1
      individual[n][m] = (individual[n][m]-r3)%3 - 1; //--- -1-> 0 or 1, 0-> -1 or 1, 1-> -1 or 0
    };
  };
  saveTmp(sortedEval);
}

//誤差関数evaluation(個体[個体番号]) = ゲームスコア
function evaluation(In){
  score = 0;
  numberOfBreakedBlock = 0;
  count_n++;
  reset();
  simulate(In);//個体がゲームをする
  return score//ブロック崩しのスコアを与える
};

function sortEvaluation(evaluatedArray){
  len = evaluatedArray.length;
  //--- 最大値の取得
  var eval = new Array(len);
  //---　各個体の評価値を取得
  for(var i=0;i<len;i++){
    eval[i] = evaluation(evaluatedArray[i]);
  }
  var sortedEval = selfSort(eval);
  return sortedEval;
}

function saveTmp(sortedEval){
  total =0;
  for(var n=0;n<N;n++){
    total += sortedEval[n][0];
  }
  var average = total/N;
  tmpArray = [count_ge,sortedEval[0][0],sortedEval[sortedEval.length-1][0],average];
  record.push(tmpArray);
}

