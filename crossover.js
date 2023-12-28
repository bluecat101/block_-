function single_crossover(child,parent){
  var rand = getRandoms(NUM_OF_CHILD/2);
  //--- 単一交叉
  // var rand1 = Math.floor(Math.random()*chrom);
  for(var c=0;c<chrom;c++){
    for(var i=0;i<NUM_OF_CHILD/2;i++){
      if(c<rand[i]){
        child[i][c] = parent[0][c];
        child[NUM_OF_CHILD-1-i][c] = parent[1][c];
      }else{
        child[i][c] = parent[1][c];
        child[NUM_OF_CHILD-1-i][c] = parent[0][c];
      }  
    }
  }
}
  
function double_crossover(child,parent){
  var rand_len = Math.log(NUM_OF_CHILD) / Math.log(2)-1;
  var rand = getRandoms(rand_len);
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
}
function getRandoms(length){
  var rand = new Array(length);
  for(var i=0;i<length;i++){
    tmp = Math.floor(Math.random()*chrom);
    while(true){
      if(!rand.includes(tmp)){
        rand[i] = tmp;
        break;
      }
    }
  }
  return rand.sort(); 
}

