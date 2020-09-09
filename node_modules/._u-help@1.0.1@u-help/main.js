
function spaces(n){
  var i,txt = '';
  
  for(i = 0;i < n;i++) txt += ' ';
  return txt;
}

module.exports = function(command,desc,info){
  var txt = '',
      i,j,k,hyphons,k1,k2,ml = 0;
  
  if(typeof desc != 'string' && !(desc instanceof Array)){
    info = desc;
    desc = undefined;
  }
  
  hyphons = '·-';
  for(i = 0;i < command.length;i++) hyphons += '-';
  hyphons += '-·';
  
  txt +=  '\n ' + 
          hyphons + '\n' +
          ' | ' + command + ' |\n ' +
          hyphons + '\n\n';
  
  if(desc){
    if(desc instanceof Array) for(i = 0;i < desc.length;i++){
      txt += desc[i] + '\n';
    }else txt += desc + '\n';
    txt += '\n';
  }
  
  if(!info) return txt;
  
  k1 = Object.keys(info);
  for(i = 0;i < k1.length;i++){
    txt += k1[i] + ':\n\n';
    
    if(typeof info[k1[i]] == 'string' || info[k1[i]] instanceof Array){
      if(info[k1[i]] instanceof Array) for(k = 0;k < info[k1[i]].length;k++){
        txt += '  ' + info[k1[i]][k] + '\n';
      }else txt += '  ' + info[k1[i]] + '\n';
      
      txt += '\n';
      continue;
    }
    
    k2 = Object.keys(info[k1[i]]);
    for(j = 0;j < k2.length;j++){
      if(k2[j].length > ml) ml = k2[j].length;
    }
    
    for(j = 0;j < k2.length;j++){
      txt += '  ' + k2[j] + spaces(ml - k2[j].length + 3);
      if(info[k1[i]][k2[j]] instanceof Array){
        txt += info[k1[i]][k2[j]][0] + '\n';
        for(k = 1;k < info[k1[i]][k2[j]].length;k++)
          txt += spaces(ml + 5) + info[k1[i]][k2[j]][k] + '\n';
      }else txt += info[k1[i]][k2[j]] + '\n';
    }
    
    txt += '\n';
  }
  
  return txt;
};

module.exports.show = function(command,desc,info){
  var txt = module.exports(command,desc,info);
  
  console.log(txt.replace(/\n$/,''));
};

