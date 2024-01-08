  
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
    FRAME_RATE = parseInt(d("frameRate").value); //--- 
    getTime();
    score = 0;
    count_n = 0;
    count_ge = 1;
    numberOfBreakedBlock = 0;
    recordIndividual = new Array(GENERATION);
    for(var i=0;i<GENERATION;i++){
      recordIndividual[i] = new Array(N);
    }
    if(individual.length!=N){
      individual = new Array(N);
      for(var n=0;n<N;n++){
        individual[n] = new Array(chrom);
        for(var c=0;c<chrom;c++){
          individual[n][c] = Math.floor(Math.random()*3) - 1;
        };
      };
      total_count_ge=1;
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