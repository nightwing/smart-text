var XPIProviderBP=Components.utils.import("resource://gre/modules/XPIProvider.jsm")//
__SCRIPT_URI_SPEC__=XPIProviderBP.XPIProvider.bootstrapScopes["smart@text-a9.am"].__SCRIPT_URI_SPEC__



window.activator=window.activator||{
	initialize:function(){
		window.addEventListener('activate', this, false)
	},
	handleEvent: function(e){
		this[e.type].forEach(function(x)x(e))	
	},
	activate: []
}
var XPIProviderBP=Components.utils.import("resource://gre/modules/XPIProvider.jsm")//
bsc=XPIProviderBP.XPIProvider.bootstrapScopes["smart@text-a9.am"]
window.activator.activate=[function(){
	updateStyle(true)
}]
window.activator.initialize()


ios= Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
function getCssFile(){
	var file=Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	file.append('smart-text-style.css')
	
	//if(!file.exists())
	createStyleFile(file)
	
	return file
}


function updateStyle(register){
	var ios= Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
	var sss= Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService)

	var uri=ios.newFileURI(getCssFile()), a=sss.AGENT_SHEET
	if(sss.sheetRegistered (uri,a))
		sss.unregisterSheet(uri,a)
	if(register)
		sss.loadAndRegisterSheet(uri,a)
}

function createStyleFile(file){
	var text
	var content = __SCRIPT_URI_SPEC__+'/../content/'

	var binding = makeReq(content+'urlbar.xml')
	var css = makeReq(content+'urlbar.css')
	
	var binding = "data:text/xml" + ";base64," + btoa(binding);
dump(text)
	text = css.replace( 'chrome://smarttext/content/ce/urlbar.xml#urlbar', binding )
	writeToFile(file, text)
}

function writeToFile(file, text){
	var ostream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
	ostream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);

	var converter = Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream);
	converter.init(ostream, "UTF-8", 4096, 0x0000);
	converter.writeString(text);
	converter.close();
}

makeReq=function makeReq(href){
//dump('makeReq',href)
	var req = new XMLHttpRequest;
	req.overrideMimeType('text/plain')
	req.open("GET", href, false);
	try{
		req.send(null);
	}catch(e){}
	return req.responseText;

}
//Components.utils.import("resource://gre/modules/Services.jsm");
