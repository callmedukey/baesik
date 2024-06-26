function generateCode() {
  let randomNumber = Math.floor(100000 + Math.random() * 900000);

  return randomNumber.toString();
}

export default generateCode;
