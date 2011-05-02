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
	AddJarManifestLocation(aData.installPath.path)
	
	var file=getCssFile()
	if(file.exists())
		updateStyle(true, file)
	else
		WindowListener.waitForFirst()
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN)
		return;
		
	let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);	
	// close option windows if any
	let enumerator = wm.getEnumerator("");
	while(enumerator.hasMoreElements()) {
		let win = enumerator.getNext();
		if(win.location.href.indexOf('chrome://smarttext/content/')==0)
			win.close()
	}
	

	wm.removeListener(WindowListener);

	updateStyle(false, getCssFile())	
}

function install(aData, aReason){
}

function uninstall(aData, aReason){
}

//Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(getCurrentFile())
function AddJarManifestLocation(path) {
	Components.utils.import("resource://gre/modules/ctypes.jsm");
	var file = Cc["@mozilla.org/file/directory_service;1"]
				.getService(Ci.nsIProperties)
				.get("resource:app", Ci.nsIFile);
	file.append(ctypes.libraryName("xul"));
	var libxul = ctypes.open(file.path);
  
	// we need to explicitly allocate a type for the buffer we'll need to hold
	// the path in :(
	var bufLen = path.length + 2;
	var PathBuffer_t = ctypes.StructType("PathBuffer",
										[{buf: ctypes.jschar.array(bufLen)}])
	var nsString_t = ctypes.StructType("nsAString",
										[{mData:   PathBuffer_t.ptr}
										,{mLength: ctypes.uint32_t}
										,{mFlags:  ctypes.uint32_t}])
	var PRBool_t = ctypes.uint32_t; // yay NSPR
	var nsILocalFile_t = ctypes.StructType("nsILocalFile").ptr;

	var NS_NewLocalFile = libxul.declare("NS_NewLocalFile_P",
                   ctypes.default_abi,
                   ctypes.uint32_t,         // nsresult return
                   nsString_t.ptr,          // const nsAString &path
                   PRBool_t,                // PRBool followLinks
                   nsILocalFile_t.ptr       // nsILocalFile* *result
	);
	var XRE_AddJarManifestLocation = libxul.declare("XRE_AddJarManifestLocation",
                   ctypes.default_abi,
                   ctypes.uint32_t,         // nsresult return
                   ctypes.int32_t,          // NSLocationType aType
                   nsILocalFile_t           // nsILocalFile* aLocation
	);
	var pathBuffer = new PathBuffer_t;
	pathBuffer.buf = path + '\0';
	var manifest = new nsString_t;
	manifest.mData = pathBuffer.address();
	manifest.mLength = path.length;
	manifest.mFlags = 1 << 4; // F_FIXED
	var manifestPtr = manifest.address();
  
	try {
		var rv;
		var localFile = new nsILocalFile_t;
		rv = NS_NewLocalFile(manifest.address(), false, localFile.address());
		if (rv & 0x80000000) {
			throw Components.Exception("NS_NewLocalFile error", rv);
		}
		const NS_SKIN_LOCATION = 1;
		rv = XRE_AddJarManifestLocation(NS_SKIN_LOCATION, localFile);
		if (rv & 0x80000000) {
			throw Components.Exception("XRE_AddJarManifestLocation error", rv);
		}
	} finally {
		libxul.close();
	}
}

