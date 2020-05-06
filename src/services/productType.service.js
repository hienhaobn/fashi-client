const ProductTypeRepository = require('../repository/productType.repository');

module.exports = {
  'getProductTypesService': async () => {
    const dataProductType =  await ProductTypeRepository.findProductTypes();
    if(!dataProductType) {
      return "Error get data from repository";
    }
    console.log(dataProductType);
    return dataProductType;
  },
  'postProductTypeService': (body) => {
    const dataProductType = ProductTypeRepository.createProductType(body.name);
    if(!dataProductType) {
      return "Error post data form repository";
    }
    return dataProductType;
  }
}