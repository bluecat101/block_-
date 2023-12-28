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
    // var child_len = child.length;
    var rand_len = Math.log(NUM_OF_CHILD) / Math.log(2)-1;
    // console.log(NUM_OF_CHILD,rand_len);
    var rand = new Array(rand_len);
    for(var i=0;i<rand_len;i++){
      tmp = Math.floor(Math.random()*chrom);
      while(true){
        if(!rand.includes(tmp)){
          rand[i] = tmp;
          break;
        }
      }
    }
    rand.sort();
    var rand_position =0;
    var choiced_parent =0;
    var count=0;
    for(var c=0;c<chrom;c++){
      if(c>=rand[rand_position]){
        rand_position++;
      }
      for(var i=0;i<NUM_OF_CHILD;i++){
        // console.log(choiced_parent);
        // console.log(child[i],parent[choiced_parent][c])
        child[i][c] = parent[choiced_parent][c];
        count++;
        if(count>=2**(rand_len-1-rand_position)){
          count=0;
          choiced_parent = choiced_parent ^ 1;
        }
      }
    }
    child.shift();
    child.pop();
    // child;
  }