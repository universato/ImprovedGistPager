window.onload = function(){
  const options = {
      subtree:       true,
      childList:     true,
      characterData: true,
      attributes:    true
  };
  const observer = new MutationObserver(function(_mutations){
      if(!document.getElementById('pager_last')){ addPager(); }
  });
  observer.observe(document.body, options);

  addPager();
}

function addPager(){
  const maxPagerElementCount = 9; // Odd

  const displayCount = 10; // the max number of gits per page
  const pager = document.getElementsByClassName('pagination')[0];
  const firstPath  = location.pathname.split('/')[1]
  const secondPath = "/" + (location.pathname.split('/')[2] || '')
  const counters = document.getElementsByClassName('Counter');

  if(!pager){ return false; }

  let gistsCount = -1;
  if(['discover', 'forked', 'starred'].includes(firstPath)){
      gistsCount = displayCount * 100;
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
                                Math.min(currentPageNumber - (maxPagerElementCount - 1) / 2,
                                        pageCount - maxPagerElementCount + 1
                                        )
                              );


  // Insert pager elements
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