var fieldNum = 2;
var kimonoStyle = false;
var regSizes = ['XL', 'L', 'M', 'S'];
var kimonoSizes = ['LXL', 'SM'];

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
			deleteSizes(size);
		});
		kimonoSizes.forEach(function(size){
			addSizes(size);
		});
	} else {
		kimonoSizes.forEach(function(size){
			deleteSizes(size);
		});
		regSizes.forEach(function(size){
			addSizes(size);
		});
	}
	kimonoStyle = !kimonoStyle;
};

function deleteSizes(size){
	var deleteSize = document.querySelector('input[value=' + size + ']');
	var sizeLabel = deleteSize.parentNode;
	sizeLabel.parentNode.removeChild(sizeLabel);
};

function addSizes(size){
	var sizeField = document.getElementById('sizeContainer');
	var labelContent = document.createTextNode(size);
	var sizeLabel = document.createElement('label');
	var sizeCheck = document.createElement('input');
	sizeCheck.type = 'checkbox';
	sizeCheck.name = 'size[]';
	sizeCheck.value = size;
	sizeLabel.appendChild(labelContent);
	sizeLabel.prepend(sizeCheck);
	sizeField.prepend(sizeLabel);
};