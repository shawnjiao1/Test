
/*================================================================================================================================================
Copyright (c) 2008-2015 by BIMiner Technologies Inc, All rights reserved.
Description: flowchart with div and canvas
Revisions: Initialized 2017-2-22
=================================================================================================================================================*/

var Flowchart = function(element) {
	// div
	this.element = element;
	this.element.control = this;

	// canvas
	this._canvas = element.getElementsByTagName("canvas")[0];
	this._context = this._canvas.getContext("2d");
	this._cornerRadius = 20;

	this.initialize();
};

Flowchart.prototype = $.extend(Flowchart.prototype, {
	initialize: function() {
	},

	dispose: function() {
	},

	draw: function(data) {
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			if (obj.Type == 1) {
				this._createRectangle(obj);
			}
			if (obj.Type == 4) {
				var as = eval(obj.Description);
				this._createLine(as, obj.Left, obj.Top, obj.Arrow);
			}
			if (obj.Type == 5) {
				this._createRoundedRectangle(obj);
			}
			if (obj.Type == 6) {
				this._createRectangleWithText(obj);
			}
			if (obj.Type == 7) {
				this._createArc(obj);
			}
			if (obj.Type == 8) {
				var as = eval(obj.Description);
				this._createRectWithLine(as, obj.Left, obj.Top, obj.Arrow, obj.Background_Color);
			}
			if (obj.Type == 10) {
				if (obj.Field_Type == "BAS") {
					var x = obj.Left;
					var y = obj.Top;
					var z = obj.Width / 150;
					var f = obj.Flip;
					var c = obj.Background_Color;
					
					this._createBasketballCourt(x, y, z, f, c) 
				}
			}
		}
	},

	_createRoundedRectangle: function(obj) {
		// area size and cornerRadius
		var rectX = obj.Left;
		var rectY = obj.Top;
		var rectWidth = obj.Width;
		var rectHeight = obj.Height;

		// Set faux rounded corners
		this._context.lineJoin = "round";
		this._context.lineWidth = this._cornerRadius;

		// set color
		this._context.strokeStyle = obj.Background_Color;
		this._context.fillStyle = obj.Background_Color;

		// Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
		this._context.strokeRect(rectX + (this._cornerRadius / 2), rectY + (this._cornerRadius / 2), rectWidth - this._cornerRadius, rectHeight - this._cornerRadius);
		this._context.fillRect(rectX + (this._cornerRadius / 2), rectY + (this._cornerRadius / 2), rectWidth - this._cornerRadius, rectHeight - this._cornerRadius);
	},

	_createRectangle: function(obj) {
		var e = document.createElement("div");
		e.className = "bp";
		e.style.width = obj.Width + "px";
		e.style.height = obj.Height + "px";
		e.style.left = obj.Left + "px";
		e.style.top = (obj.Top) + "px";
		e.innerHTML = obj.Description;
		e.id = 'process_' + obj.Number;
		if (obj.Background_Color != null)
			e.style.backgroundColor = obj.Background_Color;
		if (obj.Text_Color != null)
			e.style.color = obj.Text_Color;
		if (obj.Border_Style != null)
			e.style.borderStyle = obj.Border_Style;
		if (obj.Number == 236) {
			e.style.fontSize = '16px';
			e.style.fontWeight = 'Bold';
			e.style.color = 'rgb(188, 188, 188)';
		}

		this.element.appendChild(e);
	},

	_createLine: function(path, offsetLeft, offsetTop, arrow) {
		for (var i = 0; i < path.length; i++) {
			var a = path[i];
			if (a.length > 1) {
				path[i][0] = path[i][0] + offsetLeft + 0.5;
				path[i][1] = path[i][1] + offsetTop + 0.5;
			}
		}

		this._context.strokeStyle = 'black';
		this._context.fillStyle = 'black';

		this._context.lineWidth = 1;

		var length = path.length;
		// line
		if (length > 1) {
			this._context.beginPath();
			if (path[0].length > 1) {
				this._context.moveTo(path[0][0], path[0][1]);
			}

			for (var i = 1; i < length; i++) {
				if (path[i].length > 1) {
					this._context.lineTo(path[i][0], path[i][1]);
				}
			}
			this._context.stroke();
		}

		// Arrow
		if (arrow != null) {
			var x = path[length - 1][0] + 0.5;
			var y = path[length - 1][1] + 0.5;

			var a = 3; // arrow width 5: 45 degree; 3.5: around 35 degree

			this._context.beginPath();
			this._context.moveTo(x, y);
			if (arrow == 'U') {
				this._context.lineTo(x - a - 1, y + 10);
				this._context.lineTo(x + a, y + 10);
			}
			else if (arrow == 'D') {
				this._context.lineTo(x - a - 1, y - 10);
				this._context.lineTo(x + a, y - 10);
			}
			else if (arrow == 'L') {
				this._context.lineTo(x + 10, y - a - 1);
				this._context.lineTo(x + 10, y + a);
			}
			else if (arrow == 'R') {
				this._context.lineTo(x - 10, y - a - 1);
				this._context.lineTo(x - 10, y + a);
			}
			this._context.closePath();
			this._context.fill();
		}
	},

	_createRectangleWithText: function(obj) {
		var e = document.createElement("div");

		var s = document.createElement("span");
		s.className = "rectext";
		s.style.width = (obj.Width - 20) + "px";
		s.style.height = (obj.Height - 2) + "px";
		s.style.lineHeight = (obj.Height - 2) + "px";
		s.innerHTML = obj.Description;
		if (obj.Text_Color != null)
			s.style.color = obj.Text_Color;
		e.appendChild(s);

		e.className = "rect";
		var widthOffset = 0;
		var heightOffset = 0;
		if (obj.Border_Style != null) {
			e.style.borderStyle = obj.Border_Style;
			if (obj.Border_Style.indexOf("none") != 0)
				heightOffset = 1;
			if (obj.Border_Style.lastIndexOf("none") + 4 != obj.Border_Style.length)
				widthOffset = 1;
		} else {
			widthOffset = 1;
			heightOffset = 1;
		}
		e.style.width = (obj.Width - widthOffset) + "px";
		e.style.height = (obj.Height - heightOffset) + "px";
		e.style.left = obj.Left + "px";
		e.style.top = obj.Top + "px";
		e.id = 'rect_' + obj.Number;
		if (obj.Background_Color != null)
			e.style.backgroundColor = obj.Background_Color;
		if (obj.Overwritten != null)
			e.setAttribute("ov", obj.Overwritten);
		if (obj.Flip != "" && obj.Flip != null)
			e.setAttribute("fl", obj.Flip);
		if (obj.Field_Type != null)
			e.setAttribute("ft", obj.Field_Type);
		
		this.element.appendChild(e);
	}, 
	
	_createArc: function(obj) {
		var centerX = obj.Left;
		var centerY = obj.Top;
		var radius = obj.Width;
		var angle = obj.Height;
		var color = obj.Background_Color;
		var clockwise = obj.Arrow == 1 ? true : false;

		this._context.beginPath();
		this._context.arc(centerX, centerY, radius, 0, Math.PI * angle, clockwise);
		if (color != null) {
			this._context.fillStyle = color;
			this._context.fill();
		}
		this._context.lineWidth = 1;
		this._context.strokeStyle = '#003300';
		this._context.stroke();
	},
	
	_createRectWithLine: function(path, offsetLeft, offsetTop, arrow, color) {
		for (var i = 0; i < path.length; i++) {
			var a = path[i];
			if (a.length > 1) {
				path[i][0] = path[i][0] + offsetLeft + 0.5;
				path[i][1] = path[i][1] + offsetTop + 0.5;
			}
		}

		this._context.strokeStyle = 'black';
		this._context.fillStyle = color;

		this._context.lineWidth = 1;

		var length = path.length;
		// line
		if (length > 1) {
			this._context.beginPath();
			if (path[0].length > 1) {
				this._context.moveTo(path[0][0], path[0][1]);
			}

			for (var i = 1; i < length; i++) {
				if (path[i].length > 1) {
					this._context.lineTo(path[i][0], path[i][1]);
				}
			}
			this._context.stroke();
		}
		this._context.closePath();
		this._context.fill();
	},
	
	_createDashedArc: function(x, y, r, s, e, c) {
		var a = 5 / r;
		if (c == false) {
			for (var i = s; i < e; i += 2 * a) {
				this._context.arc(x, y, r, i, i + ((i + a) > e ? e - i : a), c);
				this._context.moveTo(x + r * Math.cos(i + 2 * a), y + r * Math.sin(i + 2 * a));
			}
		}
		else {
			for (var i = s; i < e; i += 2 * a) {
				this._context.arc(x, y, r, 2 * Math.PI - i, 2 * Math.PI - i - ((i + a) > e ? e - i : a), c);
				this._context.moveTo(x + r * Math.cos(2 * Math.PI - i - 2 * a), y + r * Math.sin(2 * Math.PI - i - 2 * a));
			}
		}
	},
	
	_createBasketballCourt: function(x, y, z, f, c) {
		var bc = [['m', 0, 0], ['l', 150, 0], ['l', 150, 140], ['l', 0, 140], ['l', 0, 0], ['f'],
				  ['m', 51, 0], ['l', 51, 57], ['l', 99, 57], ['l', 99, 0],
				  ['m', 93, 57], ['d', 75, 57, 18, 0, Math.PI, 1],
				  ['m', 93, 57], ['a', 75, 57, 18, 0, Math.PI, 0],
				  ['m', 91, 140], ['a', 75, 140, 16, 0, Math.PI, 1],
				  ['m', 9, 0], ['l', 9, 17],
				  ['m', 141, 0], ['l', 141, 17],
				  ['m', 141, 17], ['a', 75, 17, 66, 0, Math.PI, 0]
				 ];
		
		var bc1 = this._convertBasketballCourt(bc,x,y,z,f,140);
		
		this._createCourt(bc1, c);
	},
	
	_createCourt: function(court, c) {
		for (var i = 0; i < court.length; i++) {
			var d = court[i];
			switch(d[0]) {
				case 'm': 
					this._context.moveTo(d[1], d[2]);
					break;
				case 'l':
					this._context.lineTo(d[1], d[2]);
					break;
				case 'a':
					this._context.arc(d[1], d[2], d[3], d[4], d[5], d[6] == 1);
					break;
				case 'f':
					this._context.fillStyle = c;
					this._context.fill();
					break;
				case 'd':
					this._createDashedArc(d[1], d[2], d[3], d[4], d[5], d[6] == 1);
					break;
				default:
					break;
			}	
		}
		
		this._context.stroke();
	},
	
	_convertBasketballCourt: function (bc,x,y,z,f,q) {
		if (f == 'H')
		{
			for (var i = 0; i < bc.length; i++) {
				bc[i][2] = q - bc[i][2];
				if (bc[i][6] != undefined)
					bc[i][6] = (bc[i][6] + 1) % 2;
			}
		}		
		
		if (z != 1) {
			for (var i = 0; i < bc.length; i++) {
				bc[i][1] = bc[i][1] * z;
				bc[i][2] = bc[i][2] * z;
				if (bc[i][3] != undefined)
					bc[i][3] = bc[i][3] * z;
			}
		}
		if (x != 0) {
			for (var i = 0; i < bc.length; i++) {
				bc[i][1] = bc[i][1] + x;
			}
		}
		if (y != 0) {
			for (var i = 0; i < bc.length; i++) {
				bc[i][2] = bc[i][2] + y;
			}
		}

		return bc;
	}
});