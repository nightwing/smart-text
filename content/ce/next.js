//goDoCommand

//decodeURIComponent(gURLBar.value)
//goDoCommand('cmd_paste')
gURLBar.handleCommand
gURLBar._canonizeURL
url=gURLBar.value
 var postData = {};
    url = getShortcutOrURI(url, postData);

postData.value

getAboutUrls=function(){
	var l="@mozilla.org/network/protocol/about;1?what=";
	var ans=[];
	for(var i in Cc)
		if(i.indexOf(l)==0)
			ans.push('about:'+i.substr(l.length))
	return ans.sort()
}
getAboutUrls()


/********************************************************************************************/

/*r=document.createRange()
r.setStart(gURLBar.stsegmentLayer.children[2].firstChild,2)
r.setStart(gURLBar.stsegmentLayer.children[0].firstChild,1)
//window.getSelection().addRange(r)
rt=r.getBoundingClientRect()
var brt=brt||gURLBar.stsegmentLayer.appendChild(document.createElement('div'))
brt.style.cssText='position:fixed;background:red;z-index:1000;'+
['left','top','width','height'].map(function(x)[x,':',rt[x],'px;'].join('')).join('')
brt.style.cssText
//shadia.inspect(brt)
*/	




/********************************************************************************************/



gURLBar.popup.__proto__.onPopupClick = function onPopupClick(aEvent) {
    if (aEvent.button == 2) {
        return;
    }
	var sel=getSelection(), val = sel.toString()
	if(val){
		Cc["@mozilla.org/widget/clipboardhelper;1"]
					  .getService(Ci.nsIClipboardHelper)
					  .copyString(val);
		sel.removeAllRanges()
		return
	}
    var controller = this.view.QueryInterface(Components.interfaces.nsIAutoCompleteController);
    if (aEvent.button == 0 &&
        !aEvent.shiftKey &&
        !aEvent.ctrlKey && !aEvent.altKey && !aEvent.metaKey) {
        controller.handleEnter(true);
        return;
    }
    if (gURLBar && this.mInput == gURLBar) {
        var url = controller.getValueAt(this.selectedIndex);
        //this.closePopup();
        //controller.handleEscape();
        let action = this.mInput._parseActionUrl(url);
        if (action) {
            if (action.type == "switchtab") {
                url = action.param;
            } else {
                return;
            }
        }
        //openLinkIn(url, whereToOpenLink(aEvent, false, true), {relatedToCurrent: true, fromChrome: false});
		gBrowser.loadOneTab(url, {inBackground: true, relatedToCurrent: true});
    }
}

/********************************************************************************************/



function addrem(add){


}
var logger=logger||{}
logger.handleEvent = function(e){
	dump(e.type,e.target,e.originalTarget,e.originalTarget.textContent)
}
;['mousedown','mouseup','click','focus','blur'].forEach(function(x){
	window.removeEventListener(x, logger, true)
	window.addEventListener(x, logger, true)
})


/********************************************************************************************/


openUILinkIn=function openUILinkIn(url, where, aAllowThirdPartyFixup, aPostData, aReferrerURI) {
    var params;
    if (arguments.length == 3 && typeof arguments[2] == "object") {
        params = aAllowThirdPartyFixup;
    } else {
        params = {allowThirdPartyFixup: aAllowThirdPartyFixup, postData: aPostData, referrerURI: aReferrerURI};
    }
    params.fromChrome = false;
    openLinkIn(url, where, params);
}

openLinkIn(href, where,{relatedToCurrent:true,fromChrome : false})


