
//thx <3 https://stackoverflow.com/a/27023848/1727470
$('#tabs ul')[0].addEventListener('mousewheel', function(event) {
	// We don't want to scroll below zero or above the width and height
	var maxX = this.scrollWidth - this.offsetWidth;
	var maxY = this.scrollHeight - this.offsetHeight;

	// If this event looks like it will scroll beyond the bounds of the element, prevent it and set the scroll to the boundary manually
	if (this.scrollLeft + event.deltaX < 0 ||
			this.scrollLeft + event.deltaX > maxX ||
			this.scrollTop + event.deltaY < 0 ||
			this.scrollTop + event.deltaY > maxY) {

			event.preventDefault();

			// Manually set the scroll to the boundary
			this.scrollLeft = Math.max(0, Math.min(maxX, this.scrollLeft + event.deltaX));
			this.scrollTop = Math.max(0, Math.min(maxY, this.scrollTop + event.deltaY));
	}
});

function texture_import_show_tab(ev, n)
{
	$('.tab-content').hide();
	$('.tab-content[data-tab-index=' + n + ']').show();

	$('#tabs').children('ul').children().each(function unselectTab(index, element)
	{
		$(element).removeClass('tab-selected');
	})

	//make an add class. then make first one selected in terms of whats already there
	$(ev.target).closest('li').addClass('tab-selected');

	//background: #456ef4
}

$('#dialog').dialog({
	width: 500,
	height: 350,
	buttons: [
		{
		text: "CANCEL",
		click: function dialogCancel()
			{
				$( this ).dialog( "close" );
			}
		},
		{
		text: "IMPORT",
		click: function dialogImport()
			{
				$( this ).dialog( "close" );
			}
		},
	]
});

$( "#tabs" ).tabs();

function addCheckbox(index, element)
{
	$(element).append($(`
	<div>
		<label class="check-rounded"></label>
		<input type="checkbox">
	</div>`))
}

//adds checkbox to each image
$('.tab-content').children('.img-holder').each(addCheckbox)

function toggleImage(ev)
{
	ev.stopPropagation();

	var checkbox;
	var label = $(ev.target);
	if (label.is('label'))
		checkbox = label.parent().children('input[type=checkbox]');
	else
	{
		checkbox = label.parent().children('div').children('input[type=checkbox]');
		label = label.parent().children('div').children('label');
	}

	checkbox.prop('checked', !checkbox.prop('checked'))

	label[checkbox.prop('checked') ? 'addClass' : 'removeClass']('check-rounded-true')

	var selectedCount = $('.tab-content:visible').find('input[type=checkbox]:checked').length;

	if (selectedCount)
		$('.tab-selected a .count').html(' (' + selectedCount + ')');
	else
		$('.tab-selected a .count').html('');
}

//add click to toggle
$('.check-rounded, .img-holder').click(toggleImage)

function trim(x)
{
	return x.substring(0,11) + (x.length > 11 ? '...' : '');
}

function fileSelected(ev)
{
	var picker = $('#textureSelector')[0];
	if ('files' in picker)
	{
		for (var i=0; i<picker.files.length; i++)
		{
			var file = picker.files[i];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (ev)
			{
				var name = this.name.replace(/\.[^/.]+$/, "");

				name = trim(name)

				var newImg = $(`<div class="img-holder"><img src="${ev.target.result}"><p>${name}</p></div>`)

				addCheckbox(-1, newImg[0])
				newImg.click(toggleImage)
				newImg.find('.check-rounded').click(toggleImage);

				$('.tab-content:visible')
					.append(newImg);

			}.bind(file)
		}
	}
}