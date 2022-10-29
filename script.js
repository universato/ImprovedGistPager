// ==UserScript==
// @name         improved_gist_pager
// @namespace    https://greasyfork.org/ja/users/570127
// @version      0.1.1
// @description  You can move one page by pressing the left and right key. 十字キーの左右で1ページ移動できます。
// @author       universato
// @license      MIT
// @match        https://gist.github.com/*
// @supportURL   https://twitter.com/universato
// ==/UserScript==

addPager();

setInterval(intervalKeepPager, 2000);
function intervalKeepPager(){
    let pager_last_element = document.getElementById('pager_last');
    if(!pager_last_element){ addPager(); }
}

function addPager(){
  const maxPagerElementCount = 9; // Odd

  const displayCount = 10; // the max number of gits per page
  const pager = document.getElementsByClassName('pagination')[0];
  const firstPath = location.pathname.split('/')[1]
  const secondPath = "/" + (location.pathname.split('/')[2] || '')
  const counters = document.getElementsByClassName('Counter');

  if(!pager){ return false; }

  let gistsCount = -1;
  if(['discover', 'forked', 'starred'].includes(firstPath)){
      gistsCount = displayCount * 100; // 1000 gits = 10 gists/page * 100 page
  }else if(secondPath === '/forked'){
      gistsCount = counters[1].innerText
  }else if(secondPath === '/starred'){
      gistsCount = counters[2].innerText
  }else{
      gistsCount = counters[0].innerText;
  }

  const pageCount = Math.ceil(gistsCount / displayCount);
  const pagerElementCount = Math.min(pageCount, maxPagerElementCount);

  const params = new URLSearchParams(location.search)
  const currentPageNumber = Number(params.get('page') || 1);

  let firstHTML = '';
  if(currentPageNumber <= 1){
      firstHTML = '<span id="pager_first" class="disabled">First</span>';
  }else{
      firstHTML = `<a id="pager_first" href="${location.pathname}?${params}">First</a>`;
  }

  let lastHTML = '';
  if(currentPageNumber === pageCount || pageCount <= 1){
      lastHTML = '<span id="pager_last" class="disabled">Last</span>';
  }else{
      params.set('page', pageCount);
      lastHTML = `<a id="pager_last" href="${location.pathname}?${params}">Last</a>`;
  }

  pager.innerHTML = firstHTML + pager.innerHTML + lastHTML;

  const startNumber = Math.max(1,
                                Math.min(currentPageNumber - Math.ceil((maxPagerElementCount - 1) / 2),
                                        pageCount - maxPagerElementCount + 1
                                        )
                              );


  // Insert pager elements
  let anchorElement;
  for (let pagerIndex = startNumber + pagerElementCount - 1; pagerIndex >= startNumber; pagerIndex--){
      if(pagerIndex === currentPageNumber){
          anchorElement = document.createElement('span');
          anchorElement.setAttribute('class', 'disabled');
      }else{
          anchorElement = document.createElement('a');
          params.set('page', pagerIndex);
          anchorElement.setAttribute('href', location.pathname + '?' + params);
      }
      anchorElement.textContent = pagerIndex;
      pager.insertBefore(anchorElement, pager.childNodes[2]);
  }

  return true;
}

// Add shortcuts to turn page by left and right kye
(function() {
  document.addEventListener('keydown', function (event) {
      const activeTagName = document.activeElement.tagName;
      if (['TEXTAREA', 'INPUT'].includes(activeTagName)){ return false; }

      const pager = document.getElementsByClassName('pagination')[0];
      if(!pager){ return false; }
      for (let element of pager.children) {
          if(element.nodeName === 'A') {
              if(event.key === 'ArrowLeft' && element.innerText === 'Newer'){ element.click(); }
              if(event.key === 'ArrowRight' && element.innerText === 'Older'){ element.click(); }
          }
      }
  }, false);
})();
