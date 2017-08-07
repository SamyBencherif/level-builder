//#TODO: deal with z-order better
//#TODO: put hidden css on things that are hidden on load
//(in case scripts load slowly it'll prevent visual bug)

function allowDrop(ev){
	ev.preventDefault();
}

var dragtexture;

function drag(ev){

	//create clone with desired properties of drag texture
	dragtexture = $(ev.target).children('.texture-icon').clone();
	$(document.body).append(dragtexture)

	dragtexture.css({
						'width': 100*zoom + 'px',
						'height': 100*zoom + 'px',
						'position': 'absolute',
						'left': -1000 + 'px',   //make sure it's off screen
						'top': 0 + 'px',		//this will work in chromium anyway!
					});

	//tested safari too!

	ev.originalEvent.dataTransfer.setDragImage(dragtexture[0], 50*zoom, 50*zoom);

	ev.originalEvent.dataTransfer.setData('texture-name', $(ev.target).attr('data-texture-name'));
}

var objectsList; //html object

function drop(ev){

	if (dragtexture) dragtexture.remove();
	dragtexture = undefined;

	ev.preventDefault();

	//var textureHtml = ev.dataTransfer.getData("texture-name");
	//var textureObj = $(textureHtml);

	//var offsetX = parseInt(ev.dataTransfer.getData("offsetX"));
	//var offsetY = parseInt(ev.dataTransfer.getData("offsetY"));

	var x = ev.offsetX-width/2-50*zoom;
	var y = ev.offsetY-height/2-50*zoom;

	//untransform drop point by view
	var noView = (new Point(x,y)).scale(1/zoom, 1/zoom).translate(-pan[0], -pan[1]);

	x = noView.x;
	y = noView.y;

	var snap = $('#snap:checked').length;

	if (snap)
	{
		x = grid_size * Math.round(x/grid_size);
		y = grid_size * Math.round(y/grid_size);
	}

	var lvlObj = new levelObject(x,y)

	lvlObj.texture = ev.dataTransfer.getData("texture-name"); //textureObj.attr('data-texture-name');

	lvlObj.updateRenderer();

	objects.push(lvlObj);
	objectsList.slideDown();


	//unselect all objects
	unselectAllObjects();

	objects[objects.length-1].select();

	//$('#properties').slideDown();
}

function updateGridSize(ev){
	grid_size = parseInt(ev.target.value) || grid_size;
	if (grid_size < 10)
	{
		grid_size=10;
	}
}

//#TODO: this was stupid. object gets deleted when deleteing text. Give canvas focus index
$('#grid').on('keydown', function(ev)
{
	if (ev.keyCode==8)
	{
		var obj;
		if (obj = getSelectedObject())
			obj.remove();
	}
})

/* #TODO remove
$('#new-texture-panel').on('keydown', function(ev)
{

	//eliminates typing and browser shortcuts!
	//ev.preventDefault(); //otherwise cannot hide on {enter}. For some reason..?

	if (ev.keyCode == 13) //enter
	{
		if ($('#new-texture-panel:visible').length != 0)
		{
			createNewTexture();
		}
	}
	if (ev.keyCode == 27) //esc
	{
		if ($('#new-texture-panel:visible').length != 0)
		{
			$('#new-texture-panel:visible').hide();
		}
	}
})
*/

$('#inspector').click(function(){
	unselectAllObjects();
	if ($('.entry-selected').length == 0)
  {
    //nothing was selected
    $('#properties').slideUp();
  }
});

var mouseIsDown = false;
var gripperSelected = -1;
//-1 : <<None>>
//0 : BL
//1 : TL
//2 : BR
//3 : TR

//click to select object
//avoiding anon functions so I can make use of code outline
$('#grid').on('mousedown', function gridMouseDown(ev){

	mouseIsDown = true;
	var prevSelectionObj = getSelectedObject();
	var prevSelection = prevSelectionObj ? prevSelectionObj.index : undefined;
	unselectAllObjects();

	var x = ev.offsetX-width/2;
	var y = ev.offsetY-height/2;

	//select new object
	for (var i in objects)
	{

		var object = objects[i];
		var point = new Point(x,y);

		//untransform point by view
		point.scale(1/zoom, 1/zoom);
		point.translate(-pan[0], -pan[1]);

		//TODO can only select grippers if object is previously selected

		var RL = object.x + object.w - 5;
		var RH = object.x + object.w + 5; //x within R
		var withinR = RL < point.x && point.x < RH;

		var LL = object.x - 5;
		var LH = object.x + 5; //x within L
		var withinL = LL < point.x && point.x < LH;

		var TL = object.y - 5;
		var TH = object.y + 5; //y within T
		var withinT = TL < point.y && point.y < TH;

		var BL = object.y + object.h - 5;
		var BH = object.y + object.h + 5; //y within B
		var withinB = BL < point.y && point.y < BH;

		if ((withinR || withinL) && (withinT || withinB) && prevSelection == i)
		{
			//mouse within gripper
			gripperSelected = withinR*2 + withinT;
			//[[BL,TL],[BR,TR]][withinR][withinT]
		}
		else
		{
			gripperSelected = -1;
		}

		localizePointToObject(point, objects[i]);

		if (((0 < point.x && point.x < 1) && (0 < point.y && point.y < 1)) || gripperSelected != -1)
		{
			object.select();

			//make sure to only select one object
			break;
		}
	}

	if ($('.entry-selected').length == 0)
	{
	//nothing was selected
	$('#properties').slideUp();
	}

});

