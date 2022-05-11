import "./../styles/styles.scss";
import * as template from "./../templates/product_detail.hbs";
import * as footer from "./footer.js";
import * as header from "./header.js";



function init() {
  let container = document.getElementById("productDetail");
  if (container) {
    container.innerHTML = template({ title: "productDetail" });
  }
}

async function getProductDetails() {
    try {
      let response = await helper.request("products", "GET");
      let products = await response.json();
      return products;
    } catch (err) {
      console.log("Error: ", err);
    }
  }


document.addEventListener("DOMContentLoaded", () => {
    header.init("ProductDetail");
    footer.init();
    init();
  });