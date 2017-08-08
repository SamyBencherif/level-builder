
function exportLvl()
{
	var cleanObjects = []
	for (var i in objects)
	{
		cleanObj = {}
		for (var p in objects[i])
		{
			if (p!='entry' && p!='selected')
				cleanObj[p] = objects[i][p]
		}
		cleanObjects.push(cleanObj);
	}
	var lvl = JSON.stringify(cleanObjects);
	$('#export-dialog p').html(lvl);
	$('#export-dialog').dialog();
}

$( "#file-menu" ).menu({
	position: { my: "left top", at: "left bottom" }
});

$( "#file-menu" ).show();
