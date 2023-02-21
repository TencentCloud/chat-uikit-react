export const formateNumber = (num:number, type = 0) => {
  let text = `${num}`;
  if (type === 0) {
    if (num >= 1000 && num < 10000) {
      text = `${(num / 1000).toFixed(1)}K`;
    } else if (num > 10000) {
      text = `${(num / 1000).toFixed(0)}K`;
    }
  }
  if (type === 1) {
    if (num >= 10000) {
      text = `${(num / 10000).toFixed(1)}W`;
    }
  }
  return text;
};
