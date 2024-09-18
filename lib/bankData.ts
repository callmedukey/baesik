export const bankCodes = {
    "국민": "004",
    "경남": "039",
    "광주": "034",
    "기업": "003",
    "농협": "011",
    "아이엠뱅크": "031",
    "부산": "032",
    "산업": "002",
    "저축": "050",
    "새마을금고": "045",
    "수협": "007",
    "신한": "088",
    "신협": "048",
    "씨티": "027",
    "KEB하나": "081",
    "우리": "020",
    "우체국": "071",
    "전북": "037",
    "SC": "023",
    "제주": "035",
    "HSBC": "054",
    "케이뱅크": "089",
    "카카오뱅크": "090",
    "토스뱅크": "092"
  };

  export type BankKey = keyof typeof bankCodes;
  type BankCode = typeof bankCodes[BankKey];


 export const bankNames = Object.keys(bankCodes);
 export const sortedBankNames = bankNames.sort();

 export const bankNameToCode = (name: BankKey) => {
    return bankCodes[name];
  };

  



  