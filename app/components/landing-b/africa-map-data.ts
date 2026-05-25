/**
 * Hand-tuned simplified Africa silhouette: 54 country regions on an 800×900
 * viewBox. Coordinates are illustrative — designed to read as Africa, not
 * geographically exact.
 */
export type CountryPath = {
  id: string;
  name: string;
  code: string;
  d: string;
};

export const COUNTRIES: CountryPath[] = [
  {
    id: "MA",
    name: "Morocco",
    code: "MA",
    d: "M180,160 L260,150 L290,180 L300,220 L260,240 L210,235 L180,210 Z",
  },
  {
    id: "DZ",
    name: "Algeria",
    code: "DZ",
    d: "M260,150 L420,160 L430,250 L380,280 L300,270 L290,220 L300,180 Z",
  },
  {
    id: "TN",
    name: "Tunisia",
    code: "TN",
    d: "M420,160 L450,160 L455,200 L430,210 Z",
  },
  {
    id: "LY",
    name: "Libya",
    code: "LY",
    d: "M430,210 L455,200 L560,200 L580,290 L500,310 L430,300 L420,250 Z",
  },
  {
    id: "EG",
    name: "Egypt",
    code: "EG",
    d: "M580,200 L680,210 L700,290 L650,310 L580,300 L560,240 Z",
  },
  {
    id: "MR",
    name: "Mauritania",
    code: "MR",
    d: "M180,260 L290,270 L310,340 L260,370 L200,360 L170,310 Z",
  },
  {
    id: "ML",
    name: "Mali",
    code: "ML",
    d: "M290,270 L380,280 L400,360 L370,410 L310,400 L300,340 Z",
  },
  {
    id: "NE",
    name: "Niger",
    code: "NE",
    d: "M400,300 L500,310 L520,390 L450,400 L400,360 Z",
  },
  {
    id: "TD",
    name: "Chad",
    code: "TD",
    d: "M520,310 L580,300 L600,400 L540,420 L500,400 L500,340 Z",
  },
  {
    id: "SD",
    name: "Sudan",
    code: "SD",
    d: "M600,310 L700,310 L720,400 L660,430 L600,420 Z",
  },
  {
    id: "ER",
    name: "Eritrea",
    code: "ER",
    d: "M700,330 L740,340 L740,380 L710,380 Z",
  },
  {
    id: "SN",
    name: "Senegal",
    code: "SN",
    d: "M170,330 L240,340 L240,380 L180,380 L160,360 Z",
  },
  {
    id: "GM",
    name: "Gambia",
    code: "GM",
    d: "M180,372 L230,370 L230,385 L180,388 Z",
  },
  {
    id: "GN",
    name: "Guinea",
    code: "GN",
    d: "M200,400 L290,395 L300,430 L260,445 L210,440 Z",
  },
  {
    id: "SL",
    name: "Sierra Leone",
    code: "SL",
    d: "M210,440 L255,445 L260,475 L220,475 Z",
  },
  {
    id: "LR",
    name: "Liberia",
    code: "LR",
    d: "M260,460 L300,455 L310,490 L270,490 Z",
  },
  {
    id: "CI",
    name: "Côte d'Ivoire",
    code: "CI",
    d: "M300,430 L370,430 L380,490 L320,490 L310,455 Z",
  },
  {
    id: "GH",
    name: "Ghana",
    code: "GH",
    d: "M380,440 L420,440 L425,500 L385,500 Z",
  },
  {
    id: "TG",
    name: "Togo",
    code: "TG",
    d: "M425,440 L445,440 L445,495 L425,495 Z",
  },
  {
    id: "BJ",
    name: "Benin",
    code: "BJ",
    d: "M445,420 L470,420 L470,495 L445,495 Z",
  },
  {
    id: "BF",
    name: "Burkina Faso",
    code: "BF",
    d: "M310,400 L400,400 L420,440 L360,445 L310,430 Z",
  },
  {
    id: "NG",
    name: "Nigeria",
    code: "NG",
    d: "M470,410 L555,415 L560,490 L490,495 L470,440 Z",
  },
  {
    id: "CM",
    name: "Cameroon",
    code: "CM",
    d: "M555,430 L595,425 L605,510 L570,520 L555,490 Z",
  },
  {
    id: "CF",
    name: "CAR",
    code: "CF",
    d: "M540,420 L630,415 L645,470 L600,475 L545,460 Z",
  },
  {
    id: "GQ",
    name: "Eq. Guinea",
    code: "GQ",
    d: "M555,510 L585,510 L585,535 L555,535 Z",
  },
  {
    id: "GA",
    name: "Gabon",
    code: "GA",
    d: "M540,510 L590,520 L600,575 L545,580 Z",
  },
  {
    id: "CG",
    name: "Congo",
    code: "CG",
    d: "M590,510 L640,500 L650,580 L600,580 Z",
  },
  {
    id: "CD",
    name: "DR Congo",
    code: "CD",
    d: "M600,475 L700,470 L730,560 L680,620 L600,610 L600,540 Z",
  },
  {
    id: "AO",
    name: "Angola",
    code: "AO",
    d: "M540,610 L660,615 L670,710 L580,720 L540,690 Z",
  },
  {
    id: "SS",
    name: "South Sudan",
    code: "SS",
    d: "M620,420 L700,420 L710,470 L645,470 Z",
  },
  {
    id: "ET",
    name: "Ethiopia",
    code: "ET",
    d: "M700,400 L780,420 L780,490 L720,490 L705,440 Z",
  },
  {
    id: "DJ",
    name: "Djibouti",
    code: "DJ",
    d: "M770,415 L795,415 L795,440 L770,440 Z",
  },
  {
    id: "SO",
    name: "Somalia",
    code: "SO",
    d: "M780,440 L800,420 L820,460 L800,540 L765,510 L770,470 Z",
  },
  {
    id: "KE",
    name: "Kenya",
    code: "KE",
    d: "M710,480 L780,490 L780,560 L720,565 L705,525 Z",
  },
  {
    id: "UG",
    name: "Uganda",
    code: "UG",
    d: "M680,490 L720,490 L720,535 L680,535 Z",
  },
  {
    id: "RW",
    name: "Rwanda",
    code: "RW",
    d: "M680,540 L710,540 L710,560 L680,560 Z",
  },
  {
    id: "BI",
    name: "Burundi",
    code: "BI",
    d: "M680,565 L710,565 L710,590 L680,590 Z",
  },
  {
    id: "TZ",
    name: "Tanzania",
    code: "TZ",
    d: "M680,590 L770,580 L780,650 L700,660 L680,630 Z",
  },
  {
    id: "ZM",
    name: "Zambia",
    code: "ZM",
    d: "M600,640 L700,635 L700,700 L620,710 L600,680 Z",
  },
  {
    id: "MW",
    name: "Malawi",
    code: "MW",
    d: "M695,650 L725,655 L730,720 L700,720 Z",
  },
  {
    id: "MZ",
    name: "Mozambique",
    code: "MZ",
    d: "M695,700 L760,680 L770,800 L720,820 L700,770 Z",
  },
  {
    id: "ZW",
    name: "Zimbabwe",
    code: "ZW",
    d: "M620,720 L695,720 L695,775 L630,780 Z",
  },
  {
    id: "BW",
    name: "Botswana",
    code: "BW",
    d: "M580,730 L660,725 L665,790 L590,790 Z",
  },
  {
    id: "NA",
    name: "Namibia",
    code: "NA",
    d: "M530,710 L590,720 L600,820 L545,830 L515,770 Z",
  },
  {
    id: "ZA",
    name: "South Africa",
    code: "ZA",
    d: "M540,830 L660,800 L700,840 L660,880 L580,880 L540,860 Z",
  },
  {
    id: "LS",
    name: "Lesotho",
    code: "LS",
    d: "M650,830 L680,830 L680,855 L650,855 Z",
  },
  {
    id: "SZ",
    name: "Eswatini",
    code: "SZ",
    d: "M695,810 L720,810 L720,830 L695,830 Z",
  },
  {
    id: "MG",
    name: "Madagascar",
    code: "MG",
    d: "M790,640 L810,635 L820,720 L800,790 L780,780 L785,700 Z",
  },
  {
    id: "MU",
    name: "Mauritius",
    code: "MU",
    d: "M845,750 L860,750 L860,765 L845,765 Z",
  },
  {
    id: "KM",
    name: "Comoros",
    code: "KM",
    d: "M765,635 L780,635 L780,650 L765,650 Z",
  },
  {
    id: "SC",
    name: "Seychelles",
    code: "SC",
    d: "M850,540 L865,540 L865,555 L850,555 Z",
  },
  {
    id: "CV",
    name: "Cape Verde",
    code: "CV",
    d: "M110,340 L130,340 L130,360 L110,360 Z",
  },
  {
    id: "ST",
    name: "São Tomé",
    code: "ST",
    d: "M530,540 L545,540 L545,555 L530,555 Z",
  },
  {
    id: "GW",
    name: "Guinea-Bissau",
    code: "GW",
    d: "M180,395 L210,395 L210,415 L180,415 Z",
  },
  {
    id: "EH",
    name: "W. Sahara",
    code: "EH",
    d: "M170,210 L220,235 L220,290 L170,290 L155,250 Z",
  },
];