function openLinkIn(url, where, params) {
    if (!where || !url) {
        return;
    }
    var aFromChrome = params.fromChrome;
    var aAllowThirdPartyFixup = params.allowThirdPartyFixup;
    var aPostData = params.postData;
    var aCharset = params.charset;
    var aReferrerURI = params.referrerURI;
    var aRelatedToCurrent = params.relatedToCurrent;
    if (where == "save") {
        saveURL(url, null, null, true, null, aReferrerURI);
        return;
    }
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    var w = getTopWin();
    if ((where == "tab" || where == "tabshifted") &&
        w.document.documentElement.getAttribute("chromehidden")) {
        w = getTopWin(true);
        aRelatedToCurrent = false;
    }
    if (!w || where == "window") {
        var sa = Cc['@mozilla.org/supports-array;1'].createInstance(Ci.nsISupportsArray);
        var wuri = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
        wuri.data = url;
        let charset = null;
        if (aCharset) {
            charset = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
            charset.data = "charset=" + aCharset;
        }
        var allowThirdPartyFixupSupports = Cc['@mozilla.org/supports-PRBool;1'].createInstance(Ci.nsISupportsPRBool);
        allowThirdPartyFixupSupports.data = aAllowThirdPartyFixup;
        sa.AppendElement(wuri);
        sa.AppendElement(charset);
        sa.AppendElement(aReferrerURI);
        sa.AppendElement(aPostData);
        sa.AppendElement(allowThirdPartyFixupSupports);
        Services.ww.openWindow(w || window, getBrowserURL(), null, "chrome,dialog=no,all", sa);
        return;
    }
    var loadInBackground = aFromChrome ? getBoolPref("browser.tabs.loadBookmarksInBackground") : getBoolPref("browser.tabs.loadInBackground");
    if (where == "current" && w.gBrowser.selectedTab.pinned) {
        try {
            let uriObj = Services.io.newURI(url, null, null);
            if (!uriObj.schemeIs("javascript") &&
                w.gBrowser.currentURI.host != uriObj.host) {
                where = "tab";
                loadInBackground = false;
            }
        } catch (err) {
            where = "tab";
            loadInBackground = false;
        }
    }
    switch (where) {
      case "current":
        w.loadURI(url, aReferrerURI, aPostData, aAllowThirdPartyFixup);
        break;
      case "tabshifted":
        loadInBackground = !loadInBackground;
      case "tab":
        let browser = w.gBrowser;
        browser.loadOneTab(url, {referrerURI: aReferrerURI, charset: aCharset, postData: aPostData, inBackground: loadInBackground, allowThirdPartyFixup: aAllowThirdPartyFixup, relatedToCurrent: aRelatedToCurrent});
        break;
      default:;
    }
    var fm = Components.classes['@mozilla.org/focus-manager;1'].getService(Components.interfaces.nsIFocusManager);
    if (window == fm.activeWindow) {
        w.content.focus();
    } else {
        w.gBrowser.selectedBrowser.focus();
    }
}







