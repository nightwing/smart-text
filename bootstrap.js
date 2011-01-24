/******************************************************************/
var Cc = Components.classes;
var Ci = Components.interfaces;
ios= Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)


function getCssMirrorJarPath(){
	var file=Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	file.append('smart-text-style.css')
	
	if(!file.exists())
		createStyleFile(file)
	
	var fileHandler = ios.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler);
	var uri=fileHandler.getURLSpecFromFile(getCssMirrorDir());
		
	return 'jar:'+uri+'!/'
}


function registerUnregisterStyle(register){
	var ios= Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
	var sss= Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService)

	var stylePath=getCssMirrorJarPath()

	var uri=stylePath, a=sss.AGENT_SHEET
	uri=ios.newURI(uri,null,null)
	if(sss.sheetRegistered (uri,a))
		sss.unregisterSheet(uri,a)
	if(register)
		sss.loadAndRegisterSheet(uri,a)
}

function createStyleFile(file){
	text
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

//Components.utils.import("resource://gre/modules/Services.jsm");

WindowListener={
	onOpenWindow: function(aWindow){
		// Wait for the window to finish loading
		let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal).window;
		domWindow.addEventListener("load", function() {
			domWindow.removeEventListener("load", arguments.callee, false);
			if(domWindow.CombinedStopReload)
				loadIntoWindow(domWindow)
			//Components.utils.reportError(domWindow.CombinedStopReload)
		}, false); 
	},
	onCloseWindow: function(aWindow){ },
	onWindowTitleChange: function(aWindow, aTitle){ }
}

/**************************************************************************
 * bootstrap.js API
 *****************/
function startup(aData, aReason) {
	let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

	// Load into any existing windows
	let enumerator = wm.getEnumerator("navigator:browser");
	while(enumerator.hasMoreElements()) {
		let win = enumerator.getNext();
		loadIntoWindow(win);
	}
	// Load into all new windows
	wm.addListener(WindowListener);
}

function shutdown(aData, aReason) {
	let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

	// Unload from any existing windows
	let enumerator = wm.getEnumerator("navigator:browser");
	while(enumerator.hasMoreElements()) {
		let win = enumerator.getNext();
		unloadFromWindow(win);
	}
	wm.removeListener(WindowListener);

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