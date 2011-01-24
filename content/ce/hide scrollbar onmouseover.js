
		//hide scrollbar onmouseover
				var slf=this
				this.containerElement.addEventListener("mouseover",
				this.scrollHack=function(){	
					slf.containerElement.removeEventListener("mouseover",slf.scrollHack,true)
					slf.scrollPropertyadder()
					delete slf.scrollHack					
				},true)
				
		//hide scrollbar onmouseover
			,scrollPropertyadder: function(){		
				var u=document.createElement('scrollbar')
				u.style.display='none'
				document.documentElement.appendChild(u)
				var domUtils=Components.classes["@mozilla.org/inspector/dom-utils;1"].getService(Components.interfaces.inIDOMUtils)
				var inspectedRules=domUtils.getCSSStyleRules(u)

				for(var i = 0; i < inspectedRules.Count(); ++i){
					var rule = inspectedRules.GetElementAt(i)
					var s=rule.parentStyleSheet
					if(s.href=='chrome://global/content/xul.css'){
						break
					}
				}
				var cssRules=s.cssRules,csstext='.smart-text > scrollbar { display: none ! important; }'
				for(i=s.cssRules.length-1;i>=0;--i)
					if(cssRules[i].cssText==csstext)
						break
				if(i<0)
					s.insertRule(csstext,s.cssRules.length)

				this.smartLayer.style.overflowX='scroll'
				u.parentNode.removeChild(u)
				
				return //
				var findStylesheet=function(){
					var href='chrome://smarttext/content/ce/urlbar.css'
					var ss = window.document.styleSheets;
					for (var i = ss.length - 1; i >= 0; i--){
						var ahref=ss[i].href
						if (ahref&& ahref.indexOf(href)>-1) 
							return ss[i]    
					}
				}
				var ss=findStylesheet().cssRules[0].cssRules
				var csstext=''
				for (var i = ss.length - 1; i >= 0; i--){      
					  if (ss[i].selectorText.indexOf('div.anonymous-div')>-1) 
					   csstext+=ss[i].style.cssText 
					}
				this.inputElement.editor.rootElement.style.cssText=csstext
			}