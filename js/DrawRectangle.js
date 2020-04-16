
Function.prototype.bind = function(obj){
    var _method = this;
    return function(){
        _method.apply(obj, arguments);
    }
};

DrawRectangle = function(id, onMouseUp, className){
    this.IMG = document.getElementById(id);
    this.isDraw = false;
    this.isMouseUp = true;
    this.index = 0;
    this.currentDrawRectangle = null;
	this.className = className;

    this.RectangleDivs = [];

    this.debug = false;

    this._onMouseUp = onMouseUp;

    this.bindListener();
};

DrawRectangle.prototype = {
    bindListener: function(){

        this.IMG.onmousemove = this.dragSize.bind(this);
        this.IMG.onmouseup = this.onMouseUp.bind(this);
        this.IMG.onmouseout = this.onMouseOut.bind(this);
        this.IMG.onmouseover = this.onMouseOver.bind(this);
        this.IMG.onmousedown = this.drawLayer.bind(this);
        this.IMG.onmouseup = this.onMouseUp.bind(this);
    },
    drawLayer: function(){
        this.IMG.setCapture(true);
        this.isDraw = true;
        this.ismouseup = false;
        this.index++;

        var pos = this.getSourcePos();

		var x = event.offsetX;
        var y = event.offsetY;

        var top = y + pos.top - 2;
        var left = x + pos.left - 2;

        var d = document.createElement("div");
        document.body.appendChild(d);
        d.style.border = "1px solid #ff0000";
        d.style.width = 0;
        d.style.height = 0;
        d.style.overflow = "hidden";
        d.style.position = "absolute";
        d.style.left = left;
        d.style.top = top;
		if(this.className) {
			d.className = this.className;
		}
        d.id = "draw" + this.index;
        if (this.debug) {
            //d.innerHTML = "<div class='innerbg'>x:" + x + ",y:" + y + ". img_x:" + img_x + ",img_y:" + img_y + ".</div>";
        }

        this.currentDrawRectangle = d;

        this.RectangleDivs[this.index] = {
            left: left,
            top: top,
            el: d
        };
    },
    getSourcePos: function(){
        return this.getAbsolutePosition(this.IMG);
    },
    dragSize: function(){
        if (this.isDraw) {
            if (event.srcElement.tagName !== "IMG")
                return;

            var pos = this.getSourcePos();
            var img_x = pos.top;
            var img_y = pos.left;
            var x = event.offsetX;
            var y = event.offsetY;
            var drawW = (x + img_x) - this.RectangleDivs[this.index].left;
            var drawH = (y + img_y) - this.RectangleDivs[this.index].top;
            this.currentDrawRectangle.style.width = drawW > 0 ? drawW : -drawW;
            this.currentDrawRectangle.style.height = drawH > 0 ? drawH : -drawH;
            if (drawW < 0) {
                this.currentDrawRectangle.style.left = x + img_x;
            }
            if (drawH < 0) {
                this.currentDrawRectangle.style.top = y + img_y;
            }

            if (this.debug) {
                this.currentDrawRectangle.innerHTML = "<div class='innerbg'>x:" + x + ",y:" + y +
                ". img_x:" +
                img_x +
                ",img_y:" +
                img_y +
                ". drawW:" +
                drawW +
                ",drawH:" +
                drawH +
                ".  Dleft[i]:" +
                this.RectangleDivs[this.index].left +
                ",Dtop[i]:" +
               this.RectangleDivs[this.index].top +
                "src:" +
                event.srcElement.tagName +
                ".</div>";
            }

        }
        else {
            return false;
        }
    },

    stopDraw: function(){
        this.isDraw = false;
    },

    onMouseOut: function(){
        if (!this.isMouseUp) {
            this.isDraw = false;
        }
    },

    onMouseUp: function(){
        this.isDraw = false;
        this.isMouseUp = true;
        this.IMG.releaseCapture();

		if(this._onMouseUp) {
			this._onMouseUp.call(this, this.currentDrawRectangle);
		}
    },

    onMouseOver: function(){
        if (!this.isMouseUp) {
            this.isDraw = true;
        }
    },

    getAbsolutePosition: function(obj){
        var t = obj.offsetTop;
        var l = obj.offsetLeft;
        var w = obj.offsetWidth;
        var h = obj.offsetHeight;

        while (obj = obj.offsetParent) {
            t += obj.offsetTop;
            l += obj.offsetLeft;
        }

        return {
            top: t,
            left: l,
            width: w,
            height: h
        }
    }
};