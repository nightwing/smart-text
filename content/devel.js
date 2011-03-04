var xblLiveEdit = (function(){
	var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService)
	var rootPath = 'chrome://smarttext/content/'
	var stylefile = getCssFile()
	var fileURI = ios.newFileURI(stylefile)
	var activeURI = fileURI
	
	function getCssFile(){
		var file=Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
		file.append('smart-text-style.css')	
		return file
	}
	function updateStyle(register, useDataURI){		
		var a=sss.AGENT_SHEET
		
		if(sss.sheetRegistered (activeURI,a))
			sss.unregisterSheet(activeURI,a)
		if(register){
			activeURI = useDataURI? ios.newURI(getData(true), null, null) :fileURI;
			sss.loadAndRegisterSheet(activeURI,a)
		}
	}
	function getData(useDataURI){
		var binding = makeReq(rootPath+'urlbar.xml')
		var css = makeReq(rootPath+'urlbar.css')
		
		var binding = "data:text/xml" + ";base64," + btoa(binding);
		var text = css.replace( 'chrome://smarttext/content/ce/urlbar.xml#urlbar', binding )
		if(!useDataURI)
			return text
		else 
			return "data:text/xml" + ";base64," + btoa(text);
	}
	function createStyleFile(file){	
		writeToFile(file, getData())
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

	return {
		update: function(){
			updateStyle(true, true)
		},
		save: function(){
			createStyleFile(stylefile)
		}
	}
})()
//Components.utils.import("resource://gre/modules/Services.jsm");
window.activator=window.activator||{
	initialize:function(){
		window.addEventListener('activate', this, false)
	},
	shutdown:function(){
		window.removeEventListener('activate', this, false)
	},
	handleEvent: function(e){
		this[e.type].forEach(function(x)x(e))	
	},
	activate: []
}
window.activator.activate=[function(){
	xblLiveEdit.update()
}]
window.activator.initialize()
