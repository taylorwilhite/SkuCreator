var mongoose = require('mongoose');
var Color = require('./models/color');

var data = [
  {
    "color": "AQUA",
    "colorCode": "AQ"
  },
  {
    "color": "ARMY GREEN",
    "colorCode": "AG"
  },
  {
    "color": "BABY BLUE",
    "colorCode": "BB"
  },
  {
    "color": "BALLET PINK",
    "colorCode": "BP"
  },
  {
    "color": "BEIGE",
    "colorCode": "BG"
  },
  {
    "color": "BLACK",
    "colorCode": "BK"
  },
  {
    "color": "BLACK CAMO",
    "colorCode": "BKC"
  },
  {
    "color": "BLACK FLORAL PRINT",
    "colorCode": "BFP"
  },
  {
    "color": "BLACK PLAID",
    "colorCode": "BKP"
  },
  {
    "color": "BLACK ROSE PRINT",
    "colorCode": "BRF"
  },
  {
    "color": "BLACK STRIPE",
    "colorCode": "BS"
  },
  {
    "color": "BLACK WHITE",
    "colorCode": "BW"
  },
  {
    "color": "BLACK GREY",
    "colorCode": "BGY"
  },
  {
    "color": "BLACK WHITE GREY",
    "colorCode": "BWG"
  },
  {
    "color": "BLACK DOTS",
    "colorCode": "BKD"
  },
  {
    "color": "BLACK RED",
    "colorCode": "BRD"
  },
  {
    "color": "BLUE",
    "colorCode": "BL"
  },
  {
    "color": "BLUE WHITE",
    "colorCode": "BLW"
  },
  {
    "color": "BLUE CAMO",
    "colorCode": "BC"
  },
  {
    "color": "BLUE FLORAL",
    "colorCode": "BLF"
  },
  {
    "color": "BLUE STRIPE",
    "colorCode": "BST"
  },
  {
    "color": "BLUSH",
    "colorCode": "BLS"
  },
  {
    "color": "BRIGHT BLUE",
    "colorCode": "BBL"
  },
  {
    "color": "BRIGHT WHITE",
    "colorCode": "BTW"
  },
  {
    "color": "BROWN",
    "colorCode": "BR"
  },
  {
    "color": "BROWN ORANGE",
    "colorCode": "BRO"
  },
  {
    "color": "BURGUNDY",
    "colorCode": "BU"
  },
  {
    "color": "BLACK WHITE WINDOWPANE",
    "colorCode": "BWP"
  },
  {
    "color": "CAMEL",
    "colorCode": "CML"
  },
  {
    "color": "CAMEO PINK",
    "colorCode": "CP"
  },
  {
    "color": "CHAMPAGNE",
    "colorCode": "CMP"
  },
  {
    "color": "CHARCAOL",
    "colorCode": "CH"
  },
  {
    "color": "CHARCOAL STRIPE",
    "colorCode": "CHS"
  },
  {
    "color": "CHARCOAL STRIPE BLACK",
    "colorCode": "CSB"
  },
  {
    "color": "CHARCOAL BLACK",
    "colorCode": "CHB"
  },
  {
    "color": "CLAY",
    "colorCode": "CY"
  },
  {
    "color": "COBALT",
    "colorCode": "CB"
  },
  {
    "color": "COCOA",
    "colorCode": "CC"
  },
  {
    "color": "COGNAC",
    "colorCode": "CG"
  },
  {
    "color": "COPPER",
    "colorCode": "CP"
  },
  {
    "color": "COPPER STRIPE",
    "colorCode": "CPS"
  },
  {
    "color": "CORAL",
    "colorCode": "CL"
  },
  {
    "color": "CREAM",
    "colorCode": "CRM"
  },
  {
    "color": "CREAM STRIPE",
    "colorCode": "CRS"
  },
  {
    "color": "CREAM MOCA",
    "colorCode": "CMO"
  },
  {
    "color": "DARK BLUE",
    "colorCode": "DB"
  },
  {
    "color": "DARK CHARCHOAL",
    "colorCode": "DCH"
  },
  {
    "color": "DARK GREY",
    "colorCode": "DG"
  },
  {
    "color": "DARK GREEN",
    "colorCode": "DGN"
  },
  {
    "color": "DARK PINK",
    "colorCode": "DP"
  },
  {
    "color": "DARK SILVER",
    "colorCode": "DS"
  },
  {
    "color": "DARK TEAL",
    "colorCode": "DT"
  },
  {
    "color": "DENIM",
    "colorCode": "DNM"
  },
  {
    "color": "DUSTY ROSE",
    "colorCode": "DR"
  },
  {
    "color": "EGGPLANT",
    "colorCode": "EG"
  },
  {
    "color": "ELETRIC BLUE",
    "colorCode": "EB"
  },
  {
    "color": "FLORAL PRINT",
    "colorCode": "FP"
  },
  {
    "color": "FOREST GREEN",
    "colorCode": "FG"
  },
  {
    "color": "GOLD",
    "colorCode": "GD"
  },
  {
    "color": "GREY",
    "colorCode": "GY"
  },
  {
    "color": "GREEN",
    "colorCode": "GN"
  },
  {
    "color": "GREEN NAVY",
    "colorCode": "GNV"
  },
  {
    "color": "GREY BLACK",
    "colorCode": "GBK"
  },
  {
    "color": "GREY FLORAL PRINK",
    "colorCode": "GFP"
  },
  {
    "color": "GREY PEACH",
    "colorCode": "GPE"
  },
  {
    "color": "GREY STRIPE",
    "colorCode": "GST"
  },
  {
    "color": "GREY TEAL",
    "colorCode": "GT"
  },
  {
    "color": "HEATHER BLACK",
    "colorCode": "HBK"
  },
  {
    "color": "HEATHER BLUE",
    "colorCode": "HB"
  },
  {
    "color": "HEATHER BROWN",
    "colorCode": "HBR"
  },
  {
    "color": "HEATHER BURGUNDY",
    "colorCode": "HBU"
  },
  {
    "color": "HEATHER COPPER",
    "colorCode": "HCP"
  },
  {
    "color": "HEATHER GREY",
    "colorCode": "HG"
  },
  {
    "color": "HEATHER OLIVE",
    "colorCode": "HO"
  },
  {
    "color": "HEATHER PURPLE",
    "colorCode": "HPU"
  },
  {
    "color": "HEATHER TAUPE",
    "colorCode": "HT"
  },
  {
    "color": "HOT PINK",
    "colorCode": "HP"
  },
  {
    "color": "HUNTER GREEN",
    "colorCode": "HUG"
  },
  {
    "color": "IRON GREY",
    "colorCode": "IGY"
  },
  {
    "color": "IVORY",
    "colorCode": "IV"
  },
  {
    "color": "IVORY OLIVE",
    "colorCode": "IO"
  },
  {
    "color": "IVORY STRIPE",
    "colorCode": "IST"
  },
  {
    "color": "IVORY STRIPE BLACK",
    "colorCode": "ISB"
  },
  {
    "color": "KHAKI",
    "colorCode": "KH"
  },
  {
    "color": "LAVENDER",
    "colorCode": "LV"
  },
  {
    "color": "LEOPARD",
    "colorCode": "LEO"
  },
  {
    "color": "LIGHT BLUE",
    "colorCode": "LB"
  },
  {
    "color": "LIGHT BLUE CAMO",
    "colorCode": "LBC"
  },
  {
    "color": "LIGHT GREY",
    "colorCode": "LG"
  },
  {
    "color": "LIGHT GREY NAVY PLAID",
    "colorCode": "GNP"
  },
  {
    "color": "LIGHT PINK",
    "colorCode": "LP"
  },
  {
    "color": "LIGHT VIOLET",
    "colorCode": "LVT"
  },
  {
    "color": "LILAC",
    "colorCode": "LI"
  },
  {
    "color": "LIGHT HEATHER GREY",
    "colorCode": "LHG"
  },
  {
    "color": "MARBLE",
    "colorCode": "MBL"
  },
  {
    "color": "MAUVE",
    "colorCode": "MV"
  },
  {
    "color": "MINT",
    "colorCode": "MI"
  },
  {
    "color": "MINT STRIPE",
    "colorCode": "MIS"
  },
  {
    "color": "MOCHA",
    "colorCode": "MO"
  },
  {
    "color": "MOSS GREEN",
    "colorCode": "MG"
  },
  {
    "color": "MULTI-COLOR",
    "colorCode": "MLT"
  },
  {
    "color": "MUSHROOM",
    "colorCode": "MSH"
  },
  {
    "color": "MUSTARD",
    "colorCode": "MU"
  },
  {
    "color": "MUSTARD GREY",
    "colorCode": "MGY"
  },
  {
    "color": "MUTED CAMO",
    "colorCode": "MC"
  },
  {
    "color": "NAVY",
    "colorCode": "NV"
  },
  {
    "color": "NAVY DOT",
    "colorCode": "NVD"
  },
  {
    "color": "NAVY FLORAL PRINT",
    "colorCode": "NFP"
  },
  {
    "color": "NAVY ROSE FLORAL",
    "colorCode": "NRF"
  },
  {
    "color": "NAVY STRIPE",
    "colorCode": "NVS"
  },
  {
    "color": "NAVY RUSSET BROWN",
    "colorCode": "NRB"
  },
  {
    "color": "NEW YORK PINK",
    "colorCode": "NYP"
  },
  {
    "color": "NUDE",
    "colorCode": "NU"
  },
  {
    "color": "NUDE PINK",
    "colorCode": "NUP"
  },
  {
    "color": "OATMEAL",
    "colorCode": "OM"
  },
  {
    "color": "OFF WHITE",
    "colorCode": "OW"
  },
  {
    "color": "OLIVE",
    "colorCode": "OL"
  },
  {
    "color": "OLIVE BLACK",
    "colorCode": "OLB"
  },
  {
    "color": "ORANGE",
    "colorCode": "OG"
  },
  {
    "color": "PEACH",
    "colorCode": "PE"
  },
  {
    "color": "PEACOCK BLUE",
    "colorCode": "PCB"
  },
  {
    "color": "PINK",
    "colorCode": "PK"
  },
  {
    "color": "PINK FLORAL",
    "colorCode": "PF"
  },
  {
    "color": "PINK GINGHAM",
    "colorCode": "PG"
  },
  {
    "color": "PINK STRIPE",
    "colorCode": "PST"
  },
  {
    "color": "PINK WHITE",
    "colorCode": "PW"
  },
  {
    "color": "PISTACHIO",
    "colorCode": "PI"
  },
  {
    "color": "PLUM",
    "colorCode": "PL"
  },
  {
    "color": "POWDER BLUE",
    "colorCode": "PB"
  },
  {
    "color": "POWDER BLUE STRIPE",
    "colorCode": "PBS"
  },
  {
    "color": "POWDER PINK",
    "colorCode": "PP"
  },
  {
    "color": "PRUSSIAN BLUE",
    "colorCode": "PRB"
  },
  {
    "color": "PURPLE",
    "colorCode": "PU"
  },
  {
    "color": "RASBERRY",
    "colorCode": "RAS"
  },
  {
    "color": "RED",
    "colorCode": "RD"
  },
  {
    "color": "RED FLORAL",
    "colorCode": "RF"
  },
  {
    "color": "ROSE",
    "colorCode": "RS"
  },
  {
    "color": "ROYAL BLUE",
    "colorCode": "RBL"
  },
  {
    "color": "RUBY RED",
    "colorCode": "RR"
  },
  {
    "color": "RUSSET BROWN",
    "colorCode": "RB"
  },
  {
    "color": "RUST",
    "colorCode": "RU"
  },
  {
    "color": "SAGE",
    "colorCode": "SG"
  },
  {
    "color": "SAGE GREEN STRIPE",
    "colorCode": "SGS"
  },
  {
    "color": "SKY BLUE",
    "colorCode": "SB"
  },
  {
    "color": "SOFT PEACH",
    "colorCode": "SP"
  },
  {
    "color": "STEEL BLUE",
    "colorCode": "STB"
  },
  {
    "color": "STONE",
    "colorCode": "SN"
  },
  {
    "color": "TAN",
    "colorCode": "TN"
  },
  {
    "color": "TAUPE",
    "colorCode": "TP"
  },
  {
    "color": "TAUPE STRIPE",
    "colorCode": "TS"
  },
  {
    "color": "TEAL",
    "colorCode": "TL"
  },
  {
    "color": "TURQUOISE",
    "colorCode": "TQ"
  },
  {
    "color": "VELVET BLACK",
    "colorCode": "VBL"
  },
  {
    "color": "VELVET BURGUNDY",
    "colorCode": "VBU"
  },
  {
    "color": "VELVET STEEL BLUE",
    "colorCode": "VSB"
  },
  {
    "color": "WHITE",
    "colorCode": "WH"
  },
  {
    "color": "WHITE BLACK STRIPE",
    "colorCode": "WBS"
  },
  {
    "color": "WHITE FLORAL PRINT",
    "colorCode": "WFP"
  },
  {
    "color": "WHITE GREY",
    "colorCode": "WG"
  },
  {
    "color": "WHTE GREY STRIPE",
    "colorCode": "WGS"
  },
  {
    "color": "WHITE PINK STRIPE",
    "colorCode": "WPS"
  },
  {
    "color": "WHITE PLAID",
    "colorCode": "WPL"
  },
  {
    "color": "WIDE NAVY STRIPE",
    "colorCode": "WNS"
  },
  {
    "color": "WIDE PINK STRIPE",
    "colorCode": "PWS"
  },
  {
    "color": "WIDE WHITE STRIPE",
    "colorCode": "WWS"
  },
  {
    "color": "WINE",
    "colorCode": "WN"
  },
  {
    "color": "WINE BLACK",
    "colorCode": "WNB"
  },
  {
    "color": "YELLOW",
    "colorCode": "YE"
  }
]

function seedDB(){
	data.forEach(seed => {
		Color.create(seed, (err, campground) => {
			if(err){
				console.log(err);
			}
		});
	});
};

module.exports = seedDB;