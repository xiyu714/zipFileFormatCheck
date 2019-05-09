var ruleVariable = {};  //用来保存匹配到的信息

function matchOne(refileRule, files) { //refileRule为refile规则，files是一个filename数组
  //refilerule次数
  var r = /\${(\d*)(,*)\s*(\d*)}$/;
  var rresult = r.exec(refileRule)
  reString = refileRule.replace(rresult[0], "");
  //变量引用
  r = /\${=([a-zA-Z]*)}/;
  var externRulst= r.exec(reString);
  if(externRulst != null) {
    var externValueName = externRulst[1];
    reString = reString.replace(externRulst[0], ruleVariable[externValueName])
  }

  if(rresult == null) { //无限制次数匹配
    let regex = RegExp(reString);
    files.forEach(function(filename, index) {
      if(regex.test(filename)) {
        files.splice(index, 1); //从中删除一个元素
      }
    })
  } else {
    let one = rresult[1];
    let comma = rresult[2];
    let two = rresult[3];
    let regex = RegExp(reString);
    if(comma == "") { //假设one不为""   //固定次数模式
      let num = 0;
      files.forEach(function(filename, index) {
        if(regex.test(filename)) {
          num += 1;
          files.splice(index, 1); //从中删除一个元素
        }
      })
      if(num == parseInt(one)) {
        return true;
      } else {
        return false;
      }
    } else if (two == "") { //one次及以上
      let num = 0;
      files.forEach(function(filename, index) {
        if(regex.test(filename)) {
          num += 1;
          files.splice(index, 1); //从中删除一个元素
        }
      })
      if(num >= parseInt(one)) {
        return true;
      } else {
        return false;
      }
    } else {  //one到two次
      let num = 0;
      files.forEach(function(filename, index) {
        if(regex.test(filename)) {
          num += 1;
          files.splice(index, 1); //从中删除一个元素
        }
      })
      if(num >= parseInt(one) && num <= parseInt(two)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
function match(refileRules, files) { //refileRules是一个refile规则数组，files是一个filename数组
  var filesBuffer = files.slice();  //在这个缓冲区中的filename都要被相应的规则匹配掉才能返回真
  if(refileRules == undefined) {
    return true;
  }
  for(let refileRule of refileRules) {
    if(matchOne(refileRule, filesBuffer) == false) {
      return false;
    }
  }
  // if(filesBuffer.length == 0) {
  //   return true
  // } else {
  //   return false
  // }
  return true;
}
function checkName(name, reString) {
  if(reString) {
    regex = new RegExp(reString)
    return regex.test(name)
  } else {
    return true
  }
  return true;
}
