/*
function showImgRepPreview()
{
	var picker = $('#type-rep-img-picker')[0]
	if ('files' in picker)
	{
		if (picker.files.length > 0)
		{
			$('#type-creator-property-name').val(picker.files[0].name.replace(/\.[^/.]+$/, ""));
			var reader = new FileReader();
			reader.readAsDataURL(picker.files[0]);
			reader.onload = function (ev)
			{
				$('#img-type-rep-preview').attr('src', ev.target.result);
			}
		}
	}
}

function renderCodePreview(func, ctx)
{
	ctx.clearRect(0,0,200,200);
	ctx.save();
	ctx.scale(2,2);
	ctx.translate(50,50);
	func(ctx);
	ctx.restore();
}

var previewInterval;
*/

/*
function showCodeRepPreview()
{
	if (previewInterval!=undefined)
		clearInterval(previewInterval);

	var ctx = $('#code-type-rep-preview')[0].getContext('2d');
	var dummyctx = document.createElement('canvas').getContext('2d');
	var code = $('#code-input').val();
	try
	{
		var func = Function('ctx', code);
		$('#code-input').css({'border': 'none'});

		try
		{
			func(dummyctx);
			//success!

			previewInterval = setInterval(function(){renderCodePreview(func, ctx)}, 1000/60)
		}
		catch(e)
		{
			//runtime error
			$('#code-input').css({'border': '1px solid rgba(255, 0, 0, 0.53)'});
		}
	}
	catch(e)
	{
		//"compile" error
		$('#code-input').css({'border': '1px solid red'});
	}
}
*/

/*
function showRepOptions(ev)
{
var repOptions = $('#repOptions')
switch (ev.target.value)
{
case 'Color':
	repOptions.html(`<span class="property-title">color</span> <input class="jscolor" value="e02b51">`)
	//revalidate color picker
	$('.jscolor').each(function(){new jscolor(this);})
	break;
case 'Image':
	//#TODO: customize file input https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
	repOptions.html(`<span class="property-title">image</span> <input id="type-rep-img-picker" type="file" onchange="showImgRepPreview();"> <br> <img id="img-type-rep-preview"></img>`)
	break;
case 'Function':
	//#TODO: have user code compute width
	repOptions.html(`<span class="property-title">javascript code</span><br>
<textarea id="code-input" oninput="showCodeRepPreview();">
ctx.fillStyle="rgb(224, 43, 81)";
ctx.fillRect(-50,-50,100,100);

ctx.fillStyle="rgb(22, 43, 141)";
ctx.fillRect(0,-50,50,100);

var t=(new Date()).getTime()/1000;
ctx.fillStyle="green";
ctx.beginPath();
ctx.arc(0,0,10+10*(Math.sin(4*t)+1)/2,0,2*Math.PI);
ctx.fill();
</textarea><br>
<canvas id="code-type-rep-preview"></canvas>`);
	$('#code-type-rep-preview')[0].width = 200;
	$('#code-type-rep-preview')[0].height = 200;
	showCodeRepPreview()
	break;
}
$('#new-type-panel').center();
}
*/
/*
function createNewType()
{
	//var newTypeIcon;
	var renderingFormat = $('#type-creator-image-radio:checked').length ? 'image' : 'color';

	//create a color based type
	//if (renderingFormat == 'color')
	//	newTypeIcon = $(`<div class="type-icon" data-rendering-format="color" style="background: ${'#'+$('.jscolor')[0].value};"></div>`);

	//create an image based type
	//if (renderingFormat == 'image')
	var newTypeIcon = $(`<div class="type-icon" data-rendering-format="image" ondragstart="drag(event);"
		style="
		background-image: url(${$('#img-type-rep-preview').attr('src')});
		background-size: 100% 100%;
		"></div>`);

	var pendingTypeName = $('#type-creator-property-name').val();

	var newType = typeInit(pendingTypeName, newTypeIcon); //needs to return newType
	newType.attr('data-type-name', pendingTypeName)
	//newType.attr('data-rendering-format', renderingFormat);
	newType.attr('draggable', 'true');
	newType.on('dragstart', drag);

	if (pendingTypeName in types)
	{
		if (!confirm("Type already exists. Overwrite?"))
			return;
		//#typedelete / #typeupdate
		types[pendingTypeName].parent().remove();
	}

	//#typecreate
	types[pendingTypeName] = newTypeIcon;
	updateTypeDropDown();

	//new type
	$('#type-container').append(newType)
	//close dialog
	$('#new-type-panel').hide();

	globallyUpdateTypes();

}
*/