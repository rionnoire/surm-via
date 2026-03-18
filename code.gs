function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function sendRGB(r, g, b, a){
  const sheet = SpreadsheetApp
    .openById("1homam6d_lBxZzBsCDdSLIctsccISKVmKnZoYWq1vf7M")
    .getSheets()[0];

  sheet.getRange(1, 1).setValue(r);
  sheet.getRange(2, 1).setValue(g);
  sheet.getRange(3, 1).setValue(b);
  sheet.getRange(4, 1).setValue(a);
}
