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
	Cc["@mozilla.org/moz/jssubscript-loader;1"].createInstance(Ci.mozIJSSubScriptLoader)
					.loadSubScript( __SCRIPT_URI_SPEC__+'/../content/options.js', mWindow);
}


WindowListener={
	onOpenWindow: function(aWindow){
		let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
		// Wait for the window to finish loading
		let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal).window;
		if(domWindow.document.documentElement.getAttribute("windowtype")!='navigator:browser')
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
		let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
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
	Components.utils.import("resource://gre/modules/Services.jsm");
	let resource = Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler);
	let alias = Services.io.newFileURI(aData.installPath);
	if (!aData.installPath.isDirectory())
		alias = Services.io.newURI("jar:" + alias.spec + "!/", null, null);
	resource.setSubstitution("myaddonpackage", alias);
	
	
	var io = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
	var resource = io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler);
	var alias = io.newURI(__SCRIPT_URI_SPEC__+'/../content/', null, null)
	resource.setSubstitution("smarttext", alias);
	
	/*var alias = Services.io.newFileURI(aData.installPath);
	if (!aData.installPath.isDirectory())
		alias = Services.io.newURI("jar:" + alias.spec + "!/", null, null);*/
	
	var file=getCssFile()
	if(file.exists())
		updateStyle(true, file)
	else
		WindowListener.waitForFirst()
}

function shutdown(aData, aReason) {
	var io = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
	var resource = io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler);
	resource.setSubstitution("smarttext", null);
	
	let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
	wm.removeListener(WindowListener);

	updateStyle(false, getCssFile())	
}

function install(aData, aReason){
}

function uninstall(aData, aReason){
}




/*************************************************************************************
 *
 *
 ******************************************//*
 const Cc = Components.classes;
const Ci = Components.interfaces;

var WindowListener = {
	setupBrowserUI: function(window) {
		let document = window.document;

		// Take any steps to add UI or anything to the browser window
		// document.getElementById() etc. will work here
	},

	tearDownBrowserUI: function(window) {
		let document = window.document;

		// Take any steps to remove UI or anything from the browser window
		// document.getElementById() etc. will work here
	},

	// nsIWindowMediatorListener functions
	onOpenWindow: function(xulWindow) {
		// A new window has opened
		let domWindow = xulWindow.QueryInterface(Ci.nsIInterfaceRequestor)
								.getInterface(Ci.nsIDOMWindowInternal);

		// Wait for it to finish loading
		domWindow.addEventListener("load", function listener() {
			domWindow.removeEventListener("load", listener, false);

			// If this is a browser window then setup its UI
			if (domWindow.document.documentElement.getAttribute("windowtype") == "navigator:browser")
				WindowListener.setupBrowserUI(domWindow);
		}, false);
	},

	onCloseWindow: function(xulWindow) {
	},

	onWindowTitleChange: function(xulWindow, newTitle) {
	}
};

function startup(data, reason) {
	let wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);

	// Get the list of browser windows already open
	let windows = wm.getEnumerator("navigator:browser");
	while (windows.hasMoreElements()) {
		let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);

		WindowListener.setupBrowserUI(domWindow);
	}

	// Wait for any new browser windows to open
	wm.addListener(WindowListener);
}

function shutdown(data, reason) {
	// When the application is shutting down we normally don't have to clean
	// up any UI changes made
	if (reason == APP_SHUTDOWN)
		return;

	let wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);

	// Get the list of browser windows already open
	let windows = wm.getEnumerator("navigator:browser");
	while (windows.hasMoreElements()) {
		let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);

		WindowListener.tearDownBrowserUI(domWindow);
	}

	// Stop listening for any new browser windows to open
	wm.removeListener(WindowListener);
}
*/