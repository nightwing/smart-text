/*devel__(*/
try{
	dump = Components.utils.import("resource://shadia/main.js").dump
}catch(e){
	dump = function () {
		var aMessage = ": ";
		for (var i = 0, l = arguments.length; i < l; ++i) {
			var a = arguments[i];
			aMessage += (a && !a.toString ? "[object call]" : a) + " , ";
		}
		var stack = Components.stack.caller;
		var consoleMessage = Cc['@mozilla.org/scripterror;1'].createInstance(Ci.nsIScriptError);
		consoleMessage.init(aMessage, stack.filename, null, stack.lineNumber, 0, 9, "component javascript");
		Services.console.logMessage(consoleMessage);
	}
}
/*devel__)*/

/******************************************************************/
var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
Components.utils.import("resource://gre/modules/Services.jsm");


function getCssFile(){
	var file = Services.dirsvc.get("ProfD", Ci.nsIFile);
	file.append('smart-text-style.css')
	return file
}


function updateStyle(register, file){
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService)

	var uri = Services.io.newFileURI(file), a = sss.AGENT_SHEET
	if (sss.sheetRegistered (uri,a))
		sss.unregisterSheet(uri,a)
	if (register)
		sss.loadAndRegisterSheet(uri,a)
}


//
loadIntoWindow = function(mWindow) {
	Services.scriptloader.loadSubScript( __SCRIPT_URI_SPEC__+'/../content/options.js', mWindow);
}


WindowListener={
	onOpenWindow: function(win){
		dump("::::::::::::::::::---", win.document.documentElement.getAttribute("windowtype"))
		let wm = Services.wm
		// Wait for the window to finish loading
		win = win.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow).window;
		if (win.document.documentElement.getAttribute("windowtype")!='navigator:browser')
			return;
		wm.removeListener(WindowListener);
		win.addEventListener("load", function onLoad() {
			win.removeEventListener("load", onLoad, false);
			loadIntoWindow(win)
		}, false);
	},
	onCloseWindow: function(win){ },
	onWindowTitleChange: function(win, aTitle){ },
	waitForFirst: function(){
		let wm = Services.wm
		let win = wm.getMostRecentWindow("navigator:browser");
		
		if(win)
			loadIntoWindow(win)
		else
			wm.addListener(WindowListener);
	
		dump(win)
	}
}


/**************************************************************************
 * bootstrap.js API
 *****************/
function startup(aData, aReason) {
	if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
		Components.manager.QueryInterface(Ci.nsIComponentRegistrar).addBootstrappedManifestLocation(aData.installPath)

	/* var file = getCssFile()
	if(file.exists())
		updateStyle(true, file)
	else */
		WindowListener.waitForFirst()
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN)
		return;

	let wm = Services.wm
	// close option windows if any
	let enumerator = wm.getEnumerator("");
	while(enumerator.hasMoreElements()) {
		let win = enumerator.getNext();
		if(win.location.href.indexOf('chrome://smarttext/content/')==0)
			win.close()
	}


	wm.removeListener(WindowListener);

	updateStyle(false, getCssFile())

	if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
		Components.manager.QueryInterface(Ci.nsIComponentRegistrar)
					.removeBootstrappedManifestLocation(aData.installPath)
}

