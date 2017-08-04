var objects = [];
var textures = [];

var grid_size=50;

function updateTextureDropDown(){

    //clear drop down
    $('#property-texture').html("");


	// #TODO add (none) texture
	// $('#property-texture').append(`<option value="${textureName}">${textureName}</option>`);

    //populate drop down
    for (var textureName in textures)
    {
        $('#property-texture').append(`<option value="${textureName}">${textureName}</option>`);
    }
}

function unselectAllObjects(){
	for (var i in objects)
	{
		objects[i].unselect();
	}
}

function globallyUpdateTextures(){
	for (var i in objects)
	{
		objects[i].updateNameNTexture();
	}
}

function getSelectedObject(){
	for (var i in objects)
	{
		if (objects[i].selected)
		{
			return objects[i];
		}
	}
}

function localizePointToObject(point, object){

	//untransform point by object
	point.translate(-object.x, -object.y);
	point.rotate(-object.angle*Math.PI/180);
	point.scale(1/object.w, 1/object.h);
}

function Point(x,y){
	this.x = x;
	this.y = y;

	this.rotate = function(a)
	{
		var r = Math.sqrt(this.x*this.x + this.y*this.y);
		var ca = Math.atan2(this.y, this.x);
		var na = ca + a;

		this.x = r*Math.cos(na);
		this.y = r*Math.sin(na);

		return this; //now chainable!
	}

	this.scale = function(xf, yf)
	{
		this.x *= xf;
		this.y *= yf;

		return this; //now chainable!
	}

	this.translate = function(xf, yf)
	{
		this.x += xf;
		this.y += yf;

		return this; //now chainable!
	}
}