  
  // helper関数

  function selfSort(array){
    var len = array.length;
    var sortArray = new Array(len);
    for(var i=0;i<len;i++){
      sortArray[i] = [array[i],i];
    }
    return sortArray.sort(function(a,b){return(b[0]-a[0]);});			
  }



  function init(){
    GENERATION = parseInt(d("generation").value); //--- 世代数
    N = parseInt(d("individual").value); //--- 
    chrom = parseInt(d("chrom").value); //--- 
    getTime();
    count_n = 0;
    count_ge = 1;
    numberOfBreakedBlock = 0;
    recordIndevidual = new Array(GENERATION);
    for(var i=0;i<GENERATION;i++){
      recordIndevidual[i] = new Array(N);
      // console.log(recordIndevidual[0]);
    }
    // recordIndevidual[0][0] = "test";
    // console.log(recordIndevidual[0][0]);

  }

  function initWithChrom(){
    //初期の遺伝子決定(ランダム)
    for(var n=0;n<N;n++){
      individual[n] = new Array(chrom);
      for(var c=0;c<chrom;c++){
          individual[n][c] = Math.floor(Math.random()*3) - 1;
      };
    };
    init();
  }