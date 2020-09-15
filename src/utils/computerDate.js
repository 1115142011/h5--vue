export function timesFun (targetDate) {
  let date1 = new Date(targetDate);
  let date2 = new Date();
  date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diff = date2.getTime() - date1.getTime();
  const diffDate = diff / (24 * 60 * 60 * 1000);
  return diffDate;
}

export function returnFloat (value) {
  var value = Math.round(parseFloat(value) * 100) / 100;
  var xsd = value.toString().split('.');
  if (xsd.length == 1) {
    value = value.toString() + '.00';
    return value;
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0';
    }
    return value;
  }
}
