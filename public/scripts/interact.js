/* eslint-env browser */
/* global clientColorList */
let kimonoStyle = false;
const regSizes = ['XL', 'L', 'M', 'S'];
const kimonoSizes = ['LXL', 'SM'];
let fieldNum = 2;

function selectAll(source) { // eslint-disable-line no-unused-vars
  const checkboxes = document.getElementsByName('size[]');
  for (let i = 0; i < checkboxes.length; i += 1) {
    checkboxes[i].checked = source.checked;
  }
}

function fillColorCode(event) { // eslint-disable-line no-unused-vars
  const colorIndex = event.target.name.replace(/\[colorName\]/, '[colorCode]');
  const foundCode = clientColorList.find(
    selected => selected.color === event.target.value,
  ).colorCode;
  document.querySelector("input[name='" + colorIndex + "']").value = foundCode;
}

function addBookFields() {
  const container = document.getElementById('bookFields');
  const bookDiv = document.createElement('div');
  const number = document.createElement('input');
  const title = document.createElement('input');
  const supplier = document.createElement('select');
  const brand = document.createElement('select');
  const material = document.createElement('input');
  const care = document.createElement('input');
  const image = document.createElement('input');
  const weight = document.createElement('input');

  const fields = [number, title, supplier, brand, material, care, image, weight];
  const textFields = [number, title, material, care, image, weight];

  bookDiv.classList.add('fabricBookFieldset');
  fields.forEach((field) => {
    field.name = `fabricBooks[${fieldNum}][${field}]`;
  });

  textFields.forEach((field) => {
    field.type = 'text';
    field.placeholder = `${field}`;
  });

  bookDiv.appendChild(number);
  bookDiv.appendChild(title);
  bookDiv.appendChild(material);
  bookDiv.appendChild(care);
  bookDiv.appendChild(image);
  bookDiv.appendChild(weight);
  container.appendChild(bookDiv);

  fieldNum += 1;
}

function removeColorField() {
  const colorDiv = this.parentNode;
  const colorFields = colorDiv.parentNode;
  colorFields.removeChild(colorDiv);
}

function addColorFields() { // eslint-disable-line no-unused-vars
  const container = document.getElementById('colorFields');
  const colorDiv = document.createElement('div');
  const colorField = document.createElement('input');
  const colorFieldCode = document.createElement('input');
  const pictureLink = document.createElement('input');
  const fbColorField = document.createElement('input');
  const delButton = document.createElement('button');
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
  fieldNum += 1;
}

function makeColor(data) {
  const container = document.getElementById('main-container');
  const tempFlash = document.createElement('div');
  const tempMessage = document.createElement('p');
  tempFlash.classList.add('alert', 'temp-flash');

  if (data.success) {
    // create new color in list
    clientColorList.push(data.success);
    const dataList = document.getElementById('colorNameList');
    const newColorOption = document.createElement('option');
    newColorOption.value = data.success.color;
    dataList.appendChild(newColorOption);

    // display confirmation
    tempMessage.innerHTML = 'Option Added Successfully!';
    tempFlash.classList.add('alert-success');
  } else {
    // check for error and display error flash
    tempMessage.innerHTML = data.error;
    tempFlash.classList.add('alert-error');
  }
  tempFlash.appendChild(tempMessage);
  container.insertAdjacentElement('afterbegin', tempFlash);
}

function sendData(url, formId) { // eslint-disable-line no-unused-vars
  const form = document.getElementById(formId);

  const formData = {};
  formData.color = form[0].value;
  formData.colorCode = form[1].value;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => makeColor(data));
}

function deleteSizes(size) {
  const deleteSize = document.querySelector('input[value=' + size + ']');
  const sizeLabel = deleteSize.parentNode;
  sizeLabel.parentNode.removeChild(sizeLabel);
}

function addSizes(size) {
  const sizeField = document.getElementById('sizeContainer');
  const labelContent = document.createTextNode(size);
  const sizeLabel = document.createElement('label');
  const sizeCheck = document.createElement('input');
  sizeCheck.type = 'checkbox';
  sizeCheck.name = 'size[]';
  sizeCheck.value = size;
  sizeLabel.appendChild(labelContent);
  sizeLabel.prepend(sizeCheck);
  sizeField.prepend(sizeLabel);
}

function kimonoSizeToggle() { // eslint-disable-line no-unused-vars
  if (kimonoStyle === false) {
    regSizes.forEach(size => deleteSizes(size));
    kimonoSizes.forEach(size => addSizes(size));
  } else {
    kimonoSizes.forEach(size => deleteSizes(size));
    regSizes.forEach(size => addSizes(size));
  }
  kimonoStyle = !kimonoStyle;
}


function validateColors() { // eslint-disable-line no-unused-vars
  const checkedColors = document.getElementsByClassName('colorName');
  const colorsArr = Array.from(checkedColors);
  for (let i = 0; i < colorsArr.length; i += 1) {
    const colorChecked = clientColorList.find(
      arrColor => arrColor.color.toUpperCase() === colorsArr[i].value.toUpperCase(),
    );
    if (colorChecked === undefined) {
      alert('One or more Colors is not in the system. Please correct your colors.');
      return false;
    }
  }
}
