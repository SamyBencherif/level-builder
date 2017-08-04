
var scene = {}; //used to render live preview

var pan = [0,0];
var zoom = 1;

//quality
const Q = 2;

scene.start = function()
{
}

var resizeNeeded = false;

//TODO: update on change only
//currently updates 60 times a second
//maintain 60 fps on continous change like drag/rescale
scene.update = function()
{

	//hook allows for canvas to be resized (while preserving quality settings and updating dimesions)
	if (resizeNeeded)
	{
		ctx.save();
		resize($('#grid')[0], Q);
		ctx.restore();
		resizeNeeded = false;
	}

	ctx.save();
	//apply pan zoom
	ctx.translate(width/2, height/2);
	ctx.scale(zoom, zoom);
	ctx.translate(-width/2, -height/2);
	ctx.translate(pan[0], pan[1]);

	fill("black");
	strokeWeight(0);

	//Snapped Pan
	var snpdPan = [];
	snpdPan[0] = grid_size * Math.round(pan[0]/grid_size);
	snpdPan[1] = grid_size * Math.round(pan[1]/grid_size);

	//Snapped Center (scaled)
	var snpdZCenter = [];
	snpdZCenter[0] = grid_size * Math.round(width/2/grid_size/zoom);
	snpdZCenter[1] = grid_size * Math.round(height/2/grid_size/zoom);


	var xGridMin = width/2-snpdZCenter[0]-snpdPan[0];
	var xGridMax = width/2+snpdZCenter[0]-snpdPan[0]+grid_size/zoom

	var yGridMin = height/2-snpdZCenter[1]-snpdPan[1];
	var yGridMax = height/2+snpdZCenter[1]-snpdPan[1]+grid_size/zoom;

	var xDotCount = (xGridMax-xGridMin)/grid_size;
	var yDotCount = (yGridMax-yGridMin)/grid_size;

	var dotCount = xDotCount*yDotCount;

	/*
	//render grid dots
	fill("black");
	stroke("");
	if (dotCount < 225)
	{
		for (var x=xGridMin; x<xGridMax; x+=grid_size)
		{
			for (var y=yGridMin; y<yGridMax; y+=grid_size)
			{
				if (!(x==width/2 && y==height/2)) //don't put a dot where the cross goes
					circle(x, y, .5/zoom);
			}
		}
	}
	else
	{
		//#TODO: show warning? (not sure about this anymore)
	}
	*/

	//render cross
	strokeWeight(1/zoom);
	stroke("black");
	var crossSize = grid_size/5;
	line(width/2-crossSize,height/2,width/2+crossSize,height/2);
	line(width/2,height/2-crossSize,width/2,height/2+crossSize);

		//render each object (using custom renderer)
		//if an object is selected render grabbers
		for (var i in objects)
		{
			ctx.save();
			ctx.translate(width/2+objects[i].x,height/2+objects[i].y);
			ctx.rotate(objects[i].angle * Math.PI/180);

			//ctx.save();
			//ctx.scale(objects[i].w/100, objects[i].h/100);  //not for a tiled texture!

			objects[i].render(ctx);
			//ctx.restore();

			if (objects[i].selected)
			{

					strokeWeight(1);
					stroke("black");
					fill("rgba(0,0,0,0)");
					rectangle(0, 0, objects[i].w, objects[i].h)

					strokeWeight(1);
					fill("white");

					rectangle(-5, -5, 10, 10);
					rectangle(objects[i].w-5, -5, 10, 10);
					rectangle(-5, objects[i].h-5, 10, 10);
					rectangle(objects[i].w-5, objects[i].h-5, 10, 10);
					/*
					rectangle(0-10, -objects[i].h/2-10, 20, 20);
					rectangle(objects[i].w/2-10, 0-10, 20, 20);
					rectangle(-objects[i].w/2-10, 0-10, 20, 20);
					rectangle(0-10, objects[i].h/2-10, 20, 20);
					*/
			}
			ctx.restore();
		}

//removes pan/zoom (prevents repetative application)
ctx.restore();
}

SimpleRender.run(scene, document.getElementById("grid"), {resolution:Q});
