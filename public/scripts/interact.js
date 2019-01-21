/* eslint-env browser */
/* global clientColorList */
let kimonoStyle = false;
const regSizes = ['XL', 'L', 'M', 'S'];
const kimonoSizes = ['LXL', 'SM'];
let fieldNum = 2;

const bookFields = {
  container: 'bookFields',
  namePrefix: 'fabricBooks',
  fields: [
    { name: 'number', element: 'input', attributes: { placeholder: 'Fabric Book Number', type: 'text' } },
    { name: 'title', element: 'input', attributes: { placeholder: 'Title', type: 'text' } },
    { element: 'label', labelFor: 'supplier', text: 'Supplier: ' },
    { name: 'supplier', element: 'select', options: ['Juju', 'J&H', 'Larry', 'Lara Fashion'] },
    { element: 'label', labelFor: 'brand', text: 'Brand: ' },
    { name: 'brand', element: 'select', options: ['AMARYLLIS', 'AMA By Amaryllis', 'REFLECTION'] },
    {
      name: 'material',
      element: 'input',
      attributes: {
        onchange: 'fillCareInstruction(event)', placeholder: 'Material Content', type: 'text', required: 'true', list: 'materialList',
      },
    },
    { name: 'care', element: 'input', attributes: { placeholder: 'Care Instructions', type: 'text' } },
    { name: 'weight', element: 'input', attributes: { placeholder: 'Weight (in oz)', type: 'text' } },
    { name: 'image', element: 'input', attributes: { placeholder: 'Image Link', type: 'text' } },
  ],
};

const colorFields = {
  container: 'colorFields',
  namePrefix: 'colorSet',
  fields: [
    {
      name: 'colorName',
      element: 'input',
      attributes: {
        onchange: 'fillColorCode(event)', placeholder: 'Color', type: 'text', required: 'true', list: 'colorNameList',
      },
    },
    { name: 'colorCode', element: 'input', attributes: { placeholder: 'Color Code', type: 'text', readonly: 'true' } },
    { name: 'pictureLink', element: 'input', attributes: { placeholder: 'Image Link', type: 'text' } },
    { name: 'fbColor', element: 'input', attributes: { placeholder: 'FB Color Number', type: 'text' } },

  ],
};

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

function fillCareInstruction(event) { // eslint-disable-line no-unused-vars
  const materialIndex = event.target.name.replace(/\[material\]/, '[care]');
  const foundCode = clientMaterialList.find(
    selected => selected.material === event.target.value,
  ).care;
  document.querySelector("input[name='" + materialIndex + "']").value = foundCode;
}

function removeFields() {
  const fieldDiv = this.parentNode;
  const mainDiv = fieldDiv.parentNode;
  mainDiv.removeChild(fieldDiv);
}

function addFields(fields) {
  const container = document.getElementById(fields.container);
  const fieldDiv = document.createElement('div');
  const { namePrefix } = fields;
  // Loop through fields from object and apply attributes
  fields.fields.forEach((field) => {
    const newField = document.createElement(field.element);
    if (field.element !== 'label') {
      newField.name = `${namePrefix}[${fieldNum}][${field.name}]`;
    } else {
      // Logic specific to option labels
      newField.setAttribute('for', `${namePrefix}[${fieldNum}][${field.labelFor}]`);
      newField.innerHTML = field.text;
    }
    // Get the keys from attributes and apply each attribute to field
    if (field.attributes) {
      Object.keys(field.attributes).forEach((key) => {
        newField.setAttribute(key, field.attributes[key]);
      });
    }
    // Conditional for select options
    if (field.options) {
      newField.id = newField.name;
      field.options.forEach((option) => {
        const newOption = document.createElement('option');
        newOption.value = option;
        newOption.text = option;
        newField.appendChild(newOption);
      });
    }
    fieldDiv.appendChild(newField);
  });
  const delButton = document.createElement('button');

  fieldDiv.classList.add('fabricBookFieldset');

  delButton.classList.add('delete-color');
  delButton.type = 'button';
  delButton.onclick = removeFields;
  delButton.innerHTML = 'Delete';

  fieldDiv.appendChild(delButton);
  container.appendChild(fieldDiv);

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

function makeBook(data) {
  const container = document.getElementById('main-container');
  const tempFlash = document.createElement('div');
  const tempMessage = document.createElement('p');
  tempFlash.classList.add('alert', 'temp-flash');

  if (data.success) {
    // create new color in list
    clientMaterialList.push(data.success);
    const dataList = document.getElementById('materialList');
    const newMaterialOption = document.createElement('option');
    newMaterialOption.value = data.success.material;
    dataList.appendChild(newMaterialOption);

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

function sendData(url, formId, dataFunc, dataType) { // eslint-disable-line no-unused-vars
  const form = document.getElementById(formId);

  const formData = {};
  // formData.color = form[0].value;
  // formData.colorCode = form[1].value;
  for (let i = 0; i < form.length; i += 1) {
    const key = form[i].name;
    const value = form[i].value;
    formData[key] = value;
  }

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => dataFunc(data));
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
