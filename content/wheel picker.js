function ConvertHsvRgb(a, b, c) {
    if(a<0) a+=360;
    var d = Math.floor(a/60) % 6,
        e=a/60-Math.floor(a/60);
    a=c*(1-b);
    var f=c*(1-e*b);
    b=c*(1-(1-e)* b);
    var g, h, k;
    switch (d) {
		case 0: g = c; h = b; k = a; break;
		case 1: g = f; h = c; k = a; break;
		case 2: g = a; h = c; k = b; break;
		case 3: g = a; h = f; k = c; break;
		case 4: g = b; h = a; k = c; break;
		case 5: g = c; h = a; k = f; break
    }
    return {r: g, g: h, b: k, a: 1}
}

function ConvertRgbHsv(a, b, c) {
    var d, e = Math.max(a, b, c),
        f = Math.min(a, b, c);
    if (e === f) d = 0;
    else if (e === a) d = (60 * (b - c) / (e - f) + 360) % 360;
    else if (e === b) d = 60 * (c - a) / (e - f) + 120;
    else if (e === c) d = 60 * (a - b) / (e - f) + 240;
    return {h: d, s: e === 0 ? 0 : 1 - f / e, v: e, a: 1}
}
var CssColours = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
	
	graytext: '#6d6d6d'
};

