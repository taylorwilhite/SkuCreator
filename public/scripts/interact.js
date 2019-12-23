/* eslint-env browser */
/* global clientColorList */
let sizeStyle = 'reg';
const regSizes = ['P3X', 'P2X', 'P1X', 'XL', 'L', 'M', 'S', 'XS'];
const kimonoSizes = ['OSP', 'P3X', 'P2X', 'P1X', 'LXL', 'SM'];
const denimSizes = ['16', '14', '12', '10', '8', '6', '4', '2', '0'];
const sweaterSizes = ['2X/3X', '1X/XL', 'M/L', 'XS/S'];
const sizeMap = {
  reg: regSizes,
  kimono: kimonoSizes,
  denim: denimSizes,
  sweater: sweaterSizes,
};
const neckClasses = [
  'Jumpsuits & Rompers',
  'Dresses',
  'LST',
  'Maxi Dress',
  'Midi Dress',
  'Mini Dress',
  'NST',
  'SST',
  'Sweaters',
  'Tops',
  'Outerwear',
];
let fieldNum = 2;
let suppList;

const bookFields = {
  setSuppliers(suppliers) {
    this.fields[3].options = suppliers;
  },
  container: 'bookFields',
  namePrefix: 'fabricBooks',
  fields: [
    { name: 'number', element: 'input', attributes: { placeholder: 'Fabric Book Number', type: 'text' } },
    { name: 'title', element: 'input', attributes: { placeholder: 'Title', type: 'text' } },
    { element: 'label', labelFor: 'supplier', text: 'Supplier: ' },
    { name: 'supplier', element: 'select', options: suppList },
    { element: 'label', labelFor: 'brand', text: 'Brand: ' },
    { name: 'brand', element: 'select', options: ['AMARYLLIS', 'AMA By Amaryllis', 'REFLECTION'] },
    { element: 'label', labelFor: 'construction', text: 'Construction: ' },
    { name: 'construction', element: 'select', options: ['Knit', 'Woven'] },
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

  if (fields === colorFields) {
    console.log('Color Fields!');
    const fbParent = document.createElement('span');
    fbParent.classList.add('fb-color-container');

    for (let i = 0; i <= fbCodeIndex; i += 1) {
      const newFbField = document.createElement('input');
      newFbField.name = `${namePrefix}[${fieldNum}][fbColor][]`;
      newFbField.type = 'text';
      newFbField.placeholder = 'FB Color Number';

      fbParent.appendChild(newFbField);
    }
    fieldDiv.appendChild(fbParent);
  }

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

function flashDisplay(data) {
  const container = document.getElementById('main-container');
  const tempFlash = document.createElement('div');
  const tempMessage = document.createElement('p');
  tempFlash.classList.add('alert', 'temp-flash');

  if (data.success) {
    tempMessage.innerHTML = data.success;
    tempFlash.classList.add('alert-success');
  } else {
    tempMessage.innerHTML = data.error ? data.error : 'Something went wrong, please try again';
    tempFlash.classList.add('alert-error');
  }
  tempFlash.appendChild(tempMessage);
  container.insertAdjacentElement('afterbegin', tempFlash);

  setTimeout(() => tempFlash.remove(), 6000);
}

function getData(endpoint) {
  return fetch(endpoint)
    .then(response => response.json())
    .then(data => flashDisplay(data));
}

function deleteSizes(size) {
  const deleteSize = document.querySelector('input[value="' + size + '"]');
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

function sizeToggle(style) { // eslint-disable-line no-unused-vars
  const styleArr = sizeMap[style];
  const currArr = sizeMap[sizeStyle];

  currArr.forEach(size => deleteSizes(size));
  styleArr.forEach(size => addSizes(size));

  sizeStyle = style;
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

function showNeckType(e) {
  const classification = e.value;
  const parent = document.getElementById('neck-contain');

  if (neckClasses.includes(classification)) {
    parent.classList.add('show-input');
  } else {
    parent.classList.remove('show-input');
  }
}

function updateColor(e) {
  e.preventDefault();

  const form = e.target.parentNode;
  console.log(form);
  const formData = {};
  const colorId = form[0].value;
  formData.color = form[1].value;
  formData.colorCode = form[2].value;

  fetch(`/colors/${colorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => flashDisplay(data));
}

function removeColor(data, node) {
  if (data.success) {
    const deleteNode = node.parentNode;
    deleteNode.remove();
  }
  flashDisplay(data);
}

function deleteColor(e) {
  e.preventDefault();

  const form = e.target.parentNode;
  const colorId = form[0].value;

  fetch(`/colors/${colorId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => removeColor(data, form));
}

function updateSupplier(target) {
  const { id } = target.options[target.selectedIndex].dataset;
  const rawInput = target.closest('div.inputSet').querySelectorAll('input')[0];
  const plusInput = target.closest('div.inputSet').querySelectorAll('input')[1];

  target.name = `supp[${id}][Name]`;
  rawInput.name = `supp[${id}][rawCost]`;
  plusInput.name = `supp[${id}][plusCost]`;
}

function addSupplier() {
  const container = document.getElementById('suppCost');
  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('inputSet');

  const suppSelect = document.createElement('select');
  const regLabel = document.createElement('label');
  const suppLabel = document.createElement('label');
  const plusLabel = document.createElement('label');
  const regCost = document.createElement('input');
  const plusCost = document.createElement('input');
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.text = 'Select One';
  defaultOpt.dataset.id = '';
  suppSelect.appendChild(defaultOpt);

  clientSuppList.forEach((supplier) => {
    const suppOption = document.createElement('option');
    suppOption.value = supplier.name;
    suppOption.text = supplier.name;
    suppOption.dataset.id = supplier._id;

    suppSelect.appendChild(suppOption);
  });

  suppSelect.name = 'supp[0][Name]';
  suppSelect.required = 'true';

  suppLabel.innerText = 'Supplier: ';
  regLabel.innerText = 'Reg Cost: ';
  plusLabel.innerText = 'Plus Cost: ';
  regCost.type = 'number';
  plusCost.type = 'number';
  regCost.name = 'supp[0][rawCost]';
  plusCost.name = 'supp[0][plusCost]';
  regCost.step = '0.01';
  plusCost.step = '0.01';

  const delButton = document.createElement('button');
  delButton.classList.add('delete-color');
  delButton.type = 'button';
  delButton.onclick = removeFields;
  delButton.innerHTML = 'Delete';

  regLabel.appendChild(regCost);
  suppLabel.appendChild(suppSelect);
  plusLabel.appendChild(plusCost);

  fieldDiv.appendChild(suppLabel);
  fieldDiv.appendChild(regLabel);
  fieldDiv.appendChild(plusLabel);
  fieldDiv.appendChild(delButton);

  container.appendChild(fieldDiv);

  suppSelect.addEventListener('change', e => updateSupplier(e.target));
}

let fbCodeIndex = 0;
function addFbCode() { // eslint-disable-line no-unused-vars
  if (fbCodeIndex >= 3) {
    return;
  }
  fbCodeIndex += 1;
  const parent = document.getElementById('fb-container');
  const fbField = document.createElement('input');

  fbField.type = 'text';
  fbField.name = 'fbCode[]';
  fbField.placeholder = 'Fabric Book';
  fbField.setAttribute('data-fbIndex', fbCodeIndex);

  parent.appendChild(fbField);
  if (fbCodeIndex === 3) {
    const addButton = document.getElementById('fb-add-btn');
    addButton.style.display = 'none';
  }

  const colorContainer = document.getElementById('colorFields');
  const colorSets = colorContainer.querySelectorAll('.fabricBookFieldset');
  console.log(colorSets);
  for (let i = 0; i < colorSets.length; i += 1) {
    const fbContainer = colorSets[i].querySelector('.fb-color-container');
    const newFbNum = document.createElement('input');
    const inputName = fbContainer.children[0].name;
    newFbNum.type = 'text';
    newFbNum.placeholder = 'FB Color Number';
    newFbNum.setAttribute('data-fbIndex', fbCodeIndex);
    newFbNum.name = `${inputName}`;

    fbContainer.appendChild(newFbNum);
  }
}
