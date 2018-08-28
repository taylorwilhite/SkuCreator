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

function fillColorCode(event){
	var colorIndex = event.target.name.replace(/\[colorName\]/, '[colorCode]');
	var foundCode = clientColorList.find(function(selected) {
		return selected.color === event.target.value
	}).colorCode;
	document.querySelector("input[name='" + colorIndex + "']").value = foundCode;
};

function addColorFields(){
	var container = document.getElementById('colorFields');
	var colorDiv = document.createElement('div');
	var colorField = document.createElement('input');
	var colorFieldCode = document.createElement('input');
	var pictureLink = document.createElement('input');
	var fbColorField = document.createElement('input');
	var delButton = document.createElement('button');
	colorField.type = 'text';
	colorField.name = 'colorSet[color' + fieldNum + '][colorName]';
	colorField.classList.add('colorName');
	colorField.placeholder = 'Color';
	colorField.setAttribute('list', 'colorNameList');
	colorField.setAttribute('onchange', 'fillColorCode(event)');
	colorFieldCode.type = 'text';
	colorFieldCode.name = 'colorSet[color' + fieldNum + '][colorCode]';
	colorFieldCode.placeholder = 'Color Code';
	colorFieldCode.setAttribute('readonly', '');
	pictureLink.type = 'text';
	pictureLink.name = 'colorSet[color' + fieldNum + '][pictureLink]';
	pictureLink.placeholder = 'Image Link';
	fbColorField.type = 'text';
	fbColorField.name = 'colorSet[color' + fieldNum + '][fbColor]';
	fbColorField.placeholder = 'FB Color Number';
	delButton.classList.add('delete-color');
	delButton.type = 'button';
	delButton.onclick = removeColorField;
	delButton.innerHTML = 'Delete';

	
	colorDiv.appendChild(colorField);
	colorDiv.appendChild(colorFieldCode);
	colorDiv.appendChild(pictureLink);
	colorDiv.appendChild(fbColorField);
	colorDiv.appendChild(delButton);
	container.appendChild(colorDiv);
	fieldNum++;
};

function removeColorField(){
	var colorDiv = this.parentNode;
	var colorFields = colorDiv.parentNode;
	colorFields.removeChild(colorDiv);
};

function sendData(url, formId){
	var form = document.getElementById(formId);

	var formData = {}
	formData.color = form[0].value;
	formData.colorCode = form[1].value;
	console.log(formData);

	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData)
	})
	.then(response => {return response.json()})
	.then(data => console.log(data.body));
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

function validateColors(){
	var checkedColors = document.getElementsByClassName('colorName');
	var colorsArr = Array.from(checkedColors)
	for(i = 0; i < colorsArr.length; i++){
		console.log(colorsArr[i].value);
		var colorChecked = clientColorList.find(arrColor => {return arrColor.color.toUpperCase() === colorsArr[i].value.toUpperCase()});
		if(colorChecked == undefined){
			alert('One or more Colors is not in the system. Please correct your colors.');
			return false;
		};
	};
};