function ColourWheel(a) {
    this.div = document.createElement("panel");
	//this.div.setAttribute('noautohide', 'true')
	this.div.setAttribute('noautofocus', 'true')
    this.canvas = document.createElementNS("http://www.w3.org/1999/xhtml",'canvas')
	
    this.height = this.width = a;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.div.appendChild(this.canvas);
    this.outer = this.height;
    this.inner = this.height * 0.8;
    if(ColourWheel[a])this.data=ColourWheel[a];    
	else{
		var H=this.outer/2,ctx=this.ctx,R=Math.PI*2,O=R*(1/360)
		//ctx.fillStyle = "rgb(0, 10, 0)";
		//ctx.fillRect(0, 0, H, H);		
		ctx.translate(H, H);
			
		for(var i=0; i<360; i++){  
			ctx.beginPath();
			ctx.moveTo(H, 0);  ctx.lineTo(H/2, 0);
			ctx.lineTo(H/2,2); ctx.lineTo(H, 4);
			ctx.fillStyle=Color.HSV2RGBString(i/360,1,1);
			ctx.fill();
			ctx.rotate(O);    
		}
		ctx.beginPath();
		ctx.fillStyle = "#77b08e";
		ctx.arc(0, 0, this.inner/2, 0, 2 * Math.PI, false);
/*		
var g=ctx.createRadialGradient(0,0,0,0,0,H)
g.addColorStop(0,'rgba(255,255,255,1)')
g.addColorStop(0.5,'rgba(255,255,255,1)')
ctx.fillStyle=g*/		
		this.ctx.fill();
		
		ctx.translate(-H, -H);
		this.data = this.ctx.getImageData(0, 0, this.outer, this.outer)
	}
	//
    this.hsv = {h: 229,s: 0.17,v: 0.8,a: 1};
    this.rgb = ConvertHsvRgb(this.hsv.h, this.hsv.s, this.hsv.v);
	this.orighsv = {h: 229,s: 0.17,v: 0.8,a: 1};
    this.origrgb = ConvertHsvRgb(this.hsv.h, this.hsv.s, this.hsv.v);
    this.update();
    this.draw();
   // var i = this;
    this.buttonDown = false;
    this.mouseArea = "";   
	this.canvas.addEventListener('mousedown',this,true)

}
ColourWheel.prototype = {
    setFromColour: function (a) {
        if (a in CssColours) a = CssColours[a];
        var b, c;
        c = /\#([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])/i.exec(a);
        if (c == null) {
			this.ctx.fillStyle='graytext'
			this.ctx.fillStyle=a
			this.ctx.fillRect(0,0,4,4)
			var data=this.ctx.getImageData(0,0,3,3).data
			a = data[5*4+0] / 255
			b = data[5*4+1] / 255
			c = data[5*4+2] / 255
			//  data[5*4+3] / 255		
		}else{
			a = parseInt(c[1], 16) / 255;
			b = parseInt(c[2], 16) / 255;
			c = parseInt(c[3], 16) / 255
        }
		
        this.hsv = ConvertRgbHsv(a, b, c);
        this.rgb={r:a,g:b,b:c}
		this.origrgb={r:a,g:b,b:c}
        this.draw();
        this.update()
    },
	update: function () {
        function a(c) {
            c = Math.round(c * 255).toString(16);
            if (c.length === 1) c = "0" + c;
            return c
        }
        var b="#"+a(this.rgb.r)+a(this.rgb.g)+a(this.rgb.b);
        this.onUpdate && this.onUpdate(b)
    },
	draw: function(){
       this.ctx.save();
        this.ctx.lineWidth = 1;
        //this.ctx.fillStyle = "rgb(128, 128, 128)";
        //this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.putImageData(this.data, 0, 0);
        var a = this.hsv.h / 180 * Math.PI;
        this.ctx.beginPath();
        var b = {
				x: Math.cos(a) * this.inner / 2 + this.outer / 2,
				y: Math.sin(a) * this.inner / 2 + this.outer / 2
			},
            c = {
                x: Math.cos(a + 2 * Math.PI / 3) * this.inner / 2 + this.outer / 2,
                y: Math.sin(a + 2 * Math.PI / 3) * this.inner / 2 + this.outer / 2
            },
            d = {
                x: Math.cos(a + 4 * Math.PI / 3) * this.inner / 2 + this.outer / 2,
                y: Math.sin(a + 4 * Math.PI / 3) * this.inner / 2 + this.outer / 2
            },
            e = {
                x: Math.cos(a) * this.outer / 2 + this.outer / 2,
                y: Math.sin(a) * this.outer / 2 + this.outer / 2
            };
        a = {
            x: c.x + (d.x - c.x) / 2,
            y: c.y + (d.y - c.y) / 2
        };
        this.ctx.moveTo(b.x, b.y);
        this.ctx.lineTo(c.x, c.y);
        this.ctx.lineTo(d.x, d.y);
        this.ctx.lineTo(b.x, b.y);
        var f = this.ctx.createLinearGradient(c.x, c.y, d.x, d.y);
        f.addColorStop(0, "#ffffff");
        f.addColorStop(1, "#000000");
        this.ctx.fillStyle = f;
        this.ctx.fill();
		
        f = this.ctx.createLinearGradient(b.x, b.y, a.x, a.y);
        var g = ConvertHsvRgb(this.hsv.h, 1, 1);
        g.a = 1;
        f.addColorStop(0, this.rgbToString(g));
        g.a = 0;
        f.addColorStop(1, this.rgbToString(g));
        this.ctx.fillStyle = f;
        this.ctx.fill();
        
		this.ctx.strokeStyle = this.hsv.h<=15||this.hsv.h>205?'#FFF':'#000'
        this.ctx.beginPath();
        this.ctx.moveTo(b.x, b.y);
        this.ctx.lineTo(e.x, e.y);
        this.ctx.stroke();
        f = 1 - this.hsv.v;
        e = this.hsv.s * b.x + f * d.x + (1 - this.hsv.s - f) * c.x;
        f = this.hsv.s * b.y + f * d.y + (1 - this.hsv.s - f) * c.y;
		//draw circle
		this.rgb = ConvertHsvRgb(this.hsv.h, this.hsv.s, this.hsv.v);

		var y=0.3*this.rgb.r+0.59*this.rgb.g+0.11*this.rgb.b
		this.ctx.strokeStyle= y<=0.45?'#FFF':'#000'
        this.ctx.beginPath();			
        this.ctx.arc(e, f, 4, 0, 2 * Math.PI, false);
        this.ctx.stroke();
		this.ctx.restore();
		//
        this.p1 = b;
        this.p2 = c;
        this.p3 = d;
        this.mid = a;
        this.rgb.a = this.hsv.a	
		//
		function ak(c) {
            c = Math.round(c * 255);
            if (c.length === 1) c = "0" + c;
            return c
        }
		var H=this.outer
		//1
		this.ctx.beginPath();	
		this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, 0.2*H);
        this.ctx.lineTo(0.2*H, 0);
        this.ctx.lineTo(0, 0);		
		this.ctx.fillStyle = "rgb("+[ak(this.rgb.r),ak(this.rgb.g),ak(this.rgb.b)]+")";	
		this.ctx.fill();
		//2
		this.ctx.beginPath();	
		this.ctx.moveTo(H, 0);
        this.ctx.lineTo(0.8*H, 0);
        this.ctx.lineTo(H, 0.2*H);
        this.ctx.lineTo(H, 0);		
		this.ctx.fillStyle = "rgb("+[ak(this.origrgb.r),ak(this.origrgb.g),ak(this.origrgb.b)]+")";	
		this.ctx.fill();
		//3
		this.ctx.beginPath();	
		this.ctx.moveTo(0, H);
        this.ctx.lineTo(0, 0.8*H);
        this.ctx.lineTo(0.2*H, H);
        this.ctx.lineTo(0, H);		
		this.ctx.fillStyle = "rgb("+[ak(this.origrgb.r),ak(this.origrgb.g),ak(this.origrgb.b)]+")";	
		this.ctx.fill();
		//4
		this.ctx.beginPath();	
		this.ctx.moveTo(H, H);
        this.ctx.lineTo(H, 0.8*H);
        this.ctx.lineTo(0.8* H, H);
        this.ctx.lineTo(H, H);		
		this.ctx.fillStyle = "rgb("+[ak(this.origrgb.r),ak(this.origrgb.g),ak(this.origrgb.b)]+")";	
		this.ctx.fill();

    },
	rgbToString: function (a) {
        return "rgba(" + Math.round(a.r * 255) + "," + Math.round(a.g * 255) + "," + Math.round(a.b * 255) + "," + a.a + ")"
    },
	calcClick: function (a, b) {
		if(!this.mouseArea){
			var ho=this.outer/2;
			var clX=a-ho,clY=b-ho
			var c = Math.sqrt(clX*clX+clY*clY);
			if(c>ho){//out of ring
				     if(clX+clY>1.6)	this.mouseArea="tr"
				else if(clX+clY<-1.6)   this.mouseArea="bl"				
				else if(clX-clY>1.6)	this.mouseArea="tl"			
				else if(clX-clY<-1.6)   this.mouseArea="br"
				else                    this.mouseArea="ring"
			}else if(c>this.inner/2){//ring
				this.mouseArea="ring"
			}else{//inside ring
				var trans=function(point){return {x:point.x-ho,y:point.y-ho}}
				var p1=trans(this.p1)
				ho=this.inner/2
				var c1=(p1.x*clX+p1.y*clY)/ho/c
				if(c1<0.5)c1=(-c1+Math.sqrt(3-3*c1*c1))/2
				if(c1<0.5)c1=(-c1+Math.sqrt(3-3*c1*c1))/2
				//console.log(c1)
				c1=1/(c1+Math.sqrt(3-3*c1*c1))
				this.mouseArea= (c>=0.5*(1+c1)*ho)? "ring":"triangle"
			}
		}
		
		if(this.mouseArea === "ring") {
            this.hsv.h = Math.atan2(this.outer/2-b, this.outer/2-a)/Math.PI*180+180;
            if (this.hsv.s === 0) {
                this.hsv.s = 1;
                this.hsv.v = 1
            }
            this.mouseArea = "ring"
        }else {
            var d, e = this.p1, c = this.p2, f = this.p3;
            d = (e.x - f.x) * (c.y - f.y) - (c.x - f.x) * (e.y - f.y);
            c = ((c.y - f.y) * (a - f.x) - (c.x - f.x) * (b - f.y)) / d;
            d = (-(e.y - f.y) * (a - f.x) + (e.x - f.x) * (b - f.y)) / d;
            d = 1 - Math.max(0, c) - Math.max(0, d);
            this.hsv.s = Math.min(Math.max(c, 0), 1);
            this.hsv.v = 1 - Math.min(Math.max(d, 0), 1);
            this.mouseArea = "triangle"
        }
        this.draw();
        this.update()
    },

	handleEvent: function(event){
	//console.log(ert=event)
		switch(event.type){
			case 'mousemove':
				this.calcClick(event.clientX - this.pos.left, event.clientY- this.pos.top )
				break;
			case 'mousedown':
				this.setCapture&&this.setCapture(true)
				window.addEventListener('mousemove',this,true)
				window.addEventListener('mouseup',this,true)
				this.pos=this.canvas.getBoundingClientRect()
				this.calcClick(event.clientX - this.pos.left, event.clientY- this.pos.top )
				this.buttonDown = true;
				break;
			case 'mouseup':
				//alert(this.mouseArea)
				window.removeEventListener('mousemove',this,true)
				window.removeEventListener('mouseup',this,true)
				this.buttonDown = false;
				this.mouseArea = ""
				break;
		}	
	}
};


