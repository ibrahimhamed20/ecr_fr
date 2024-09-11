import{f as h}from"./chunk-BTTLIBHC.js";import{a as e}from"./chunk-ORBEOOVW.js";import{c as u}from"./chunk-V6BOHIKZ.js";import{O as d,T as g,n as s}from"./chunk-CD6VLWCW.js";function P(i,n){let t=new FileReader;t.onload=r=>{let a=r.target.result;console.log("CSV Data:",a);let o=document.createElement("a"),p=URL.createObjectURL(i);o.href=p,o.download=n,o.click(),URL.revokeObjectURL(p)},t.readAsText(i)}function l(i){return Object.entries(i).filter(([n,t])=>t!=null).map(([n,t])=>`${encodeURIComponent(n)}=${encodeURIComponent(t)}`).join("&")}var C=(()=>{class i{_http;http;constructor(t,r){this._http=t,this.http=r}getProducts(t){let r=l({"Pagination.PageSize":t.pageSize,"Pagination.PageNumber":t.pageNumber,ClassificationId:t.ClassificationId,Keyword:t.Keyword,BrandId:t.BrandId,CategoryId:t.CategoryId});return this._http.get(`${e.URL_API}Products?${r}`)}deleteProduct(t){return this._http.delete(`${e.URL_API}Products/${t}`)}getCategories(){return this._http.get(`${e.URL_API}Categories`).pipe(s(t=>t.data.result||[]))}getClassifications(){return this._http.get(`${e.URL_API}Classifications`).pipe(s(t=>t.data.classifications||[]))}getAllBrands(t,r){return this._http.get(`${e.URL_API}Brands?PageSize=${t}&PageNumber=${r}`).pipe(s(a=>a.data.result||[]))}getCountries(){return this._http.get(`${e.URL_API}Addresses/country`)}getTags(){return this._http.get(`${e.URL_API}Tags`)}downloadProdctsAsCsv(){return this.http.get(`${e.URL_API}Products/export/csv`,{responseType:"blob"})}getAllUnits(t,r,a){return this._http.get(`${e.URL_API}Units?Pagination.PageSize=${t}&Pagination.PageNumber=${r}&Keyword=${a}`)}deleteUnit(t){return this._http.delete(`${e.URL_API}Units/${t}`)}addUnit(t){return this._http.post(`${e.URL_API}Units`,t)}editUnit(t){return this._http.put(`${e.URL_API}Units`,t)}getUnitById(t){return this._http.get(`/api/units/${t}`)}getCategoryById(t){return this._http.get(`/api/Categories/${t}`)}getAllCategories(t,r,a){return this._http.get(`${e.URL_API}Categories?Pagination.PageSize=${t}&Pagination.PageNumber=${r}&Keyword=${a}`)}getAllProductCatalog(t,r,a){return this._http.get(`${e.URL_API}Classifications/catalog?Pagination.PageSize=${t}&Pagination.PageNumber=${r}&Keyword=${a}`)}deleteCategory(t){return this._http.delete(`${e.URL_API}Categories/${t}`)}addCategory(t){return this._http.post(`${e.URL_API}Categories`,t)}editCategory(t){return this._http.put(`${e.URL_API}Categories`,t)}blobStoreUrl=`${e.URL_API}BlobsStore/file`;uploadGalaryImage(t){return this._http.post(this.blobStoreUrl,t)}getAllVariants(t){return this._http.get(`${e.URL_API}Variants?PageSize=${t.size}&PageNumber=${t.number}`)}getVariantById(t){return this._http.get(`${e.URL_API}Variants/${t}/Details`)}editVariant(t){return this._http.put(`${e.URL_API}Variants`,t)}addVariant(t){return this._http.post(`${e.URL_API}Variants`,t)}addVariantValue(t){return this._http.post(`${e.URL_API}Variants/variantValues`,t)}searchVariants(t){return this._http.get(`${e.URL_API}Variants/name?name=${t}`)}deleteVariant(t){return this._http.delete(`${e.URL_API}Variants/${t}`)}getAllTags(t){return this._http.get(`${e.URL_API}Tags?TagTypeIds=2&PageSize=${t.pageSize}&PageNumber=${t.pageNumber}`)}deleteTags(t){return this._http.delete(`${e.URL_API}Tags/${t}`)}addTags(t){return this._http.post(`${e.URL_API}Tags`,t)}editTags(t){return this._http.put(`${e.URL_API}Tags`,t)}getTagsById(t){return this._http.get(`/api/Tags/${t}`)}static \u0275fac=function(r){return new(r||i)(g(h),g(u))};static \u0275prov=d({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();export{P as a,C as b};