//gripperSelected key
//-1 : <<None>>
//0 : BL
//1 : TL
//2 : BR
//3 : TR

$('#grid').on('mousemove', function(ev){
	var x = ev.offsetX-width/2;
  	var y = ev.offsetY-height/2;

	var object;
	if (mouseIsDown && (object = getSelectedObject()))
	{
		if (gripperSelected == -1)
		{
			object.x += ev.originalEvent.movementX/zoom;
			object.y += ev.originalEvent.movementY/zoom;
		}
		else
		{
			if (gripperSelected==0)
			{
				object.x += ev.originalEvent.movementX/zoom;
				object.w += -ev.originalEvent.movementX/zoom;
				object.h += ev.originalEvent.movementY/zoom;
			}
			if (gripperSelected==1)
			{
				object.x += ev.originalEvent.movementX/zoom;
				object.y += ev.originalEvent.movementY/zoom;
				object.w += -ev.originalEvent.movementX/zoom;
				object.h += -ev.originalEvent.movementY/zoom;
			}
			if (gripperSelected==2)
			{
				object.w += ev.originalEvent.movementX/zoom;
				object.h += ev.originalEvent.movementY/zoom;
			}
			if (gripperSelected==3)
			{
				object.y += ev.originalEvent.movementY/zoom;
				object.w += ev.originalEvent.movementX/zoom;
				object.h += -ev.originalEvent.movementY/zoom;
			}
		}
		object.updateProperties();
	}
});

$('#grid').on('mouseup mouseleave', function(ev){
	mouseIsDown = false;

	var snap = $('#snap:checked').length;

	var object;
	if (snap && (object = getSelectedObject()))
	{

		//snap position to half grid
		object.x = grid_size * Math.round(object.x/grid_size);
		object.y = grid_size * Math.round(object.y/grid_size);

		if (gripperSelected != -1)
		{
			//snap scale
			object.w = grid_size*Math.round(object.w/grid_size);
			object.h = grid_size*Math.round(object.h/grid_size);
		}
		object.updateProperties();
	}
});

//TODO make variant of pan that works for non 2d scroll users
$('#grid').on('wheel', function(ev){
	ev.preventDefault();

	if (ev.ctrlKey)
	{
		//zoom

		//later script needs to be loaded to access this global variable
		//shouldn't be an issue because DOMevents shouldn't happen till'
		//document is ready and all scripts are loaded (you know probably)
		zoom += -ev.originalEvent.deltaY/120;
		zoom = Math.max(.1, Math.min(3, zoom))
	}
	else {
		//pan
		pan[0] += -ev.originalEvent.deltaX/zoom;
		pan[1] += -ev.originalEvent.deltaY/zoom;
	}
})

function textureInit(textureName, textureIcon){

	//create texture entry
	var newTexture = $(document.createElement('div'));
	newTexture.addClass('entry');

	//newTexture.css({width: '100px', height: '100px'})

	//add icon
	newTexture.append(textureIcon);

	//create label
	var label = $(`<div class="texture-label property-title">${textureName}</div>`)
	newTexture.append(label);

	//create close button
	var close = $(`<div class="glyphicon glyphicon-remove-circle" aria-hidden="true"></div>`)
	close.click(function(){
		if (confirm('Permanently delete this texture?'))
		{
			//#texturedelete
			delete textures[this.attr('data-texture-name')];
			updateTextureDropDown();
			this.remove();
		}
	}.bind(newTexture))
	newTexture.append(close)



	return newTexture;
}