window.addEventListener( "load", DOMContentLoaded = function() {
	window.removeEventListener( "load", DOMContentLoaded, false );
	onReady();
}, false );

onReady=function(){
	t=Date.now()
	window.picker=new ColourWheel(256)
	var body=document.documentElement
	body.appendChild(picker.div)	
	
	var textboxes=document.getElementsByAttribute('type','color')
	for(var i=textboxes.length;i--;){
		wrapColorTextbox(textboxes[i])
	}
}

wrapColorTextbox=function(textbox){	
	var c=textbox.nextSibling
	c.textbox=textbox
	textbox.c = c
	c.style.background = textbox.value
	textbox.__defineSetter__('value',valueSetter)
	textbox.__defineGetter__('value',valueGetter)
	c.setAttribute('onclick', 'openColorPicker(this)')
	textbox.setAttribute('oninput', 'onPickerInput(this)')
	textbox.setAttribute('oncommand', 'onPickerInput(this)')
}
var gTimerId = null
function scheduleUpdate(time){
	if(gTimerId===null)
		gTimerId = setTimeout(function(){applyStyleSheet();gTimerId=null},time||100)
}
function onPickerInput(t){
	t.c.style.background = t.inputField.value
	scheduleUpdate()
}
function valueSetter(v){
	this.inputField.value = v
	this.c.style.background = v
	scheduleUpdate()
	return v
}
function valueGetter(){
	return this.inputField.value
}

