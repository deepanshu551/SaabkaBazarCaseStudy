import * as template from "./../templates/header.hbs";
import cartTemplate from "./../templates/cart.hbs";

const navList = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Products",
    link: "/products.html",
  },
];

const navAuth = [
  {
    name: "SignIn",
    link: "/signin.html",
  },
  {
    name: "Register",
    link: "/register.html",
  },
];

let cartItems = [];
let cartItemsLength = 0;
let cartItemsLengthEle;

function openCart() {
  const cart = document.querySelector(".cart-overlay");
  cart.classList.toggle("show");
  cartInit();
}

function closeCart() {
  const cart = document.querySelector(".cart-overlay");
  cart.classList.remove("show");
}

function getCartItems() {
  cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItemsLength = cartItems && cartItems.length ? cartItems.length : 0;
}

function changeQuantity(e) {
  const id = e.target.dataset.id;
  const action = e.target.dataset.action;
  const item = cartItems.find(item => item.id === id);
  if(action === "plus"){
    item.quantity += 1;
    item.totalPrice = item.quantity * item.price
  } else {
    item.quantity -= 1;
    item.totalPrice = item.quantity * item.price
    if(item.quantity <= 0){
      cartItems = cartItems.filter(item => item.quantity > 0);
    }
  }
  localStorage.setItem('cartItems',JSON.stringify(cartItems));
  setCartItemsLength();
  cartInit();
}

function cartInit() {
  let totalItemsCost = 0;
  cartItems.forEach((item) => {
    item.totalPrice = item.price * item.quantity;
    totalItemsCost += item.totalPrice;
  });
  const templateData = {
    cartNotEmpty: cartItemsLength > 0 ? "hidden" : "",
    cartEmpty: cartItemsLength <= 0 ? "hidden" : "",
    itemCount: cartItemsLength,
    cartItems,
    totalItemsCost,
  };

  const cart = cartTemplate(templateData);
  document.querySelector(".cart-overlay").innerHTML = cart;
  document
    .querySelector(".cart-close--icon")
    .addEventListener("click", closeCart);
  const quantityBtns = document.querySelectorAll(".btn-quantity");
  quantityBtns.forEach((btn) => {
    btn.addEventListener("click", changeQuantity);
  });
}

export function setCartItemsLength() {
  getCartItems();
  if (cartItemsLengthEle) {
    cartItemsLengthEle.innerHTML = cartItemsLength;
  }
}

export function init(currentPage) {
  navList.forEach((item) => {
    if (item.name === currentPage) {
      item.status = "active";
    } else {
      item.status = "";
    }
  });
  navAuth.forEach((item) => {
    if (item.name === currentPage) {
      item.status = "active";
    } else {
      item.status = "";
    }
  });

  let container = document.getElementById("header");
  if (container) {
    container.innerHTML = template({ navList, navAuth });

    document
      .querySelector(".cart-btn button")
      .addEventListener("click", openCart);

    cartItemsLengthEle = document.querySelector("#cartItemsLength");
    setCartItemsLength();
  }
}
