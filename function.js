const list = document.querySelector(".titles-list");
const BASE_API = "https://kitsu.io/api/edge/anime";
const next = document.querySelector(".next-pge");
const back = document.querySelector(".back-pge");
let select = document.querySelector(".sel");
let pagescount = document.querySelector(".count-page");
const input = document.querySelector(".search");
const search_btn = document.querySelector(".search-btn");
const loadingMessage = document.querySelector(".loader");
let offset = 0;
let currentSort = "";
let currentSearch = "";
let totalPages = "";
let currentPage = 1;
const sum = document.querySelector(".sub");
fetch(`${BASE_API}?page[limit]=9`)
  .then((res) => res.json())
  .then((res) => {
    const totalCount = res.meta.count;
    totalPages = Math.ceil(totalCount / 9);
    console.log("Общее количество страниц:", totalPages);
  });
function populateCards(data) {
    list.textContent = "";


  if (data.length === 0) {
    list.innerHTML = "По вашему запросу ничего нет";
    return;
  }
  loadingMessage.classList.remove("visible");
  data.forEach((anime) => {
    const { synopsis, averageRating } = anime.attributes;
    let ratingText = "";
    let syn = "";
    if (!averageRating) {
      ratingText = "Недостаточно информации";
    } else {
      ratingText = `${averageRating}/100`;
    }
    if (!synopsis) {
      syn = "Нету информации";
    } else {
      syn = `${synopsis}`;
    }
    const card = `
        <li class="titles-list-item">
          <div class="images-disc">
            <img src="${anime.attributes.posterImage.small}" alt="" class="images-dics-pic" width="300px">
            <div class="images-text">
              <p class="images-disc-text">${syn}</p>
            </div>
          </div>
          <p class="titles-list-item-text">${anime.attributes.canonicalTitle}</p>
          <p class="title-rait">${ratingText}</p>
        </li>`;
    list.insertAdjacentHTML("beforeend", card);
  });
}

fetch(`${BASE_API}?page[limit]=9&page[offset]=${offset}`)
  .then((res) => res.json())
  .then((res) => {
    const totalCount = res.meta.count;
    totalPages = Math.ceil(totalCount / 9);
    pagescount.textContent = `${currentPage} из ${totalPages}`;
    populateCards(res.data);
  });

next.addEventListener("click", next_page);

function next_page() {
  offset += 9;
  if (currentSearch.length > 0) {
    fetch(
      `${BASE_API}?page[limit]=9&page[offset]=${offset}&sort=${currentSort}&filter[text]=${currentSearch}`
    )
      .then((res) => res.json())
      .then((res) => {
        currentPage += 1;
        pagescount.textContent = `${currentPage} из ${totalPages}`;
        populateCards(res.data);
      });
  } else {
    fetch(
      `${BASE_API}?page[limit]=9&page[offset]=${offset}&sort=${currentSort}`
    )
      .then((res) => res.json())
      .then((res) => {
        currentPage += 1;
        pagescount.textContent = `${currentPage} из ${totalPages}`;
        populateCards(res.data);
      });
  }
}

back.addEventListener("click", prev_page);

function prev_page() {
  if (offset === 0) {
    return;
  }
  offset -= 9;
  if (currentSearch.length > 0) {
    fetch(
      `${BASE_API}?page[limit]=9&page[offset]=${offset}&sort=${currentSort}&filter[text]=${currentSearch}`
    )
      .then((res) => res.json())
      .then((res) => {
        currentPage -= 1;
        pagescount.textContent = `${currentPage} из ${totalPages}`;
        populateCards(res.data);
      });
  } else {
    fetch(
      `${BASE_API}?page[limit]=9&page[offset]=${offset}&sort=${currentSort}`
    )
      .then((res) => res.json())
      .then((res) => {
        currentPage -= 1;
        pagescount.textContent = `${currentPage} из ${totalPages}`;
        populateCards(res.data);
      });
  }
}

sum.addEventListener("click", sort);

function sort() {
    offset = 0; 
    currentSearch = "";
    const sor = select.value;
    if (sor === "from-high") {
      fetch(`${BASE_API}?sort=-averageRating&page[limit]=9`)
        .then((res) => res.json())
        .then((res) => {
          const totalCount = res.meta.count;
          currentPage = 1; 
          totalPages = Math.ceil(totalCount / 9);
          pagescount.textContent = `${currentPage} из ${totalPages}`;
          populateCards(res.data);
        });
      currentSort = "-averageRating";
    } else if (sor === "from-bottom") {
      fetch(`${BASE_API}?sort=averageRating&page[limit]=9`)
        .then((res) => res.json())
        .then((res) => {
          const totalCount = res.meta.count;
          currentPage = 1; 
          totalPages = Math.ceil(totalCount / 9);
          pagescount.textContent = `${currentPage} из ${totalPages}`;
          populateCards(res.data);
        });
      currentSort = "averageRating";
    } else if (sor === "from-Z-A") {
      fetch(`${BASE_API}?sort=-slug&page[limit]=9`)
        .then((res) => res.json())
        .then((res) => {
          const totalCount = res.meta.count;
          currentPage = 1; 
          totalPages = Math.ceil(totalCount / 9);
          pagescount.textContent = `${currentPage} из ${totalPages}`;
          populateCards(res.data);
        });
      currentSort = "-slug";
    } else if (sor === "from-A-Z") {
      fetch(`${BASE_API}?sort=slug&page[limit]=9`)
        .then((res) => res.json())
        .then((res) => {
          const totalCount = res.meta.count;
          currentPage = 1;
          totalPages = Math.ceil(totalCount / 9);
          pagescount.textContent = `${currentPage} из ${totalPages}`;
          populateCards(res.data);
        });
      currentSort = "slug";
    } else if (sor === "without") {
      currentSort = "";
      fetch(`${BASE_API}?page[limit]=9`)
        .then((res) => res.json())
        .then((res) => {
          const totalCount = res.meta.count;
          currentPage = 1; 
          totalPages = Math.ceil(totalCount / 9);
          pagescount.textContent = `${currentPage} из ${totalPages}`;
          populateCards(res.data);
        });
    }
  }
  

search_btn.addEventListener("click", search);
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search();
  }
});
function search() {
    offset = 0; 
  const value = input.value.trim();
  if (!value) {
    alert("error search");
    return;
  }
  fetch(`${BASE_API}?filter[text]=${value}&page[limit]=9`)
    .then((res) => res.json())
    .then((res) => {
      const totalCount = res.meta.count;
      currentPage = 1;
      totalPages = Math.ceil(totalCount / 9);
      pagescount.textContent = `${currentPage} из ${totalPages}`;
      populateCards(res.data);
    });
  input.value = "";
  currentSearch = value;
}