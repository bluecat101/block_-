var time;
function saveCSV(record){
  // return; 
  var row = record.length;
  if(row == 0){return;}
  var column = record[0].length;
  if(column != 5){return;}
  var heading =["max","min","average","maxChrom"];
  fullText = "RECORD";
  for(var i =0;i<heading.length;i++){
    if(i!=heading.length-1){
      fullText+=","+heading[i];
    }else{
      fullText+=","+heading[i]+'\n';
    }
  }
  // console.log(fullText);
  for(var i =0;i<row;i++){
    for(var j =0;j<column;j++){
      if(j!=column-1){
        fullText+=record[i][j]+',';
      }else{
        fullText+=record[i][j]+'\n';
      }
      
    } 
  }
  var fileName = time+"_"+N+"_"+chrom+"_"+GENERATION+".csv";
  var blob =new Blob([fullText],{type:"text/csv"}); //配列に上記の文字列(str)を設定
  var link =document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  // console.log("finish_save");
}

function saveByGeneration(sortedEval,recordIndevidual){
  maxIndevidualFrame = recordIndevidual[sortedEval[0][1]][1];
  total =0;
  for(var n=0;n<N;n++){
    total += sortedEval[n][0];
  }
  var average = total/N;
  //　世代,最大値,最小値,平均値,最大値の使用した遺伝子長
  tmpArray = [count_ge,sortedEval[0][0],sortedEval[sortedEval.length-1][0],average,maxIndevidualFrame];
  record.push(tmpArray);
}



function getTime(){
  var now = new Date();
  var Year = now.getFullYear();
  var Month = ( '00' + (now.getMonth()+1) ).slice( -2 );
  var Day   = ( '00' + (now.getDate()) ).slice( -2 );
  var Hour  = ( '00' + (now.getHours()) ).slice( -2 );
  var Min   = ( '00' + (now.getMinutes()) ).slice( -2 );
  var Sec   = ( '00' + (now.getSeconds()) ).slice( -2 );
  time = String(Year)+String(Month)+String(Day)+"_"+String(Hour)+String(Min)+String(Sec);
}