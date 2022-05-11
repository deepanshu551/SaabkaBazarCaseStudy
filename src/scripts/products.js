import "./../styles/styles.scss"
import template from "./../templates/products.hbs";
import productListTemplate from "./../templates/productList.hbs";
import * as footer from "./footer.js";
import * as header from "./header.js";
import * as helper from "../helper/general.helper.js";



let allProducts = [];
const templateData = {
  categories: [],
  products: [],
  selectedCategoryName: "All Products",
};
let selectedCategory;

async function getProducts() {
  try {
    let response = await helper.request("products", "GET");
    let products = await response.json();
    return products;
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function getCategory() {
  try {
    let response = await helper.request("categories", "GET");
    let categories = await response.json();
    if (categories && categories.length) {
      categories = categories
        .filter((category) => category.enabled)
        .sort((a, b) => a.order - b.order);
    }
    return categories;
  } catch (err) {
    console.log("Error: ", err);
  }
}

function toggleCategoryDropdown() {
  const categoryDropdownList = document.querySelector(
    ".category-dropdown-list"
  );
  categoryDropdownList.classList.toggle("show");
}

function categorizedProducts(e) {
  if (e && e.target && e.target.dataset && e.target.dataset.id) {
    const id = e.target.dataset.id;
    if (templateData.products) {
      templateData.products = allProducts.filter(
        (product) => product.category === id
      );
    }
    highlightSelectedCategory(e);
    updateProductDOM();

    document.querySelector(".category-dropdown-btn").innerHTML =
      templateData.selectedCategoryName;
  }
}

function updateProductDOM() {
  const updatedHTML = productListTemplate(templateData);
  document.querySelector(".product-list-container").innerHTML = updatedHTML;
  registerBuyEvent();
}

function highlightSelectedCategory(e) {
  if (selectedCategory && selectedCategory.srcElement) {
    selectedCategory.srcElement.classList.remove("active");
  } else if (selectedCategory) {
    selectedCategory.classList.remove("active");
  }

  if (e && e.srcElement) {
    e.srcElement.classList.add("active");
    selectedCategory = e;
    templateData.selectedCategoryName = e.srcElement.innerHTML;
  } else {
    const categoryListBtns = document.querySelectorAll(".category-list-btn");
    categoryListBtns.forEach((btn) => {
      if (btn.dataset.id === e.target.dataset.id) {
        btn.classList.add("active");
        selectedCategory = btn;
        templateData.selectedCategoryName = btn.innerHTML;
      }
    });
  }
}

function registerBuyEvent() {
  const buyBtns = document.querySelectorAll(".buy-btn");
  buyBtns.forEach((btn) => {
    btn.addEventListener("click", addToCart);
  });
}

function addToCart(e) {
  const newItemID = e.target.dataset.id;
  const newItemDetails = allProducts.find(
    (product) => product.id === newItemID
  );
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  if (cartItems && cartItems.length) {
    const existingItem = cartItems.find((item) => item.id === newItemID);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * existingItem.price
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      newItemDetails.quantity = 1;
      newItemDetails.totalPrice = newItemDetails.quantity * newItemDetails.price
      cartItems.push(newItemDetails);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  } else {
    const newCart = [];
    newItemDetails.quantity = 1;
    newItemDetails.totalPrice = newItemDetails.quantity * newItemDetails.price
    newCart.push(newItemDetails);
    localStorage.setItem("cartItems", JSON.stringify(newCart));
  }
  header.setCartItemsLength();

}

async function init() {
  allProducts = await getProducts();
  templateData.products = [...allProducts];
  templateData.categories = await getCategory();

  const container = document.getElementById("products");
  if (container) {
    container.innerHTML = template(templateData);

    const categoryListBtns = document.querySelectorAll(".category-list-btn");
    categoryListBtns.forEach((btn) => {
      btn.addEventListener("click", categorizedProducts);
    });

    const categoryDropdown = document.querySelector(".category-dropdown-btn");
    categoryDropdown.addEventListener("click", toggleCategoryDropdown);

    const categoryDropdownListBtns = document.querySelectorAll(
      ".category-dropdown-list-btn"
    );
    categoryDropdownListBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        categorizedProducts(e);
        toggleCategoryDropdown();
      });
    });

    registerBuyEvent();
  }

  const urlParams = new URLSearchParams(location.search);
  if (urlParams.has("productID")) {
    const obj = { target: { dataset: { id: urlParams.get("productID") } } };
    categorizedProducts(obj);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  header.init("Products");
  footer.init();
  init();
});
