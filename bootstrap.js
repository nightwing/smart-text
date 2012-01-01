/******************************************************************/
var Cc = Components.classes;
var Ci = Components.interfaces;
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
loadIntoWindow = function(mWindow){
	Services.scriptloade.loadSubScript( __SCRIPT_URI_SPEC__+'/../content/options.js', mWindow);
}


WindowListener={
	onOpenWindow: function(aWindow){
		let wm = Services.wm
		// Wait for the window to finish loading
		let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal).window;
		if (domWindow.document.documentElement.getAttribute("windowtype")!='navigator:browser')
			return;
		wm.removeListener(WindowListener);
		domWindow.addEventListener("load", function() {
			domWindow.removeEventListener("load", arguments.callee, false);
			loadIntoWindow(domWindow)
		}, false);
	},
	onCloseWindow: function(aWindow){ },
	onWindowTitleChange: function(aWindow, aTitle){ },
	waitForFirst: function(){
		let wm = Services.wm
		let win = wm.getMostRecentWindow("navigator:browser");
		if(win)
			loadIntoWindow(win)
		else{
			wm.addListener(WindowListener);
		}
	}
}


/**************************************************************************
 * bootstrap.js API
 *****************/
function startup(aData, aReason) {
	if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
		Components.manager.QueryInterface(Ci.nsIComponentRegistrar)
						.addBootstrappedManifestLocation(aData.installPath)


	var file = getCssFile()
	if(file.exists())
		updateStyle(true, file)
	else
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

