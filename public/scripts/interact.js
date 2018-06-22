var fieldNum = 2;
var kimonoStyle = false;
var regSizes = ['S', 'M', 'L', 'XL'];
var kimonoSizes = ['SM', 'LXL'];

function selectAll(source){
	checkboxes = document.getElementsByName('size[]');
	for(var i=0; i<checkboxes.length; i++) {
    checkboxes[i].checked = source.checked;
  }
};

function addColorFields(){
	var container = document.getElementById('colorFields');
	var colorField = document.createElement('input');
	var colorFieldCode = document.createElement('input');
	var pictureLink = document.createElement('input');
	colorField.type = 'text';
	colorField.name = 'colorSet[color' + fieldNum + '][colorName]';
	colorField.placeholder = 'Color';
	colorFieldCode.type = 'text';
	colorFieldCode.name = 'colorSet[color' + fieldNum + '][colorCode]';
	colorFieldCode.placeholder = 'Color Code';
	pictureLink.type = 'text';
	pictureLink.name = 'colorSet[color' + fieldNum + '][pictureLink]';
	pictureLink.placeholder = 'Image Link';

	container.appendChild(document.createElement('br'));
	container.appendChild(colorField);
	container.appendChild(colorFieldCode);
	container.appendChild(pictureLink);
	fieldNum++;
};

function kimonoSizeToggle(){
	if(kimonoStyle == false){
		regSizes.forEach(function(size){
			var deleteSize = document.querySelectorAll('input[value=' + size + ']');
			deleteSize.parentNode.removeChild(deleteSize);
		});
	}
};