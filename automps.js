var mps=mps||{};mps._automps=mps._automps||{};mps._automps.url = 'doubleclick.net/N2620/';
mps._automps.loaded=false; mps._automps.ignore = /pm|ord|ksg|pos|tile|tandemad|dcopt/g; mps._automps.units = [];
mps._automps.host=window.location.host.replace('www.','');
mps._automps.appendInterval=0;mps._automps.sources=[];mps._automps.cls = 'advertisement';mps._automps.interval=0;
var mpsopts={'host':'mps.nbcuni.com','updatecorrelator':1, 'datacollect': 0};
var mps_site_mapping={'automatic':['labs.mps.io','televisionwithoutpity.com','rotoworld.com']};
var mpscall={}; mpscall.site='automagic';mpscall.cag={};
mps.adlist = { 'topbanner':['728x90','970x66','900x250','960x50','728x250'],'boxad':['300x250','300x600']}
/***** Get variables from url, init MPS *****/
mps._automps.init = function(str) {
  if(mps.requesturl) { window.console&&console.log('[MPS AUTOMPS]: MPS is already defined.'); return false; }
  window.console&&console.log('[MPS AUTOMPS]: Set initial mpscall variables.');
  mps._automps.loaded = true;
  var catStr = str.split('/');
  for(var i=0;i<catStr.length;i++) {
    if(catStr[i].indexOf(';') > -1) {
      var cagStr = catStr[i].split(';');
      for(var j=1; j<cagStr.length;j++) {
        var cagSubStr = cagStr[j].split('=');
        if(!cagSubStr[0].match(mps._automps.ignore) && cagSubStr[0] !== 'u') {
          cagSubStr[0] = cagSubStr[0].replace('!','');
          mpscall.cag[cagSubStr[0]] = cagSubStr[1].replace(/[?<>"'!@#$%&*()+=]/gi, '');
        }
      }
      mpscall.cat = catStr[i -1] + '|' + cagStr[0].replace(/[_><]/g, '|');
    }
  }
  mpscall.ADLIST=1;
  document.write('<scr'+'ipt id="mps-ext-load" src="//'+mpsopts.host+'/fetch/ext/load-'+mpscall.site+'.js"></scr'+'ipt>');
};
mps._automps.getSize = function(str) { var str = str.split(';'); for(var i=0;i<str.length;i++) { var strParam = str[i].split('='); if(strParam[0]==='sz') { return strParam[1]; } } return ''; };
mps._automps.checkUnits = function(size) { return mps._automps.units.length > 0 && mps._automps.units.indexOf(size) > -1 ? 2 : 1; };
mps.gptloadCallback = function() { mps._automps.append(); setTimeout(function() { mps._automps.append(true); }, 500); };
if(mps_site_mapping.automatic.indexOf(mps._automps.host) > -1) {
  document.write = function(write) {
    return function() {
      if(arguments[0].indexOf(mps._automps.url) > -1) {
        window.console&&console.log('[MPS AUTOMPS]: Replacement executed on: ' + arguments[0]);
        mps._automps.sources.push(arguments[0]);
        if(!mps._automps.loaded) { mps._automps.init(arguments[0]); }
        if(!mpsopts.datacollect) {
          var size = mps._automps.getSize(arguments[0]);
          var unitNum = mps._automps.checkUnits(size);
          mps._automps.units.push(size);
          var mpsDiv = '<div class="pixelman-replacement" data-size="' + size + '" data-unit="' + unitNum + '"></div>';
        }
        arguments[0] = mpsDiv;
      }
      var wr = write.apply(this, arguments);
      return wr;
    };
  }(document.write);
};
mps._automps.exec = function(elem, type, unitNum) {
  mps._debug('[MPS AUTOMPS] Exec: ad unit: ' + type + ', num:' + unitNum);
  if(mps._gptloaded) {
    mps._debug('[MPS AUTOMPS] Executing: ' + type + unitNum + ' on "' + elem + '.'); mps.insertAd(elem, type + unitNum);
  } else {
    mps._debug('[MPS AUTOMPS] Exec: GPT is undefined, retry in 1 second for ' + type + ' on "' + elem.className + '."');
    if(mps._automps.interval < 10) {
      mps._automps.interval++; setTimeout(function() { mps._automps.exec(elem, type, unitNum) }, 1000);
    } else {
      mps._debug('[MPS AUTOMPS] Exec: GPT did not load correctly after 10 seconds.'); return false;
    }
  }
};
mps._automps.append = function(interval) {
  mps._debug('[MPS AUTOMPS] Append called.');
  var piR = document.getElementsByClassName('pixelman-replacement');
  for(var i=0;i<piR.length;i++) {
    _piR = piR[i]; _piR.id = 'mps-unit-' + i;
    var unitNum = parseInt(_piR.dataset.unit, 10) > 1 ? parseInt(_piR.dataset.unit, 10) : '';
    var _piRSize = _piR.dataset.size; var adFound = false;
    for(var j in mps.adlist) {
      if(mps.adlist[j].join() === _piRSize) {
        if(debugmode && debugmode.log) { _piR.style.border="2px solid #14a614"; }
        mps._automps.exec(_piR, j, unitNum); adFound = true; break;
      }
    }
    _piR.className = 'pixelman-replaced';
    if(!adFound) { if(debugmode && debugmode.log) {
        mps._debug('[MPS AUTOMPS] Append - unmatched ad for size: ' + _piRSize + ' loading legacy ad unit.');
        _piR.style.border = '2px solid #ff0000'; }
        for(var k=0;k<mps._automps.sources.length;k++) { var _src = mps._automps.sources[k];
          if(mps._automps.getSize(_src) === _piRSize) { mps._append(_piR, mps._automps.sources[i]);}}}}
  if(mps._automps.appendInterval < 10 && interval) { mps._automps.appendInterval++; setTimeout(function() { mps._automps.append(true)}, 1000)}
};