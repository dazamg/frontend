import React, { useState, useEffect } from 'react'
import {getProductsByCount, searchByFilter} from '../functions/Product'
import {getCategories} from '../functions/category'
import {getSubs} from '../functions/sub'
import {useSelector, useDispatch} from 'react-redux'
import ProductCard from './cards/ProductCard'
import {  DownSquareOutlined, DollarOutlined } from '@ant-design/icons';
import { Menu, Slider, Checkbox, Radio} from "antd";

const { SubMenu, ItemGroup } = Menu;
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds ] = useState([])
  const [subs, setSubs ] = useState([])
  const [sub, setSub ] = useState("")
  const [brands, setBrands] = useState(["Nike", "Denim", "Addidas", "Target", "Under Amor"])
  const [brand, setBrand] = useState("")
  const [colors, setColors] = useState(["Black", "Brown", "Silver", "White", "Blue", "Grey"])
  const [color, setColor] = useState("")
  const [shipping, setShipping ] = useState("")

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    // fetch categories
    getCategories().then((res) => setCategories(res.data));
    // fetch subcategories
    getSubs().then((res) => setSubs(res.data));
  }, []);

  const filterProducts = (arg) => {
    searchByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };



  // 1. load products by default on page load
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      filterProducts({ query: text });
      if(!text){
        loadAllProducts()
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products based on price range
  useEffect(() => {
    console.log("ok to request");
    filterProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([])
    setPrice(value);
    setSub("")
    setBrand("")
    setColor("")
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // load products base on the category 
  // show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  // handle check functiom
  const handleCheck = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0,0])
    setSub("")
    setBrand("")
    setColor("")
    setShipping("")
    // console.log(e.target.value)
    let newCheck = [...categoryIds]
    let nextChecked = e.target.value
    let foundNewCheck = newCheck.indexOf(nextChecked) // index or -1

    //indexOf method ?? if not found returns -1 else return index
    if(foundNewCheck === -1) {
      newCheck.push(nextChecked);
    } else {
      // if found pull out one item from index
      newCheck.splice(foundNewCheck, 1)
    }
    setCategoryIds(newCheck);
    // console.log(newCheck)
    filterProducts({category: newCheck})
  }

  // show products by sub category
  const showSubs = () =>
  subs.map((s) => (
    <div
      key={s._id}
      onClick={() => handleSub(s)}
      className="p-1 m-1 badge badge-secondary"
      style={{ cursor: "pointer" }}
    >
      {s.name}
    </div>
  ));

  const handleSub = (sub) => {
    // console.log("SUB Cat", s)
    setSub(sub)
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([])
    setPrice([0, 0]);
    filterProducts({ sub });
    setBrand("")
    setColor("")
    setShipping("")
  }

  // show products by brands
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-4"
      >
      {b}
      </Radio>
      
  ));

  const handleBrand = (e) => {
    setSub("")
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([])
    setPrice([0, 0]);
    setColor("")
    setShipping("")
    setBrand(e.target.value)
    filterProducts({ brand: e.target.value });
  }

  // show products by colors
  const showColors = () =>
    colors.map((c) => (
      <Radio
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
      {c}
      </Radio>   
  ));

  const handleColor = (e) => {
    setSub("")
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([])
    setPrice([0, 0]);
    setBrand("")
    setShipping("")
    setColor(e.target.value)
    filterProducts({ color: e.target.value });
  }
  // show products by shipping
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4"
        onChange={handleShipping}
        value="Yes"
        checked={shipping === "Yes"} 
      >
       Yes
      </Checkbox>
      <Checkbox
        className="pb-2 pl-4"
        onChange={handleShipping}
        value="No"
        checked={shipping === "No"} 
      >
        No
      </Checkbox>
    </>
  )
    
  const handleShipping = (e) => {
    setSub("")
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([])
    setPrice([0, 0]);
    setBrand("")
    setColor("")
    setShipping(e.target.value)
    filterProducts({ shipping: e.target.value });
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />

          <Menu defaultOpenKeys={["1", "2", "3", "4","5","6"]} mode="inline">
            {/* Price */}
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="300"
                />
              </div>
            </SubMenu>

              {/* Categories */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div style={{ marginTop:"-10px"}}>
                {showCategories()}
              </div>
            </SubMenu>

            {/* Sub Categories */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div style={{ marginTop:"-10px"}} className="pl-4 pr-4">
                {showSubs()}
              </div>
            </SubMenu>

            {/* brands */}
                     <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div style={{ marginTop:"-10px"}} className="pr-4">
                {showBrands()}
              </div>
            </SubMenu>

                {/* Colors */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div style={{ marginTop:"-10px"}} className="pr-4">
                {showColors()}
              </div>
            </SubMenu>

                {/* Shipping */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ marginTop:"-10px"}} className="pr-4">
                {showShipping()}
              </div>
            </SubMenu>


          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h2 className="text-success text-center">𝕮𝖑𝖆𝖎𝖗𝖊'𝖘</h2>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
