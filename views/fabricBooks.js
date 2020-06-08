import React from 'react'

const FabricBooks = ({ suppliers, materials }) => {
  return (
    <div class='container' id='main-container'>
      <h1>Create Fabric Books</h1>
      <form action='/fabricBooks' method='POST'>
        <div id='bookFields'>
          <div class='fabricBookFieldset'>
            <input type='text' name='fabricBooks[0][number]' placeholder='Fabric Book Number' required='true' />
            <input type='text' name='fabricBooks[0][title]' placeholder='Title' required='true' />
            <label for='supplier'>Supplier: </label>
            <select name='fabricBooks[0][supplier]' id='supplier' required='true'>
              <option value='' selected>Select One</option>
              {suppliers.map(supplier => {
                if (supplier.isEnabled) {
                  return (
                    <option value={supplier.name}>{supplier.name}</option>
                  )
                };
              })};
            </select>

            <label for='construction'>Construction: </label>
            <select name='fabricBooks[0][construction]' id='construction'>
              <option value='' selected>Select One</option>
              <option value='Knit' selected>Knit</option>
              <option value='Woven' selected>Woven</option>
            </select>

            <input type='text' list='materialList' name='fabricBooks[0][material]' placeholder='Material Content' required='true' onchange='fillCareInstruction(event)' class='colorName' />
            <input type='text' name='fabricBooks[0][care]' placeholder='Care Instructions' required='true' />
            <input type='text' name='fabricBooks[0][weight]' placeholder='Weight (in oz)' />
            <input type='text' name='fabricBooks[0][image]' placeholder='Image Link' />
          </div>

          <datalist id='materialList'>
            {materials.map(material => {
              return (
                <option key={material.material} value={material.material} />
              )
            })};
          </datalist>
        </div>

        <button type='button' id='addMaterial' onclick='addFields(bookFields)'>Add Another Book</button>
        <input type='submit' />
      </form>

      <form id='newMaterialForm'>
        <h3 class='newMaterialField'>Add New Material</h3>
        <label for='newMaterial'>New Material </label>
        <input type='text' name='newMaterial' id='newMaterial' />
        <label for='newCare'>New Care Instructions </label>
        <input type='text' name='newCare' id='newCare' />
      </form>
      <button type='button' onclick="sendData('/materials', 'newMaterialForm', makeBook)">Create New Material</button>
      <script type='text/javascript'>
        var allMaterialsString = JSON.stringify({materials})
        var clientMaterialList = allMaterialsString;

        var supps = JSON.stringify({suppliers.map(supplier => supplier.name)})
        bookFields.setSuppliers(supps);
      </script>
    </div>
  )
}

export default FabricBooks
