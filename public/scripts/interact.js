var fieldNum = 2;

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
	colorField.type = 'text';
	colorField.name = 'colorSet[color' + fieldNum + '][color]';
	colorField.placeholder = 'Color';
	colorFieldCode.type = 'text';
	colorFieldCode.name = 'colorSet[color' + fieldNum + '][colorCode]';
	colorFieldCode.placeholder = 'Color Code';
	container.appendChild(document.createElement('br'));
	container.appendChild(colorField);
	container.appendChild(colorFieldCode);
	fieldNum++;
};