function resetTextureImport()
{
	//selects first tab
	$('#tex-import-dialog .tab-content').hide();
	$('#tex-import-dialog .tab-content[data-tab-index=0]').show();
	$('#tex-import-dialog .tab-selected').removeClass('tab-selected');
	$('#tex-import-dialog ul li').eq(0).addClass('tab-selected')


	//unchecks all checkboxes in dialog
	$('#tex-import-dialog input[type="checkbox"]:checked').prop('checked', false);
	$('#tex-import-dialog .check-rounded-true').removeClass('check-rounded-true');

	//clears tab counts
	$('#tex-import-dialog .count').html("");

	//empties file tab (warning: #couldbreak duplicate definition)
	$('#tex-import-dialog .tab-content[data-tab-index=-1]').html('<input id="textureSelector" type="file" multiple onchange="fileSelected(event);">')
}

function importTextureDialog()
{
	$('#tex-import-dialog').dialog({
		width: 500,
		height: 350,
		buttons: [
			{
			text: "CANCEL",
			click: function dialogCancel()
				{
					resetTextureImport();
					$( this ).dialog( "close" );
				}
			},
			{
			text: "IMPORT",
			click: function dialogImport()
				{
					$('#tex-import-dialog .tab-content').each(function(index, element)
					{
						$(element).find('.img-holder').each(function(index, element)
						{
							if ($(element).find('input[type="checkbox"]:checked').length != 0)
							{
								var name = $(element).attr('data-full-name') || $(element).find('p').html();
								createNewTexture(name, $(element).find('img').attr('src'))
							}
						})
					})

					resetTextureImport();
					$( this ).dialog( "close" );
				}
			},
		]
	});
}

