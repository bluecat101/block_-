/* 記録を保存する関数 */
var time; // ファイル名に用いる(実行時と保存するときに使用するためこの位置にある)

/* CSVファイルに保存する */
function saveCSV(record){
  /* カラム */
  var heading =["max","min","average","maxChrom","finishSecond","chrom"];

  /* 受け取ったrecordが正しいかどうか */
  var row = record.length;
  if(row == 0){ // 行の確認
    console.error("保存に失敗しました。保存するデータがありません。");
    return;
  }
  var column = record[0].length;
  if(column != heading.length+1){ // 列の確認
    console.error("保存に失敗しました。保存するカラム数が異なります。。");
    return;
  }
  
  /* カラムを挿入する */
  fullText = "RECORD";
  for(var i =0;i<heading.length;i++){
    if(i!=heading.length-1){
      fullText+=","+heading[i];
    }else{
      fullText+=","+heading[i]+'\n'; // 最後だけ改行
    }
  }

  /* データを挿入する */
  for(var i =0;i<row;i++){
    for(var j =0;j<column;j++){
      if(j!=column-1){
        fullText+=record[i][j]+',';
      }else{
        fullText+=record[i][j]+'\n'; // 最後だけ改行
      }  
    } 
  }
  
  /* 保存 */
  var fileName = time+"_"+N+"_"+chrom+"_"+count_ge+".csv"; //ファイル名
  var blob =new Blob([fullText],{type:"text/csv"});
  var link =document.createElement('a'); // ダウンロード用のリンク生成(aタグ)
  link.href = URL.createObjectURL(blob); // ダウンロード用のリンク生成(リンク)
  link.download = fileName;              // ダウンロード用のリンク生成(ファイル名)
  link.click(); // ダウンロード
}

/* 世代ごとの記録を配列に入れておく */
function saveByGeneration(sortedEval,recordIndividual){
  /* 必要なデータを引数から取得 */
  var maxIndevidualChrom = recordIndividual[sortedEval[0][1]][1]; // 最大スコアの遺伝子の長さ
  var maxSecond = recordIndividual[sortedEval[0][1]][2]; // 最大スコアの終了時間

  /* スコアの平均値 */
  sum =0;
  for(var n=0;n<N;n++){
    sum += sortedEval[n][0];
  }
  var average = sum/N; // 平均値

  /* 1つの世代をrecordに記録する */
  //　世代,最大値,最小値,平均値,最大値の使用した遺伝子長,秒数
  tmpArray = [count_ge,sortedEval[0][0],sortedEval[sortedEval.length-1][0],average,maxIndevidualChrom,maxSecond];
  tmpArray.push(recordIndividual[sortedEval[0][1]].slice(3)) // 最大スコアの遺伝子を記録する
  record.push(tmpArray);
}


/* 実行が押された時の時間を取得 */
function getTime(){
  /* 時間の取得 */
  var now = new Date();                                  // 現在の時間を取得
  var Year = now.getFullYear();                          // 年の取得
  var Month = ( '00' + (now.getMonth()+1) ).slice( -2 ); // 月の取得
  var Day   = ( '00' + (now.getDate()) ).slice( -2 );    // 日の取得
  var Hour  = ( '00' + (now.getHours()) ).slice( -2 );   // 時の取得
  var Min   = ( '00' + (now.getMinutes()) ).slice( -2 ); // 分の取得
  var Sec   = ( '00' + (now.getSeconds()) ).slice( -2 ); // 秒の取得
  /* timeに記録しておく。 */
  time = String(Year)+String(Month)+String(Day)+"_"+String(Hour)+String(Min)+String(Sec); 
}