undefined
function addTab(aURI, aReferrerURI, aCharset, aPostData, aOwner, aAllowThirdPartyFixup) {
    var aFromExternal;
    var aRelatedToCurrent;
    var aSkipAnimation;
    if (arguments.length == 2 &&
        typeof arguments[1] == "object" &&
        !(arguments[1] instanceof Ci.nsIURI)) {
        let params = arguments[1];
        aReferrerURI = params.referrerURI;
        aCharset = params.charset;
        aPostData = params.postData;
        aOwner = params.ownerTab;
        aAllowThirdPartyFixup = params.allowThirdPartyFixup;
        aFromExternal = params.fromExternal;
        aRelatedToCurrent = params.relatedToCurrent;
        aSkipAnimation = params.skipAnimation;
    }
    this._browsers = null;
    this.enterTabbedMode();
    if (this.mCurrentTab.owner) {
        this.mCurrentTab.owner = null;
    }
    var t = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "tab");
    var blank = !aURI || aURI == "about:blank";
    if (blank) {
        t.setAttribute("label", this.mStringBundle.getString("tabs.emptyTabTitle"));
    } else {
        t.setAttribute("label", aURI);
    }
    t.setAttribute("crop", "end");
    t.setAttribute("validate", "never");
    t.setAttribute("onerror", "this.removeAttribute('image');");
    t.className = "tabbrowser-tab";
    if (aSkipAnimation ||
        this.tabContainer.getAttribute("overflow") == "true" ||
        !Services.prefs.getBoolPref("browser.tabs.animate")) {
        t.setAttribute("fadein", "true");
        setTimeout(function (tabContainer) {tabContainer._handleNewTab(t);}, 0, this.tabContainer);
    } else {
        setTimeout(function (tabContainer) {if (t.pinned) {tabContainer._handleNewTab(t);} else {t.setAttribute("fadein", "true");}}, 0, this.tabContainer);
    }
    this.tabContainer.appendChild(t);
    if (this.tabContainer.getAttribute("pinnedonly") == "true") {
        this.tabContainer._positionPinnedTabs();
    }
    if (this.tabContainer.mTabstrip._isRTLScrollbox) {
        this.tabContainer.mTabstrip.scrollByPixels(t.clientWidth);
    }
    this._browsers = null;
    if (aOwner) {
        t.owner = aOwner;
    }
    var b = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "browser");
    b.setAttribute("type", "content-targetable");
    b.setAttribute("message", "true");
    b.setAttribute("contextmenu", this.getAttribute("contentcontextmenu"));
    b.setAttribute("tooltip", this.getAttribute("contenttooltip"));
    if (this.hasAttribute("autocompletepopup")) {
        b.setAttribute("autocompletepopup", this.getAttribute("autocompletepopup"));
    }
    b.setAttribute("autoscrollpopup", this._autoScrollPopup.id);
    var stack = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "stack");
    stack.setAttribute("anonid", "browserStack");
    stack.appendChild(b);
    stack.setAttribute("flex", "1");
    var notificationbox = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "notificationbox");
    notificationbox.setAttribute("flex", "1");
    notificationbox.appendChild(stack);
    var position = this.tabs.length - 1;
    var uniqueId = "panel" + Date.now() + position;
    notificationbox.id = uniqueId;
    t.linkedPanel = uniqueId;
    t.linkedBrowser = b;
    t._tPos = position;
    if (t.previousSibling.selected) {
        t.setAttribute("afterselected", true);
    }
    this.mPanelContainer.appendChild(notificationbox);
    this.tabContainer.updateVisibility();
    var tabListener = this.mTabProgressListener(t, b, blank);
    const filter = Components.classes['@mozilla.org/appshell/component/browser-status-filter;1'].createInstance(Components.interfaces.nsIWebProgress);
    filter.addProgressListener(tabListener, Components.interfaces.nsIWebProgress.NOTIFY_ALL);
    b.webProgress.addProgressListener(filter, Components.interfaces.nsIWebProgress.NOTIFY_ALL);
    this.mTabListeners[position] = tabListener;
    this.mTabFilters[position] = filter;
    b._fastFind = this.fastFind;
    b.droppedLinkHandler = handleDroppedLink;
    var evt = document.createEvent("Events");
    evt.initEvent("TabOpen", true, false);
    t.dispatchEvent(evt);
    if (!blank) {
        b.stop();
        b.userTypedValue = aURI;
        let flags = Ci.nsIWebNavigation.LOAD_FLAGS_NONE;
        if (aAllowThirdPartyFixup) {
            flags |= Ci.nsIWebNavigation.LOAD_FLAGS_ALLOW_THIRD_PARTY_FIXUP;
        }
        if (aFromExternal) {
            flags |= Ci.nsIWebNavigation.LOAD_FLAGS_FROM_EXTERNAL;
        }
        try {
            b.loadURIWithFlags(aURI, flags, aReferrerURI, aCharset, aPostData);
        } catch (ex) {
        }
    }
    b.docShell.isActive = false;
    if ((aRelatedToCurrent == null ? aReferrerURI : aRelatedToCurrent) &&
        Services.prefs.getBoolPref("browser.tabs.insertRelatedAfterCurrent")) {
        let newTabPos = (this._lastRelatedTab || this.selectedTab)._tPos + 1;
        if (this._lastRelatedTab) {
            this._lastRelatedTab.owner = null;
        } else {
            t.owner = this.selectedTab;
        }
        this.moveTabTo(t, newTabPos);
        this._lastRelatedTab = t;
    }
    if (0 == b.sessionHistory.count && aReferrerURI) {
        TabHistory.copyHistory(this.selectedTab, t);
    }
    return t;
}