import "./styles/styles.scss";
import template from "./templates/home.hbs";
import * as footer from "./scripts/footer.js";
import * as header from "./scripts/header.js";
import * as helper from "./helper/general.helper";

let slideIndex = 1;
const templateData = {
  banners: [],
  categories: [],
};

function changeSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("banner-slides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

function navigateToProducts(e) {
  if (e && e.target && e.target.dataset && e.target.dataset.id) {
    const id = e.target.dataset.id;
    location.assign(
      `${location.href}products.html?productID=${id}`
    );
  }
}

async function getBanners() {
  try {
    let response = await helper.request("banners", "GET");
    let banners = await response.json();
    if (banners && banners.length) {
      banners = banners
        .filter((banner) => banner.isActive)
        .sort((a, b) => a.order - b.order);
    }
    return banners;
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
        .map((category) => {
          const isOdd = category.order % 2 !== 0;
          if (isOdd) {
            category.reverse = "category-reverse";
          }
          return category;
        })
        .filter((category) => category.enabled)
        .sort((a, b) => a.order - b.order);
    }
    return categories;
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function init() {
  templateData.banners = await getBanners();
  templateData.categories = await getCategory();

  let container = document.getElementById("home");
  if (container) {
    container.innerHTML = template(templateData);
    showSlides(slideIndex);

    const prevBtn = document.querySelector(".prev");
    prevBtn.addEventListener("click", changeSlides.bind(null, -1));

    const nextBtn = document.querySelector(".next");
    nextBtn.addEventListener("click", changeSlides.bind(null, 1));

    const slideDots = document.querySelectorAll(".dot");
    slideDots.forEach((dot, index) => {
      dot.addEventListener("click", currentSlide.bind(null, index + 1));
    });

    const categoryBtns = document.querySelectorAll(".category-btn");
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", navigateToProducts);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  header.init('Home');
  footer.init();
  init();
});
