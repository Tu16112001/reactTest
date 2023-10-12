//Category
export const API_CATEGORY = 'https://localhost:7200/api/category';


//Product
export const API_PRODUCT = 'https://fakestoreapi.com/products';
export const deteleProductImage = (filename) => {
  return API_PRODUCT + '/images/' + filename;
};
export const getProductImageUrl = (filename) => {
  return API_PRODUCT + '/images/' + filename;
};

//Login
export const API_LOGIN = 'https://fakestoreapi.com/users';

//Order
export const API_ORDER = '';

//Players
export const API_PLAYER = '';
export const getPlayerImageUrl = (filename) => {
  return API_PLAYER + '/images/' + filename;
};
export const detelePlayerImage = (filename) => {
  return API_PLAYER + '/images/' + filename;
};