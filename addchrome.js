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


Cc=Cc
Ci=Ci
Cu=Components.utils
var zipWriter = Components.Constructor("@mozilla.org/zipwriter;1", "nsIZipWriter");
var gDirSvc     = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties);
var gChromeReg  = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry);
var ios         = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService)
var fileHandler = ios.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler);

var jarProtocolHandler = ios.getProtocolHandler("jar").QueryInterface(Ci.nsIJARProtocolHandler);

/**zr constants*/
var PR_RDONLY      = 0x01;
var PR_WRONLY      = 0x02;
var PR_RDWR        = 0x04;
var PR_CREATE_FILE = 0x08;
var PR_APPEND      = 0x10;
var PR_TRUNCATE    = 0x20;
var PR_SYNC        = 0x40;
var PR_EXCL        = 0x80;


/**doesn't work for archives with opened archives inside*/
function syncWriteToJar(jarFile, entryPath, writer, data, compression){
    var jarCache = jarProtocolHandler.JARCache;
    var reader = jarCache.getZip(jarFile);
    reader.close();
	try{
		var zipW = new zipWriter();
		zipW.open(jarFile, PR_RDWR); // | PR_APPEND
		try{
			// remove entry
			if (zipW.hasEntry(entryPath)){
				if(typeof compression!='number')
					var compression=zipW.getEntry(entryPath).compression			
				zipW.removeEntry(entryPath, false);	
			}
			//
			if(typeof compression!='number')
				compression=Ci.nsIZipWriter.COMPRESSION_DEFAULT//_NONE
			writer(zipW, entryPath, data, compression)
		}catch(e){var err=e.toString();Cu.reportError(e)}
		zipW.close();
	}catch(e){var err=e.toString();Cu.reportError(e)}	
    reader.open(jarFile);
	return err
}

function writeStringToJar(zipW, entryPath, data, compression){    
    var istream = Cc["@mozilla.org/io/string-input-stream;1"].createInstance(Ci.nsIStringInputStream);	
	istream.setData(data, data.length);
	zipW.addEntryStream(entryPath, null, compression, istream, false)       
}

function removeEntryFromJar(){}

function createXPI(){	
	// get TMP directory 
	//var nsFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("Desk", Ci.nsIFile);
	var jarFile = getDummyManifestXPIFile()
	if(!jarFile.exists()){
		jarFile.create(Ci.nsIFile.NORMAL_FILE_TYPE, 0666);
	}
  
	var zipWriter = Components.Constructor("@mozilla.org/zipwriter;1", "nsIZipWriter");
	var zipW = new zipWriter();  
	zipW.open(jarFile, PR_RDWR | PR_CREATE_FILE | PR_TRUNCATE);
	zipW.close();
	
	try{
		entryPath = 'install.rdf'
		data = 'install.rdf'
		syncWriteToJar(jarFile, entryPath, writeStringToJar, data)	
		entryPath = 'chrome.manifest'
		syncWriteToJar(jarFile, entryPath, writeStringToJar, data)	
	}catch(e){
		Components.utils.reportError(e)
	}
}
 
/*********************************************/
function getDummyManifestXPIFile(){
	var profdir=gDirSvc.get('ProfD', Ci.nsIFile);
	profdir.append('extensions')
	profdir.append('chrome@adder.am.xpi')
	return profdir
}
