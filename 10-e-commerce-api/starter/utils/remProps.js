const removeProps = (object, remArr) => {
  for (let index = 0; index < remArr.length; index++) {
    const { [remArr[index]]: remove, ...rest } = object;
    object = { ...rest };
  }
  return object;
};

module.exports = removeProps;
