var ruleVariable = {};  //用来保存匹配到的信息
var debugInfo = {};   //保存一次的匹配信息

function matchOne(refileRule, files) { //refileRule为refile规则，files是一个filename数组
  console.debug("refileRule: ", refileRule)
  console.debug("files: ", files)
  debugInfo.refileRule = refileRule;
  debugInfo.files = files.slice();
  //refilerule次数
  var r = /\${(\d*)(,*)\s*(\d*)}$/;
  var rresult = r.exec(refileRule);
  reString = refileRule;
  if(rresult != null) {
    reString = refileRule.replace(rresult[0], "");
  }
  //变量引用
  r = /\${=([a-zA-Z]*)}/g;
  while(true) {
    var externRulst= r.exec(reString);
    if(externRulst != null) {
      var externValueName = externRulst[1];
      reString = reString.replace(externRulst[0], ruleVariable[externValueName])
    } else {
      break;
    }
  }
  //变量声明
  r = /\${\?([a-zA-Z]*)\\*(\d*)}/;
  var declareName = "";
  var groupNumber = 0;
  var declareRuslt = r.exec(reString);
  if(declareRuslt != null) {
    declareName = declareRuslt[1];
    if(declareRuslt[2] != "") {   //这是一个捕获组引用
      groupNumber = parseInt(declareRuslt[2]);
    }
    reString = reString.replace(declareRuslt[0], "");   //删除这部分
  }
  console.debug("reString: ", reString);
  debugInfo.reString = reString;
  //使用正则进行匹配
  var reMatchResult = "";
  function ruleVariableSet() {
    if(declareName != "") { //表示有变量声明
      console.debug(reMatchResult)
      ruleVariable[declareName] = reMatchResult[groupNumber];
    }
  }
  let regex = RegExp(reString);
  if(rresult == null) { //无限制次数匹配
    let returnValue = true;
    files.forEach(function(filename, index) {
      reMatchResult = regex.exec(filename)
      if(reMatchResult) {
        files.splice(index, 1); //从中删除一个元素
        ruleVariableSet();
      } else {
        returnValue = false;
      }
    })
    return returnValue;
  } else {  //限定的匹配次数
    let one = rresult[1];
    let comma = rresult[2];
    let two = rresult[3];
    let lastMatchResult = "";
    if(comma == "") { //假设one不为""   //固定次数模式
      let num = 0;
      files.forEach(function(filename, index) {
        reMatchResult = regex.exec(filename)
        if(reMatchResult != null) {
          num += 1;
          files.splice(index, 1); //从中删除一个元素

          lastMatchResult = reMatchResult;
        }
      })
      if(num == parseInt(one)) {
        //匹配成功，将最后一次匹配的结果，放入ruleVariable中
        reMatchResult = lastMatchResult;
        ruleVariableSet();
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
        ruleVariableSet();
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
        ruleVariableSet();
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
    let result = matchOne(refileRule, filesBuffer);
    console.debug("ruleVariable: ", ruleVariable)
    console.debug("----------这条规则匹配结束-----------")
    console.debug("匹配结果为: ", result);
    if(result == false) {
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
    var regex = new RegExp(reString)
    return regex.test(name)
  } else {
    return true
  }
  return true;
}
