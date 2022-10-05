chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ 'url': "https://alihunter.io/product-analysis"})

})

let html = document.documentElement.innerHTML;

if (html.includes("shopify")) {
  $("body").append("<div class='wrapper-alihunter'></div>")
}