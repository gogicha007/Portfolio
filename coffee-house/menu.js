/* MENU page */
import data from "./products.json" assert { type: "json" };

const body = document.body;
let loadMoreClicked = false;
const loadMoreBtn = document.getElementById("loadMore");
const checkTablet = window.matchMedia("(max-width: 768px)");
const itemList = document.getElementById("itemList");
const selectMenu = document.querySelectorAll('input[name="radio-menu"]');
const itemTemplate = `
    <div class="item">
        <div class="item-image"></div>
        <div class="item-details">
            <h3></h3>
            <p></p>
            <h3></h3>
        </div>
    </div>`;

/* Generate Items */
const category = () =>
  document.querySelector('input[name="radio-menu"]:checked').value;
const list = (category) => data.filter((item) => item.category === category);

generateItemList(list(category()));

selectMenu.forEach((item) =>
  item.addEventListener("click", () => {
    itemList.innerHTML = "";
    generateItemList(list(category()));
  })
);

function generateItemList(list) {
  list.forEach((product) => itemList.appendChild(generateItem(product)));
  loadMoreClicked = false;
  handleTabletMode(window.matchMedia("(max-width: 768px)"));
}

function generateItem(product) {
  const item = elementFromHtml(itemTemplate);
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name.split(" ").join("_").toLowerCase();
  item.querySelector(".item-image").appendChild(img);
  item.querySelector(".item-details").children[0].innerText = product.name;
  item.querySelector(".item-details").children[1].innerText =
    product.description;
  item.querySelector(
    ".item-details"
  ).children[2].innerText = `$${product.price}`;
  item.dataset.data = JSON.stringify(product);
  item.addEventListener("click", (e) => handleClick(e));
  return item;
}

function elementFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
/* end of Generate Items */

/* Load More functionality */
loadMoreBtn.addEventListener("click", () => {
  loadMoreClicked = true;
  loadMoreBtn.style.display = "none";
  itemList.querySelectorAll(".item:nth-of-type(n)").forEach((i) => {
    i.style.display = "flex";
  });
});

checkTablet.addEventListener("change", handleTabletMode);

function handleTabletMode(e) {
  if (e.matches) {
    if (loadMoreClicked) {
      itemList.querySelectorAll(".item:nth-of-type(n)").forEach((i) => {
        i.style.display = "flex";
      });
    } else {
      {
        list(category()).length > 4 &&
          itemList.querySelectorAll(".item:nth-of-type(n+5)").forEach((i) => {
            i.style.display = "none";
          });
      }
      loadMoreBtn.style.display = list(category()).length > 4 ? "flex" : "none";
    }
  } else {
    loadMoreBtn.style.display = "none";
    itemList.querySelectorAll(".item:nth-of-type(n)").forEach((i) => {
      i.style.display = "flex";
    });
  }
}
/* eof Load More func*

/* open the MODAL */
function handleClick(e) {
  const obj = JSON.parse(e.currentTarget.dataset.data);
  openCard(obj);
}

/* MODAL functions */
const form = document.getElementById("cardForm");
const card = document.querySelector(".card");
const itemSize = document.getElementById("size");
const itemAdditives = document.getElementById("additive");
const cardClose = document.getElementById("close-modal");

itemSize.addEventListener("click", handleOptions);
itemAdditives.addEventListener("click", handleOptions);

function openCard(obj = {}) {
  body.style.setProperty("overflow", "hidden");
  if (Object.keys(obj).length > 0) {
    card.style.display = "flex";
    card.querySelector(".item-img").children[0].src = obj.image;
    card.querySelector(".item-img").children[0].alt = obj.name
      .split(" ")
      .join("_")
      .toLowerCase();
    card.querySelector(".item-title").children[0].innerText = obj.name;
    card.querySelector(".item-title").children[1].innerText = obj.description;
    console.log(window.price.value);
    window.price.value = `$${obj.price}`;
    window["size-s-label"].children[1].innerText = obj.sizes.s.size;
    window["size-m-label"].children[1].innerText = obj.sizes.m.size;
    window["size-l-label"].children[1].innerText = obj.sizes.l.size;
    window["additive-1-label"].children[1].innerText = obj.additives[0].name;
    window["additive-2-label"].children[1].innerText = obj.additives[1].name;
    window["additive-3-label"].children[1].innerText = obj.additives[2].name;
    card.dataset.price = obj.price;
    card.dataset.sizes = JSON.stringify(obj.sizes);
    // console.log(obj);
  }
}

function handleOptions(e) {
  const size = [...itemSize.querySelectorAll("input")].find(
    (s) => s.checked === true
  ).value;
  const sizePrice = Number(JSON.parse(card.dataset.sizes)[size]["add-price"]);
  const additives = [...itemAdditives.querySelectorAll("input")].reduce(
    (acc, val) => (val.checked ? (acc += 1) : acc),
    0
  );

  window.price.value = `$${(
    Number(card.dataset.price) +
    sizePrice +
    additives * 0.5
  ).toFixed(2)}`;
}

document.onclick = (e) => {
  if (e.target.classList.contains("modal")) {
    e.preventDefault();
    closeModal(e);
  }
};
cardClose.onclick = (e) => {
  e.preventDefault();
  closeModal();
};

function closeModal(e) {
  card.style.display = "none";
  body.style.setProperty("overflow", "auto");
  form.reset();
}
/* end of MENU codes */
