function elite(max,parent,individual,sorted_eval){
  var max = new Array(2);
  for(var i=0;i<2;i++){
    max[i] = new Array(2);
  };

  max[0][0] = sorted_eval[0][0]
  max[0][1] = sorted_eval[0][1]
  max[1][0] = sorted_eval[1][0]
  max[1][1] = sorted_eval[1][1]
  for(var c=0;c<chrom;c++){
    parent[0][c] = individual[max[0][1]][c];
    parent[1][c] = individual[max[1][1]][c];
  }
  console.log("best1:"+max[0][0]);
  console.log("best2:"+max[1][0]);
}

function rulet(parent,eval,individual){
  var total = 0;
  for(var n=0;n<N;n++){
      total += eval[n];
  };
  var arrow1 = Math.floor(Math.random()*total);
  var arrow2 = Math.floor(Math.random()*total);
  var select1 = 0, select2 = 0;
  for(var n=0,sum=0.0;n<N;n++){
      sum += eval[n];
      if(select1 == 0 && sum>arrow1){select1 = n;}
      if(select2 == 0 && sum>arrow2){select2 = n;}
      if(select1!=0 && select2!=0){break;}
  };
  for(var c=0;c<chrom;c++){
      parent[0][c] = individual[select1][c];
      parent[1][c] = individual[select2][c];
  }
}