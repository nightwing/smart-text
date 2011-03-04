let EXPORTED_SYMBOLS = [];
/******************************************************************/
var Cc = Components.classes;
var Ci = Components.interfaces;


function getCssFile(){
	var file=Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	file.append('smart-text-style.css')	
	return file
}


function updateStyle(register, file){
	var ios= Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
	var sss= Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService)

	var uri=ios.newFileURI(file), a=sss.AGENT_SHEET
	if(sss.sheetRegistered (uri,a))
		sss.unregisterSheet(uri,a)
	if(register)
		sss.loadAndRegisterSheet(uri,a)
}


//
loadIntoWindow=function(mWindow){
	let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
	mWindow = wm.getMostRecentWindow("navigator:browser");
	Cc["@mozilla.org/moz/jssubscript-loader;1"].createInstance(Ci.mozIJSSubScriptLoader)
					.loadSubScript( 'chrome://smarttext/content/options.js', mWindow);
}

function startup() {
	//Components.utils.import("resource://gre/modules/Services.jsm");
	Components.utils.reportError('dddd')
	var file=getCssFile()
	if(file.exists())
		updateStyle(true, file)
	else
		loadIntoWindow()
}
startup()
