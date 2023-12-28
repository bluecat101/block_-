function single_crossover(child,parent){
  //--- 単一交叉
    var rand1 = Math.floor(Math.random()*chrom);
    for(var c=0;c<chrom;c++){
        if(c<rand1){
            child[0][c] = parent[0][c];
            child[1][c] = parent[1][c];
        }else{
            child[0][c] = parent[1][c];
            child[1][c] = parent[0][c];
        }
    }
  }
  
  function double_crossover(child,parent){
    //二点交叉
    for(var c=0;c<chrom;c++){
        if(c<rand1){
            child[0][c] = parent[0][c];
            child[1][c] = parent[1][c];
        }else if(rand1<=c && c<rand2){
            child[0][c] = parent[1][c];
            child[1][c] = parent[0][c];
        }else{
            child[0][c] = parent[0][c];
            child[1][c] = parent[1][c];
        };
    };
  }