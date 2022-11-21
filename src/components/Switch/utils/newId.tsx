let lastId = 0;
const creteNewId = (prefix = 'id') => {
  lastId += 1;
  return `${prefix}-${lastId}`;
};
export { creteNewId };