//#TODO sep into own file
function createNewTexture(name, img)
{

	//var newTextureIcon;
	var renderingFormat = $('#texture-creator-image-radio:checked').length ? 'image' : 'color';

	//create a color based texture
	//if (renderingFormat == 'color')
	//	newTextureIcon = $(`<div class="texture-icon" data-rendering-format="color" style="background: ${'#'+$('.jscolor')[0].value};"></div>`);

	//create an image based texture
	//if (renderingFormat == 'image')
	var newTextureIcon = $(`<div class="texture-icon" data-rendering-format="image" ondragstart="drag(event);"
		style="
		background-image: url(${img});
		background-size: 100% 100%;
		"></div>`);

	var pendingTextureName = name;//$('#texture-creator-property-name').val();

	var newTexture = textureInit(pendingTextureName, newTextureIcon); //needs to return newTexture
	newTexture.attr('data-texture-name', pendingTextureName)
	//newTexture.attr('data-rendering-format', renderingFormat);
	newTexture.attr('draggable', 'true');
	newTexture.on('dragstart', drag);

	if (pendingTextureName in textures)
	{
		if (!confirm("Texture already exists. Overwrite?")) //#TODO change this.
			return;
		//#texturedelete / #textureupdate
		textures[pendingTextureName].entry.remove();
	}

	//#texturecreate
	/*
		this.tiled = true;
	this.tileX = 0;
	this.tileY = 0;
	//these defaults aren't terribly as they overriden by setRenderer to equal texture dimensions
	this.tileSx = 100;
	this.tileSy = 100;
	this.tileDx = 100;
	this.tileDy = 100;
	this.texW = 100;
	this.texH = 100;
	*/
	textures[pendingTextureName] = {
		tiled: true,
		tileX: 0,
		tileY: 0,
		tileSx : 100,
		tileSy : 100,
		tileDx : 100,
		tileDy : 100,
		texW : 100,
		texH : 100
	}


	var imRef = img;

	//careful distinction between this.image and image
	textures[pendingTextureName].image = new Image();

	//hacky but better than what I had before
	textures[pendingTextureName].image.src = imRef.replace('url(','').replace(')','').replace(/\"/gi, "");


	textures[pendingTextureName].image.addEventListener('load', function(){

		textures[pendingTextureName].texW = parseInt(textures[pendingTextureName].image.width);
		textures[pendingTextureName].texH = parseInt(textures[pendingTextureName].image.height);

		textures[pendingTextureName].tileSx = textures[pendingTextureName].tileDx * textures[pendingTextureName].texW/100;
		textures[pendingTextureName].tileSy = textures[pendingTextureName].tileDy * textures[pendingTextureName].texH/100;

	});



	textures[pendingTextureName].render = function(ctx)
	{
		tex = textures[pendingTextureName]

		if (!tex.tiled)
			ctx.drawImage(tex.image,
							0,
							0,
							this.w,
							this.h);
		else //tiled
		{
			for (var x=0; x<this.w; x+=tex.tileDx)
			{
				for (var y=0; y<this.h; y+=tex.tileDy)
				{
					ctx.drawImage(tex.image,
								tex.tileX,
								tex.tileY,
								tex.tileSx*Math.min(tex.tileDx, this.w-x)/tex.tileDx,
								tex.tileSy*Math.min(tex.tileDy, this.h-y)/tex.tileDy,
								x,
								y,
								Math.min(tex.tileDx, this.w-x),
								Math.min(tex.tileDy, this.h-y));
				}
			}
		}
	}

	textures[pendingTextureName]['entry'] = newTexture;
	//textures[pendingTextureName]['image'] = newTextureIcon;
	updateTextureDropDown();

	//new texture
	$('#texture-container').append(newTexture)
	//close dialog
	$('#new-texture-panel').hide();

	globallyUpdateTextures();

}

//These initialize textures that exist on window load (currently none)
$('.texture').each(textureInit)
updateTextureDropDown();

$('#new-texture-panel').draggable({'handle': '.title-bar'});
$('#new-texture-panel').hide();

objectsList = $('#objects-list');

$('#properties').hide();
$('#objects-list').hide();

//temporary debug thing #TODO remove
/*
var funImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARSSURBVHhe7ZxbUtNQHMazA5fgEnxVrpWbCGVcgk8qCgJeuCMVqDO+8eIo6iCioqhc5CIgVVmCS3AJLCHmS5P6t3xO0jbn5LQhM7+HJiHJ95uT5GuG1Cqeco/bzuSyPVcc5nPZ9BE4zKZ/OZ/tWiCfJZ/L+Tz/Pdt9FZm9+HzKPUpncnM9x8Ubq3mQ2cnuafg75UeJa9BdcS/Tae9Mtdtb460uX8Za7I2RVE2ALH4uZNyb7rQP59Ju7sNsz5KnJD85M53TpsfefdBBN5YEkN0bGPOulJ+z6XOYAYPsD5LE9mSbO3p+ZLvOWhg+mMFWTCJw4Y6a/UznEVshycCJ5Rg6FVMERo21NdH2iy1MOtbpRZdjsZkM3PP3H14u4N3a7IPZbvvlrXr7ybXzRvLiZp3LYl+9/eFOE83GCCXmYKarIOJ/vBlqpgdmGhDEMhYTKMa7fYXi03Cr/fp2o1FABMCoeXbjgivn3WAjzSoJFCNPmzBsjnfQAzQFnPYQxLJKAsWw8EF8mbxED8oUFnpjEgMgZ3mgiR5Y3Cz2Ndhr95tpXh9lYsDXTJexclhWiVIxwFQ5LKtEuRiwP9Ntr9xJ0QOMC5ZVokUM+DabNkoOyyrRJgZAzvu7F+mB6oZllQSK2ZkurceEwYQiyLJKAsU8ve7c8ycKj/0iI245LKskUIz/HWNtrJ0GrIQ4iyDLKgkUI785fxxppQErIS45LKskUAw2gqboy8G3aBawEranOrV3HZZVEkoMUC1HdxFkWSWhxYBX/Q3OxTgvB6cYHlKxkOWiUw7LKilJDFhSLEdXEWRZJSWLAZDjP/RZ6K2LvOvokMOySsoS44PnGpCDrqNCzur9FrrfKGBZJRWJAc+dEePLqaYiyLJKKhYDZNdRUQQ/j7bR/VYCyyqJRAyotiLIskoiEwNUd50o5bCskkjFANVydp2LfBRdh2WVRC4GVEMRZFklSsQA1UUQct4ONtN9h4FllSgTA0wugiyrRKkYH9VFsBw5LKtEixigsghCTqlFkGWVaBMDVBfBUuSwrBKtYoBqOevONtl+i2FZJdrFABOKIMsqiUUMiFsOyyqJTQyQRXCxv1FrEWRZJbGKATqKIJPDskpiFwNkEYScqLsO5BR3HZZVYoQYH51FkGWVGCUGyCK4NXWJhiwXKYdllRgnBugogiyrxEgxQLUcllVirBigsuuwrBKjxQBVclhWifFigIoiyLJKqkIMiLoIsqySqhEDoiyCLKukqsT4RFEEWVZJoBi8qcEOLm4qKYJ4zYhllQSKWb2r5/9VyqHcroOX0lhWSaAYsDJUO3LCjBYQSgzAa3PLA/zg4iZM18GL5qX8EoG1MZw6ZguSDsScvnddjOPE2hxJZejCBLM5nBq01u+1nGULk8ynUe+HdtZHUvNshSSCM8iV4k/rw6kltmKSgANPx78Tzq1E3qWczCdGSvGEa453av0+sYHa4zeEFK4phcmy/gD9+xtnVhO0rAAAAABJRU5ErkJggg==";

createNewTexture('fun', funImg)

var lvlObj = new levelObject(-50,-50)

lvlObj.texture = 'fun';
lvlObj.updateRenderer();

objects.push(lvlObj);
objectsList.slideDown();

//unselect all objects
unselectAllObjects();

objects[objects.length-1].select();
*/