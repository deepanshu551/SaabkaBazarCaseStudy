import "./../styles/styles.scss";
import * as template from "../templates/register.hbs";
import * as footer from "./footer.js";
import * as header from "./header.js";


function init() {
  let container = document.getElementById("register");
  if (container) {
    container.innerHTML = template({ title: "register" });
  }
}



document.addEventListener("DOMContentLoaded", () => {
  header.init("Register");
  footer.init();
  init();
  
});
