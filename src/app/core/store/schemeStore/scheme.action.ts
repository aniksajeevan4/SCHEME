import { createAction, props } from "@ngrx/store";
import { ProductDetails } from "../../models/shared.model";
import { SchemeDetails } from "../../models/scheme.model";

export const GET_SCHEMES = "schemes : get : schemes";
export const UPDATE_SCHEME = "schemes : update : scheme";
export const UPDATE_SCHEMES = "schemes : update : schemes";
export const GET_PRODUCTS_DETAILS = "schemes : get : products";
export const UPDATE_PRODUCT_DETAILS = "schemes : update : product";
export const UPDATE_PRODUCTS_DETAILS = "schemes : update : products";

export const getSchemeDetails = createAction(GET_SCHEMES, props<{productId:number, searchData:string, pageNo:number, pageSize:number}>());
export const getProductDetails = createAction(GET_PRODUCTS_DETAILS);
export const updateSchemeDetails = createAction(UPDATE_SCHEME, props<SchemeDetails>());
export const updateProductDetails = createAction(UPDATE_PRODUCT_DETAILS, props<ProductDetails>());
export const updateSchemesDetails = createAction(UPDATE_SCHEMES, props<{schemes:SchemeDetails[]}>());
export const updateProductsDetails = createAction(UPDATE_PRODUCTS_DETAILS, props<{ products: ProductDetails[]}>());
