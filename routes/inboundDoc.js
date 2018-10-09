const express = require('express');
const request = require('request');
const middleware = require('../middleware');
const makeExcel = require('../middleware/makeExcel');

const router = express.Router();

router.get('/', middleware.isLoggedIn, (req, res) => {
  res.render('inboundDocs');
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  const { inboundSkus } = req.body;
  const SkuArr = inboundSkus.split('\r\n');

  const reqBody = {
    ProductSkus: SkuArr,
    TenantToken: req.session.TenantToken,
    UserToken: req.session.UserToken,
  };

  request(
    {
      method: 'POST',
      url: 'https://app.skuvault.com/api/products/getProducts',
      headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
      json: true,
      body: reqBody,
    }, (err, response, body) => {
      if (err) {
        console.log(err);
        req.flash('error', err);
        res.redirect('back');
      } else if (response.statusCode === 200) {
        const date = new Date();
        const wb = makeExcel(body);
        wb.write(`AMARYLLIS ZPS Inbound Doc ${date.getMonth()}-${date.getDay()}.xlsx`, res);
      } else {
        req.flash('error', `Possible error, unexpected response code: ${response.statusCode}`);
        res.redirect('back');
      }
    },
  );
});

module.exports = router;
