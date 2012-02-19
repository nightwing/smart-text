/*devel__(*/
try{
	var dump = Components.utils.import("resource://shadia/main.js").dump
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
		return arguments[0]
	}
}
/*devel__)*/

/******************************************************************/
var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
Components.utils.import("resource://gre/modules/Services.jsm");


function getCssFile() {
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
	version = 2
	Components.utils.reportError(1)
	var prefName = "extensions.smart-text.version"
	var v = Services.prefs.prefHasUserValue(prefName) ? Services.prefs.getIntPref(prefName) : 0
	if (v == version)
		return
		
	var f = Services.scriptloader.loadSubScript( __SCRIPT_URI_SPEC__+'/../content/options.js', mWindow);	
	f(version)
	Services.prefs.setIntPref(prefName, version)
}


WindowListener={
	observe: function windowWatcher(win, topic) {
		if (topic == "domwindowopened") {
			win.addEventListener("load", function onLoad() {
				win.removeEventListener("load", onLoad, false);
				if (this.active && win.location.href == 'chrome://browser/content/browser.xul')
					WindowListener.loadIntoWindow(win)
			}, false);
		}
	},
	loadIntoWindow: function(win){
		Services.ww.unregisterNotification(this.observe)
		loadIntoWindow(win)
	},
	waitForFirst: function(){
		var win = Services.wm.getMostRecentWindow("navigator:browser");
		if (win)
			loadIntoWindow(win)
		else
			Services.ww.registerNotification(this.observe)
		this.active = true
	},
	unregister: function(){
		Services.ww.unregisterNotification(this.observe)
		this.active = false
	}
}


/**************************************************************************
 * bootstrap.js API
 *****************/
function startup(aData, aReason) {
	if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
		Components.manager.QueryInterface(Ci.nsIComponentRegistrar).addBootstrappedManifestLocation(aData.installPath)

	var file = getCssFile()
	if (file.exists())
		updateStyle(true, file)
	
	WindowListener.waitForFirst()
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN)
		return;
	WindowListener.unregister()
	updateStyle(false, getCssFile())
	
	let wm = Services.wm
	// close option windows if any
	let enumerator = wm.getEnumerator("");
	while(enumerator.hasMoreElements()) {
		let win = enumerator.getNext();
		if(win.location.href.indexOf('chrome://smarttext/content/')==0)
			win.close()
	}
	if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
		Components.manager.QueryInterface(Ci.nsIComponentRegistrar)
					.removeBootstrappedManifestLocation(aData.installPath)
}


function install(){}
function uninstall(){}