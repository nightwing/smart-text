(function(){
/******************************************************************/

var Cc = Components.classes;
var Ci = Components.interfaces;
var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
var contentRoot = 'chrome://smarttext/content/'

function getCSSFile(){
	var file=Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	file.append('smart-text-style.css')	
	return file
}

var cssFile = getCSSFile()

function updateStyle(register){
	var sss= Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService)

	var uri = ios.newFileURI(cssFile), a = sss.AGENT_SHEET
	if(sss.sheetRegistered (uri,a))
		sss.unregisterSheet(uri,a)
	if(register)
		sss.loadAndRegisterSheet(uri,a)
}

function writeToFile(file, text){
	var ostream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
	ostream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);

	var converter = Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream);
	converter.init(ostream, "UTF-8", 4096, 0x0000);
	converter.writeString(text);
	converter.close();
}

function makeReq(href){
	var req = new XMLHttpRequest;
	req.overrideMimeType('text/plain')
	req.open("GET", href, false);
	try{
		req.send(null);
	}catch(e){}
	return req.responseText;
}

function createStyleFile(file){
	var text = compileCss(options)

	/*var binding = makeReq(contentRoot+'urlbar.xml')
	var css = makeReq(contentRoot+'urlbar.css')
	
	/*var binding = "data:text/xml" + ";base64," + btoa(binding);*/

	//text = css.replace( 'chrome://smarttext/content/ce/urlbar.xml#urlbar', binding )
	writeToFile(cssFile, text)
}

/******************************************************************/
var OP_COM='/**==',CL_COM='==**/'
function getUserOptions(){
	try{
		var css = makeReq(ios.newFileURI(cssFile))
		var i = css.indexOf(CL_COM), j = css.indexOf(OP_COM)+OP_COM.length
		css = css.substring(i,j)
		return JSON.parse(css)
	}catch(e){}
}

var css, cssFragmentMap, options
function prepareCss(){
	css = makeReq(contentRoot + 'urlbar.css')

	var cssFragments=css.split(OP_COM).map(function(x)x.split(CL_COM))
	cssFragments.shift()
	var defaultOptions=JSON.parse(fragments[0][0])
	cssFragments.shift()

	options = getUserOptions() || defaultOptions

	cssFragmentMap={default:''}
	cssFragments.forEach(function(x){
		if(x[0][0]=='?')
			cssFragmentMap[x[0].substr(1)]=x[1]
		else
			cssFragmentMap.default+=x[1]
	})
}

function compileCss(options){
	var compiledCss=[OP_COM, JSON.stringify(options), CL_COM, '\n', options.docrule, '{']
	for(var i in cssFragmentMap)
		if(i=='default'||options[i])
			ompiledCss.push(
				cssFragmentMap[i].replace(/\$[^\$]*\$/g, function(x){
					return options[x.slice(1,-1)]
				})
			);
	compiledCss.push('}')
	return compiledCss.join('')
}


/******************************************************************/
prepareCss()
if(!window.isSmartTextOptionsWindow){
	//createStyleFile(cssFile)
	options = getOptionsFromUI()
	var text = compileCss(options)
	writeToFile(cssFile, text)
	updateStyle(true)
}else{
	window.options = options
	window.compileCss = compileCss
	
}
})()