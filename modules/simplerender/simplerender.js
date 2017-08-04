/*
SimpleRender v1.1

v1.1
-strokeWeight(0) now works
-run takes options now
	-resolution: quality of canvas

Created by Samy Bencherif

Inspired by the following lovely programming environments:
Pythonista (http://omz-software.com/pythonista/)
Processing (https://processing.org/)
Unity3d (https://unity3d.com/)

High level graphics rendering is a bit insane, but fun.
Designed to be used as a teaching tool.

Like these:
http://origamijs.com/docs/
http://paperjs.org/
*/

var SimpleRender = {};

SimpleRender.distance = function(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

//set the fill color
SimpleRender.fill = function(color){
	ctx.fillStyle = color;
	if (ctx.lineWidth==0)
		ctx.strokeStyle = ctx.fillStyle;
}

//set the stroke/outline color
SimpleRender.stroke = function(color){
	ctx.strokeStyle = color;
}

//set the thickness of lines/paths/outlines
SimpleRender.strokeWeight = function(thickness){
	ctx.lineWidth = thickness;
	if (thickness==0)
		ctx.strokeStyle = ctx.fillStyle;
}

//draw a rectangle
SimpleRender.rectangle = function(x,y,w,h){
	//ctx.fillRect(x,y,w,h);
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x+w,y);
	ctx.lineTo(x+w,y+h);
	ctx.lineTo(x,y+h);
	ctx.lineTo(x,y);
	if (ctx.fillStyle)
	  ctx.fill();
	if (ctx.strokeStyle)
		ctx.stroke();
}

//draw a line
SimpleRender.line = function(x1,y1,x2,y2){
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2)
	ctx.stroke();
}

//draw a circle
SimpleRender.circle = function(x,y,r){
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	if (ctx.fillStyle)
	  ctx.fill();
	if (ctx.strokeStyle)
		ctx.stroke();
}

SimpleRender.showCurveGuides = function(){
	curveGuidesVisable = true;
}

SimpleRender.hideCurveGuides = function(){
	curveGuidesVisable = false;
}

//separate poly and curve. done. Now there's beginCurve
//use mvto and ln to for poly
//use add control point for n-curve (or whatever)
SimpleRender.beginPoly = function(){
	ctx.beginPath();
}

//clear ACC
SimpleRender.beginCurve = function(x,y)
{
	curvePoints = [];
	if (curveGuidesVisable)
	{
		fill("blue")
		ctx.fillRect(x,y,5,5);
	}
}

//?? distinguish acc? 3-grouped array
//curve

SimpleRender.addControlPoint = function(cpx, cpy){

	curvePoints.push(0,cpx,cpy);

	if (curveGuidesVisable)
	{
		fill("orange")
		ctx.fillRect(cpx,cpy,5,5);
	}
}

SimpleRender.addPoint = function(x,y){

	curvePoints.push(1,x,y);

	if (curveGuidesVisable)
	{
		fill("blue")
		ctx.fillRect(x,y,5,5);
	}
}

SimpleRender.moveTo = function(x,y)
{
	ctx.moveTo(x,y);
}

SimpleRender.lineTo = function(x,y)
{
	ctx.lineTo(x,y);
}

SimpleRender.fillShape = function()
{
	ctx.fill();
}

SimpleRender.strokeShape = function()
{
	ctx.stroke();
}

//for curve:
	//for loop
	//over percentage (w/ curve density)
	//

//TODO:

//timing *.
//width and height *
//ellipse
//transformation system
//polygon([x1,y1,x2,y2], closed)
//curves
	//bezier
//basic effects (check css effects for inspiration)

//resize event *
//mouse events
//keyboard events
//events are so needlessly redundant as of now

//This is actually 2BL@B stuff
//cube? (just use someone else's 3d module and wrap it in)
//globs
//

SimpleRender.resize = function(element, res)
{
	if (res==undefined) res = 1;

	canvas.width = res*element.clientWidth;
	canvas.height = res*element.clientHeight;
	width = element.clientWidth;
	height = element.clientHeight;
	canvas.style.width = element.clientWidth + "px";
	canvas.style.height = element.clientHeight + "px";
}

//Entry Point
SimpleRender.run = function(scene, element, options) //, element
{

	if (options==undefined)
	{
		options = {resolution: 1}
	}

	for(key in this){
		eval(key + " = " + this[key] + ";");
	}

	//initialize a canvas in `element`.
	canvas = document.createElement('canvas');
	element.appendChild(canvas);

	window.addEventListener('resize', function(){resize(element, options.resolution)})

	element.addEventListener('mousemove', function(ev){
		mouse = ev;
	})

	this.element = element;
	canvas.style.display = "block";

	//document.body.appendChild(canvas);

	//get that context baby
	ctx = canvas.getContext('2d');

	//set defaults
	ctx.lineWidth = 1;

	_t = Date.now();
	t = 0;

	fps = 60;
	dt = 1/60;

	//event vars
	mouse = new MouseEvent("");
	keycode = -1;

	/* ***** Parameters ***** */

	fpsIndependant = false;
			/*
			When fpsIndependant is true, `dt` and `t` timing variables
			will include lag time. This may cause jumps in animations,
			but will guarantee that the animation doesn't run faster
			or slower than expected.
			*/

	clearColor = "white";

	curveGuidesVisable = false;

	curvePoints = [];

	this.resize(element, options.resolution);

	//width = size[0];
	//height = size[1];

	ctx.save();
	ctx.scale(options.resolution, options.resolution);
	scene.start();
	ctx.restore();

	setInterval
  (
		function()
		{

			ctx.save();
			ctx.scale(options.resolution, options.resolution);

			if (fpsIndependant)
				dt = (Date.now()-_t)/1000;
			_t = Date.now();
			t += dt;

			//?? not working:
			ctx.fillStyle = clearColor;
			ctx.fillRect(0,0,width,height);

			scene.update();
			ctx.restore();
		}, 1000/fps
	)
}

/*
scene = {}
scene.start = function(){}
scene.update = function(){}

SimpleRender.run(scene, document.body);
*/
