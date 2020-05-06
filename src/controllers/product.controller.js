const fs = require( "fs" );
const ProductService = require('../services/product.service');
const ProductTypeService = require('../services/productType.service');
const ProductBrandService = require('../services/productBrand.service');

module.exports = {
  'getProductsController': async (req, resp) => {
    let page = parseInt(req.query.page) || 1;
    let resPerPage = 9;
    const dataProducts = await ProductService.getProductsService(page, resPerPage);
    const dataProductType = await ProductTypeService.getProductTypesService();
    const dataProductBrand = await ProductBrandService.getProductBrandsService();
    
    if(dataProducts) {
      // return resp.status(200).json(dataProducts);
      // await Promise.all([dataProducts, dataProductType, dataProductBrand]).then( values => {
      //   return resp.render("shop", {data: products});
      // });
      return resp.render("shop", {data: {dataProducts, dataProductType, dataProductBrand}});
    }
    return resp.status(500).json('Error get data from collection product.');

  },
  'getDetailProduct': async (req, resp) => {
    let productId = req.params.id;
    const dataProduct = await ProductService.getDetailProduct(productId);
    const dataProductType = await ProductTypeService.getProductTypesService();
    const dataProductBrand = await ProductBrandService.getProductBrandsService();
    if(!productId){
      return resp.status(403).json('Error get data body from client.');
    }
    if(dataProduct){
      // return resp.status(200).json(dataProduct);
      return resp.render("detail-product" ,{data: {dataProduct, dataProductType, dataProductBrand}});
    }
    return resp.status(500).json('Error get data from collection product.');
  },
  'postProductController': async (req, resp) => {
    if(!req.body) return resp.status(403).json('Error get data from client.');
    let dataProduct = JSON.parse(req.body.product);
    let dataProductAttribute = JSON.parse(req.body.productAttributes);
    if(!dataProduct) return resp.status(403).json('Error get data product from client.');
    if(!dataProductAttribute) return resp.status(403).json('Error get data product attribute from client.');
    if(!req.file){
      return resp.status(400).json('Error file upload');
    }
    if ( req.file.fieldname === "myImage" && req.file.mimetype.includes( "image" ) ) {
      let urlImage = req.file.filename;
      const saveDataProduct = await ProductService.postProductService(dataProduct,dataProductAttribute , urlImage);
      if(saveDataProduct) {
        console.log(saveDataProduct);
        return resp.status(200).json(saveDataProduct);
      }
      return resp.status(500).json('Error save data to collection product.');
    }
    // return resp.status(200).json(req.file);
    // const dataProduct = await ProductService.postProductService(req.body);
    //   if(dataProduct) {
    //     return resp.status(200).json(dataProduct);
    //   }
    //   return resp.status(500).json('Error save data to collection product.');
  
  },
  'editProductController': async (req, resp) => {  
    if(!req.body) return resp.status(403).json('Error get data from client.');
    const dataProduct = JSON.parse(req.body.product);
    const dataProductAttribute = JSON.parse(req.body.productAttributes);
    if(!dataProduct) return resp.status(403).json('Error get data product from client.');
    if(!dataProductAttribute) return resp.status(403).json('Error get data product attribute from client.');
    if(!req.file){
      return resp.status(400).json('Error file upload');
    }
    if ( req.file.fieldname === "myImage" && req.file.mimetype.includes( "image" ) ) {
      let urlImage = req.file.filename;
      const productId = dataProduct._id;
      const dataEditProduct = await ProductService.editProductService(productId, dataProduct, dataProductAttribute, urlImage);
      if(dataEditProduct) {
        return resp.status(200).json(dataEditProduct);
      }
      return resp.status(500).json('Error save data to collection product.');
    }
  },
  'deleteProductController': async (req, resp) => {
    const productId = req.query.productId;
    console.log(productId)
    if(!productId) return resp.status(403).json('Error get id product from client.');
    if(productId) return resp.status(200).json(await ProductService.deleteProductService(productId));
  }
}