// export default function searchToObject(search){
//   let params = {};
//   search = search.substring(search.indexOf('?') + 1, search.length);
//   if (search.length === 0) return params;
//   search.split(/&+/).forEach( param => {
//     let [key, value] = param.split('=');
//     key = decodeURIComponent(key);
//     value = value ? decodeURIComponent(value) : true;
//     params[key] = value;
//   });
//   return params;
// }
