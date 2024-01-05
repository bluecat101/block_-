function simulate(In){ //--- 全ての個体に対して実行される
var isAllBreak = false;
//--- 全ての遺伝子に対して実行
  while (numberOfFrames<10000){ 
    p.x += p.vx;
    p.y += p.vy;
    if(numberOfFrames % 10 == 0){
      if(positionOfChrom >= chrom){
        console.error("遺伝子長が短すぎます");
        paused = true;
        // exit();
        return;
      }
      moveBar(In);
      positionOfChrom++;
    }
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
        b.x.splice(i,1); b.y.splice(i,1);
        if (b.x.length==0) {
          console.error("すべてのブロックが破壊されました。");
          score+= 10000/(getSecond());
          isAllBreak = true;
          break;
        }

      }
    }
    if (p.x>w-p.r){ p.x = w-p.r; p.vx *= -1;} //right
    if (p.x<p.r){   p.x = p.r; p.vx *= -1;} //left
    if (p.y>h-p.r){ p.y = h-p.r; p.vy *= -1;} //up
    if (p.y<p.r+bar.y){
      //--- barにあたっている
      var p_bar = Math.abs(p.x-bar.x);
      score+=scoreByPosition(p_bar);

      // if(p_bar<=bar.L){score += 1;}
      // else if(p_bar<bar.L+100){score += 0.5;}
      // else if(p_bar<240){score += 0.2;}
      if (p_bar<=bar.L){
        var X = (p.x>bar.x) ? 1 : -1; //衝突点のバーの法線ベクトル(X,1);
        if (p_bar<=bar.L-bar.edge) X = 0; //バーの中央
        else if (p_bar<=bar.L-bar.edge/3) X *= (p_bar-bar.L+bar.edge)/100; //0～0.3（バーの端は約73°）
        else X *= 0.3;
        // var distance = Math.abs(p.x-bar.x);
        // numberOfBreakedBlock +=1;
        // score += 1;
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
  score = Math.floor(100*score)/100
  tmp = [score,positionOfChrom];
  tmp.push(isAllBreak?getSecond():-1);
  // console.log(individual);
  // console.log(count_n-1);
  // console.log(individual[count_n-1]);
  for(var c =0;c<chrom;c++){
    tmp.push(individual[count_n-1][c]);
  }
  recordIndividual[count_ge-1][count_n-1] =tmp;
};



function loopForEvolve(){
  for(var ge=0;ge<GENERATION;ge++){
    // console.log("GENETATION["+ge+"]");
    if (ge == GENERATION-1){
      var sortedEval = sortEvaluation(individual);
      // // //--- 最大値の取得
      // tmp_best = getBestIn(individual);
      saveByGeneration(sortedEval,recordIndividual[count_ge-1]);
      best = [sortedEval[0][0],sortedEval[0][1]];
      console.log("best : ", best[0], best[1],recordIndividual[recordIndividual.length - 1][best[1]][2]); //--- 評価値と何番目の個体か
      if(CHOICE_TYPE == "MGG-rulet"){
        if(best[0]>250){ //--- 目標値に達成しているかどうか
          console.log("break");
          console.log(record.slice(-1));
          console.log(record);
          count_n = best[1];
          count_ge = total_count_ge;
          // saveCSV(record);
          break;
        }else{
          console.log("not break");
          ge = 0;
          count_n=0;
          count_ge=1;
          total_count_ge++;
        };
      }else{
        // console.log(record.slice(-1));
        // console.log(record);
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
    total_count_ge++;
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
      var sortedChildEval = sortEvaluation(child,true);
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
    // console.log(parent[0])
    // console.log(parent[1])
    //--- 交叉
    // console.log("crossover");
    if(CROSSOVER_TYPE == "single"){single_crossover(child,parent)}
    else if(CROSSOVER_TYPE == "double"){double_crossover(child,parent)}
    // console.log("selection");
    selection(child,individual,sortedEval);
  }

  //突然変異
  // console.log("mutation");
  var mutantrate = 0.01;
  isSameScore =true;
  // for(var i =)
  // console.log(record);
  // 10世代連続でscoreが一緒なら
  if(record.length > 10){
    // console.log(record.length-1,record[record.length-1])
    for(var i=1;i<10;i++){
      if(record[record.length-1][1] != record[record.length-1-i][1]){
        isSameScore = false;
        break;
      }
    }
  }
  // console.log(recordIndividual[count_ge-1]);
  for(var n=0;n<N;n++){
    if(isSameScore){
      mutantrate = 0.5;
      if(Math.random()<mutantrate){
      if(Math.random()<0.8){
        for(var i=0;i<20;i++){
          var position = recordIndividual[count_ge-1][n][1]-10+i;
          var r3 = Math.floor(Math.random()*2) +1; //--- 1 or 2
          individual[n][position] = Math.floor(Math.random()*3) - 1;
        }
      }else{
        var m = Math.floor(Math.random()*recordIndividual[count_ge-1][n][1]);
        var r3 = Math.floor(Math.random()*2) +1; //--- 1 or 2
        individual[n][m] = (individual[n][m]+r3)%3 != 2? (individual[n][m]+r3)%3 : -1;
      }
        // var m = Math.floor(Math.random()*20)+recordIndividual[count_ge-1][n][1]-10;
        // var r3 = Math.floor(Math.random()*2) +1; //--- 1 or 2
        // individual[n][m] = (individual[n][m]+r3)%3 != 2? (individual[n][m]+r3)%3 : -1;
      }
    }else if(Math.random()<mutantrate){
      var m = Math.floor(Math.random()*recordIndividual[count_ge-1][n][1]);
      var r3 = Math.floor(Math.random()*2) +1; //--- 1 or 2
      individual[n][m] = (individual[n][m]+r3)%3 != 2? (individual[n][m]+r3)%3 : -1;
    };
  };
  saveByGeneration(sortedEval,recordIndividual[count_ge-1]);
}

//誤差関数evaluation(個体[個体番号]) = ゲームスコア
function evaluation(In,isChild=false){
  score = 0;
  numberOfBreakedBlock = 0;
  if(!isChild)count_n++;
  reset();
  simulate(In); //個体がゲームをする
  return score; //ブロック崩しのスコアを与える
};

// 描画する際に次の個体に進む
function next_individual(){
  if(count_ge == GENERATION && count_n == N-1){
    isFinish = true;
    var sortedEval = sortEvaluation(individual);
    saveTmp(sortedEval);
    best = [sortedEval[0][0],sortedEval[0][1]];
    count_ge = GENERATION;
    console.log(best);
    count_n = best[1];
    return;
  }
  tmp = [score,positionOfChrom];
  recordIndividual[count_n] = tmp;
  count_n++;
  if(count_n == N){
    evolve();
    count_ge++;
    total_count_ge++;
    //--- 初期化
    count_n = 0;
    console.log(recordIndividual);
  } 
}


function sortEvaluation(evaluatedArray,isChild = false){
  len = evaluatedArray.length;
  //--- 最大値の取得
  var eval = new Array(len);
  //---　各個体の評価値を取得
  for(var i=0;i<len;i++){
    eval[i] = evaluation(evaluatedArray[i],isChild);
  }
  var sortedEval = selfSort(eval);
  return sortedEval;
}

function scoreByPosition(p_bar){
  if(p_bar<=bar.L){return 1;}
  else {return (0.5-(Math.floor((p_bar-bar.L)/30)+1)/10)}
}