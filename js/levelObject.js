function levelObject(x,y)
{
	this.x = x;
	this.y = y;

	this.w = 100;
	this.h = 100;

	this.angle = 0;

	this.name = "";
	this.texture = "";

	//these are references not a values //trying switch to out-scoping
	//this.objects = objects;
	//this.textures = textures;

	this.index = objects.length;

	this.entry = $(`
		<div class="entry"><span class="entry-title"></span>
			<div class="glyphicon glyphicon-remove-circle" aria-hidden="true"></div>
		</div>
		`);

	$('#objects-list').append(this.entry);

	this.selected = false;

	this.updateRenderer = function()
	{
		//this happens on every select. seems redundant. #TODO: fix
		if (this.texture in textures)
		{
			this.render = function(ctx)
			{
				textures[this.texture].render.apply(this, [ctx]);
			}
		}
		else
		{
			//unknown texture
			this.render = function(ctx) //make this nigglet tilable too
				{
					ctx.strokeStyle = "black";
					ctx.fillStyle = "white";
					ctx.lineWidth = 1;
					ctx.strokeRect(0,0,this.w,this.h);
					ctx.fillRect(0,0,this.w,this.h);

					ctx.fillStyle = "black";
					ctx.textAlign = "center";
					ctx.fillText("No Texture", this.w/2, this.h/2);
				};
		}
	}

	this.updateNameNTexture = function()
	{
		this.entry.children('.entry-title').html(`${this.name} <span style="color: rgba(255, 255, 255, 0.35)">&lt;${this.texture}&gt;</span>`);
		this.entry.attr('title', this.name + " ".repeat(this.name!="") + "<" + this.texture + ">");

		//textures[this.texture].attr('data-rendering-format')=='color'

		//change render function
		//this.setRenderer(textures[this.texture]);
	}

	this.reassignIndices = function()
	{
		/*make sure object's index is correct*/
		for (var i in objects)
			objects[i].index = i;
	}

	//object to dom
	this.updateProperties = function()
	{
		$('#property-name').val(this.name);
		$('#property-x').val(this.x);
		$('#property-y').val(this.y);
		$('#property-w').val(this.w);
		$('#property-h').val(this.h);
		$('#property-angle').val(this.angle);
		$('#property-texture').val(this.texture);

		if (textures[this.texture].tiled)
		{
			$('#property-tiled').prop('checked', true)
			$('#tilingProperties').show()
		}
		else
		{
			$('#property-tiled').prop('checked', false)
			$('#tilingProperties').hide()
		}

		$('#property-tiling-x').val(textures[this.texture].tileX);
		$('#property-tiling-y').val(textures[this.texture].tileY);
		$('#property-tiling-sx').val(textures[this.texture].tileSx);
		$('#property-tiling-sy').val(textures[this.texture].tileSy);
		$('#property-tiling-dx').val(textures[this.texture].tileDx);
		$('#property-tiling-dy').val(textures[this.texture].tileDy);
	}

	this.unselect = function()
	{
		//$('#properties').hide();
		//$('#properties').slideUp();

		this.selected = false;
		this.entry.removeClass('entry-selected');

		//remove all property events

		//undo dom to object
		$('#properties > .properties-container').children().each(removeInputEvent.bind(this));
		$('#properties > .properties-container > #tilingProperties').children().each(removeInputEvent.bind(this));

		function removeInputEvent(index,element)
		{
			if (element.value != undefined)
			{
				$(element).off()
			}
		}
	}

	this.select = function()
	{
		$('#properties').slideDown();

		//this.reassignIndices();

		/*push object to end of list so if
		objects are overlapping subsequent
		clicks will pick different object*/
		objects.push(objects.splice(this.index,1)[0]);
		this.reassignIndices();

		//mark object as selected
		this.selected = true;
		this.entry.addClass('entry-selected');

		//show objects properties in ui
		this.updateProperties();
		this.updateNameNTexture();

		//dom to object
		//add events to property text boxes to change object's properties
		$('#properties > .properties-container').children().each(createInputEvent.bind(this));
		$('#properties > .properties-container > #tilingProperties').children().each(createInputEvent.bind(this));

		//#TODO: there is no reason to make a all ecompassing event that contains a switch case!
		//this should be many smaller events
		function createInputEvent(index,element)
		{
			if (element.value != undefined)
			{
				$(element).on('focus', function(ev){$(ev.target).select()})  //select textbox when clicked
				$(element).on('input change', function(){
					const v = $(element).val();
					switch (element.id)
					{
						//dynamic approach idea:

						//default
						//this.${element.id, without property...} = parseFloat(v);
						//break

						//if element has attr('data-transfer-policy')
						//Function('htmlelement', 'levelobject', attr(...))(element, this)

						//probably not going to that anymore.

						case 'property-name':
							this.name = v;
							this.updateNameNTexture();
							break;
						case 'property-x':
							this.x = parseInt(v);
							break;
						case 'property-y':
							this.y = parseInt(v);
							break;
						case 'property-w':
							this.w = parseFloat(v);
							break;
						case 'property-h':
							this.h = parseFloat(v);
							break;
						case 'property-angle':
							this.angle = parseFloat(v);
							break;
						case 'property-texture':
							this.texture = v;
							this.updateNameNTexture();
							break;
						case 'property-tiled':
							textures[this.texture].tiled = !!$('#property-tiled:checked').length;

							//show additional properties
							if ($('#property-tiled:checked').length)
								$('#tilingProperties').show()
							else
								$('#tilingProperties').hide()
							//reset those properties. wait. actually no don't.
							break;
						case 'property-tiling-x':
							textures[this.texture].tileX = parseInt(v);
							break;
						case 'property-tiling-y':
							textures[this.texture].tileY = parseInt(v);
							break;
						case 'property-tiling-sx':
							textures[this.texture].tileSx = parseInt(v);
							break;
						case 'property-tiling-sy':
							textures[this.texture].tileSy = parseInt(v);
							break;

						//Non terminating render loop if this is 0 (!!)
						case 'property-tiling-dx':
							textures[this.texture].tileDx = parseInt(v) || 1;
							break;
						case 'property-tiling-dy':
							textures[this.texture].tileDy = parseInt(v) || 1;
							break;
					}
				}.bind(this))
			}
		}
	}

	this.remove = function()
	{
		if (this.selected)
		{
			$('#properties').slideUp();
		}

		//this.reassignIndices();
		this.entry.remove();
		objects.splice(this.index, 1);
		this.reassignIndices();
	}

	this.entry.click(function(ev)
	{
		unselectAllObjects();
		ev.stopPropagation();
	});
	this.entry.click(this.select.bind(this));

	this.entry.children('.glyphicon-remove-circle').click(function(ev)
	{
		if (objects.length == 1)
			objectsList.slideUp(); //#TODO: hide inspector (and deal with canvas bug)
		ev.stopPropagation();
	}.bind(this));
	this.entry.children('.glyphicon-remove-circle').click(this.remove.bind(this));
}