openColorPicker=function(el){
	var b = picker, el = el.textbox
	b.onUpdate=function(d){
		if(this.el&&this.el.style){
			this.el.value=d
		}
	}
	b.el=el
	dump(el.value)
	b.setFromColour(el.value);
	
	var popupBoxObject = b.div.popupBoxObject;
	popupBoxObject.setConsumeRollupEvent(popupBoxObject.ROLLUP_NO_CONSUME);
	//b.div.openPopup(el, 'overlap', 100, 0, false, false);
	b.div.openPopup(el.c, 'overlap', 20, 0, false, false);
	//b.el.addEventListener('blur',function(e){b.el.removeEventListener('blur',arguments.callee,false),b.div.hidePopup()},false)
}

var Color ={
	HSV2RGB: function(h, s, v){
		if (h + 0.0000000001 >= 1) {h = 0}
		h *= 6;
		var i = parseInt(h, 10),
			f = h - i,
			p = v * (1 - s),
			q = v * (1 - s * f),
			t = v * (1 - s * (1 - f)),
			r, g, b;
		switch(i){
			case 0: r=v; g=t; b=p; break;
			case 1: r=q; g=v; b=p; break;
			case 2: r=p; g=v; b=t; break;
			case 3: r=p; g=q; b=v; break;
			case 4: r=t; g=p; b=v; break;
			case 5: r=v; g=p; b=q; break;
		}
		return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
	},
  
	HSV2RGBString: function(h, s, v){
		var rgb = this.HSV2RGB(h, s, v);
		return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
	},

	RGB2HSV: function(r, g, b){
		var max   = Math.max(r, g, b),
			min   = Math.min(r, g, b),
			delta = max - min,
			s     = (max=== 0)? 0: 1-(min/max),
			v     = max, h;
		switch(max){
		   case min: h=0; break;
		   case r:   h=(g-b)/delta;
					 if(g<b){h+=6}
					 break;
		   case g:   h=2+(b-r)/delta; break;
		   case b:   h=4+(r-g)/delta; break;
		}
		return {h: h/6, s: s, v: v/255};
	},
	
	RGB2hex: function(rgb){
		return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + (rgb.b << 0)).toString(16).substr(-6).toUpperCase();
	},
	hex2RGB: function(hex){
		if (hex.length == 3){hex= hex.replace(/(.)/g, '$1$1')}
		var val = parseInt(hex, 16);
		return {r: (val & 0xFF0000) >> 16, g: (val & 0xFF00) >> 8, b: val & 0xFF};
	},
	hex2HSV: function(hex){
		var {r,g,b}=this.hex2RGB(hex.substr(1))
		return this.RGB2HSV(r,g,b)
	}
	

};

