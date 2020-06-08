import React from 'react'

const InboundDocs = () => {
  return (
    <div class='container'>
      <h1>Create Inbound Doc</h1>

      <form action='/inboundDocs' method='POST' id='inboundSkuForm'>
        <label for='inboundSkus'>Paste Inbound SKUs (1 per line):</label>
        <textarea name='inboundSkus' placeholder='e.g. 18A1-001B-S' id='inboundSkus' rows='30' cols='30' />
        <input type='submit' name='' />
      </form>
    </div>
  )
}

export default InboundDocs
