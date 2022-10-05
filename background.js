// chrome.runtime.onInstalled.addListener((infos) => {
//   chrome.tabs.create({ 'url': "https://alihunter.io/product-analysis"})

// })

let html = document.documentElement.innerHTML;

if (html.includes("shopify")) {
  $("body").append("<div id='wrapper-alihunter'></div>")
  $("#wrapper-alihunter").append("<img src='alihunter-logo.png' />")
}