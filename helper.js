// helper関数

/* 初期化 */
function init(){
  /* 画面に表示されている数値の取得 */
  GENERATION = parseInt(d("generation").value); // 世代数
  N = parseInt(d("individual").value);          // 個体数
  chrom = parseInt(d("chrom").value);           // 遺伝子数
  FRAME_RATE = parseInt(d("frameRate").value);  // フレームレート
  getTime(); // 開始時刻を取得(保存する際のファイル名用)

  /* 値の初期化 */
  score = 0;    // スコア
  count_n = 0;  // 個体番号
  count_ge = 1; // 世代番号
  numberOfBreakedBlock = 0; // 壊した数
  numberOfFrames = 0;  // フレーム数（フレームレートが30の時に ÷33＝時間（秒））
  positionOfChrom = 0; // 実行する遺伝子番号

  /* 記録する配列の初期化(世代ごと) */
  recordIndividual = new Array(GENERATION); 
  for(var i=0;i<GENERATION;i++){
    recordIndividual[i] = new Array(N);
  }

  /* 新しい個体に対してランダムで最初の遺伝子を決める */
  if(individual.length != N){
    individual = new Array(N); // 個体を生成
    for(var n=0;n<N;n++){
      individual[n] = new Array(chrom); // 個体ごとの遺伝子配列を生成
      for(var c=0;c<chrom;c++){
        individual[n][c] = Math.floor(Math.random()*3) - 1; // 初期化(-1,0,1)
      };
    };
  }

}


function toByIndividual(){
  var tmp = new Array(N);
  for(var n =0;n<N;n++){
    tmp[n] = new Array(GENERATION);
  }
  for(var n=0;n<N;n++){
    for(var g=0;g<GENERATION;g++){
      tmp[n][g] = recordIndividual[g][n];
    }
  }
  return tmp;
}
function getSecond(){
  return numberOfFrames/(1000/33)
}

function getChrom(){
  var text = d("fixedChrom").value;
  return text.split('\t');
}