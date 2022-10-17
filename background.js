// tagChoose = nome do elemento que vai receber uma tag html
// tagInserted = Array com nome(s) das tag(s) que serão inserida(s) no elemento
function ComponentCreateMultipleTags(tagChoose, tagInserted) {
  tagInserted.forEach((tag) => {
    $(tagChoose).append(tag);
  });
}

function createAllElementsExtension() {
  $("body").append("<div id='wrapper-alihunter'></div>");

  const arrayInsertWrapper = [
    "<div class='whiteboard-alihunter'></div>",
    "<div class='content-alihunter'></div>",
  ];
  ComponentCreateMultipleTags("#wrapper-alihunter", arrayInsertWrapper);

  const arrayInsertContet = [
    "<div class='icon-alihunter'></div>",
    "<div class='menus-alihunter'></div>",
  ];
  ComponentCreateMultipleTags(".content-alihunter", arrayInsertContet);

  ComponentCreateMultipleTags(".whiteboard-alihunter", [
    "<ul id='list-products-ah'></ul>",
  ]);
  $(".whiteboard-alihunter").append(`<div id="sentinela" />`);

  $(".menus-alihunter").append(
    "<button type='button' class='box-menu'><p>Orders</button>"
  );
}

async function getDataAPIShopify(limit) {
  // Função que busca os produtos, limite minimo de 250
  console.log(limit)
  const productsAPI = await fetch(
    `${urlCurrentWebsite}/products.json?limit=${limit}`
  )
    .then(async (resp) => await resp.json())
    .then((data) => data.products);

  return productsAPI
}

const formattedListProducts = async (slice = 30) => {
  // Função que formata os dados vindo do Fetch, limitando o render de 30 em 30 itens.
  let limit = slice < 150 ? 150 : allProducts.length;
  if (slice === 30 || slice > limit) {
    console.log('limite', limit)
    slice >= 150 ? limit += 150 : null;
    everyProducts = await getDataAPIShopify(limit).then((resp) => {
      let orderProducts = resp.sort(function (a, b) {
        return a.updated_at < b.updated_at
          ? -1
          : a.updated_at > b.updated_at
          ? 1
          : 0;
      });
      return orderProducts;
    });
  }
  console.log('AllTest', everyProducts)
  renderProducts = everyProducts.slice(0, slice)
    
  
};

const html = document.documentElement.innerHTML;
const urlCurrentWebsite = window.location.origin;

if (html.includes("shopify")) {
  createAllElementsExtension();

  var everyProducts;
  var allProducts;
  var renderProducts = [];

  let iconUrl = chrome.runtime.getURL("logoAliHunter.svg");
  $(".icon-alihunter").append("<img />")[0].querySelector("img").src = iconUrl;

  let iconOrders = chrome.runtime.getURL("ordersIcon.svg");

  $(".icon-alihunter")[0].addEventListener("click", () => {
    window.open("https://alihunter.io/product-analysis", "_blank").focus();
  });

  fetch(iconOrders)
    .then((resp) => resp.text())
    .then((html) => {
      $(".box-menu").prepend(html);
    })
    .catch((err) => console.log(err));

  let button = $(".box-menu")[0];

  // https://stackoverflow.com/questions/61911591/react-intl-with-relativetime-formatting
  function getRelativeTime(time) {
    const now = new Date();
    const diff = Math.abs(time - now);
    const mark = (time - now) >> -1 || 1;

    if (diff === 0)
      return new Intl.RelativeTimeFormat("en").format(0, "second");

    const times = [
      { type: "second", seconds: 1000 },
      { type: "minute", seconds: 60 * 1000 },
      { type: "hour", seconds: 60 * 60 * 1000 },
      { type: "day", seconds: 24 * 60 * 60 * 1000 },
      { type: "week", seconds: 7 * 24 * 60 * 60 * 1000 },
      { type: "month", seconds: 30 * 24 * 60 * 60 * 1000 },
      { type: "year", seconds: 12 * 30 * 24 * 60 * 60 * 1000 },
    ];

    let params = [];
    for (let t of times) {
      const segment = Math.round(diff / t.seconds);
      // console.log('Oq é segment?', segment);
      if (segment >= 0 && segment < 10) {
        params = [(segment * mark) | 0, t.type];
        break;
      }
    }
    return new Intl.RelativeTimeFormat("en").format(...params);
  }

  button.addEventListener("click", () => {
    $(".whiteboard-alihunter").toggleClass("show-whiteboard");
    $(".box-menu").toggleClass("selected-option-ah");

    if ($(".whiteboard-alihunter").hasClass("show-whiteboard")) {
      console.log(renderProducts)
      const intersectionObserver = new IntersectionObserver(async (entries) => {
        // console.log("Estamos observando", entries[0].isIntersecting)
        let page = 0;
        page = renderProducts.length + 30;
        if (entries[0].isIntersecting) {
          formattedListProducts(page);

          renderProducts.map((product, index) => {
            const isoDate = new Date(product.updated_at);
            let time = getRelativeTime(isoDate);
            $("#list-products-ah").prepend(`<li>
                <time>${time}</time>
                <img src=${product.images[0].src} />
                <abbr>${product.title}</abbr>
              </li>`);
  
            if (renderProducts.length === index) {
              $("#list-products-ah").append(`<li id="sentinela">
                <time>${time}</time>
                <img src=${product.images[0].src} />
                <abbr>${product.title}</abbr>
              </li>`)
            }
          });
        }
      });

      intersectionObserver.observe(document.querySelector("#sentinela"));

      // Criar sistema que possibilita buscar os dados dinâmico, conforme o scroll page.

      // Quando executar a função de scroll
      //
      // Fetch API performed, now find products
    }
  });
}
