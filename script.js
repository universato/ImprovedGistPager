window.onload = function(){
  var options = {subtree: true, childList: true, characterData: true, attributes: true};
  var observer = new MutationObserver(function(mutations){
    if(!isInserted()){
      addPager();
    }
  });

  observer.observe(document.body, options);
  addPager();
}

function isInserted(){
  if(document.getElementById('pager_last')){
    return true;
  }
  return false;
}

function addPager(){
  var displayCount = 10;
  var gistsCount = document.getElementsByClassName('counter')[0].childNodes[0].textContent;
  var pageCount = 0;
  var pager = document.getElementsByClassName('pagination');
  var pagerHtml = pager[0].innerHTML;
  var userName = document.title.replace(/'s Gists/, '');
  var pagerElementBase = pager[0].childNodes[0].cloneNode(true);
  var currentPageNumber = 0;
  var pagerElementCount = 0;
  var anchorElements = [];
  var pagerCounter = 1;
  var startNumber = 0;

  /**
   * Set number of pages.
   */
  if(gistsCount % displayCount == 0){
    pageCount = gistsCount / displayCount;
  }else{
    pageCount = Math.floor(gistsCount / displayCount) + 1;
  }

  /**
   * Set number of pager elements.
   */
  if(pageCount > 9){
    pagerElementCount = 9;
  }else{
    pagerElementCount = pageCount;
  }

  /**
   * If page is not set, set 1.
   */
  if(window.location.search.match(/\?page=([0-9]+)/)){
    currentPageNumber = parseInt(window.location.search.match(/\?page=([0-9]+)/)[1]);
  }else{
    currentPageNumber = 1;
  }

  /**
   * Disable first button when first page is displayed. 
   */
  if(currentPageNumber == 1 || currentPageNumber == 0 || currentPageNumber == null){
    pager[0].innerHTML = '<span id="pager_first" class="disabled">First</span>';
  }else{
    pager[0].innerHTML = '<a id="pager_first" href="/' + userName + '">First</a>';
  }

  pager[0].innerHTML += pagerHtml;

  /**
   * Disable last button when last page is displayed.
   */
  if(currentPageNumber == pageCount){
    pager[0].innerHTML += '<span id="pager_last" class="disabled">Last</span>';
  }else{
    pager[0].innerHTML += '<a id="pager_last" href="/' + userName + '?page=' + pageCount + '">Last</a>';
  }

  /**
   * Set start number.
   */
  if(currentPageNumber < Math.floor(pagerElementCount / 2) + 2){
    startNumber = 1; 
  }else if(currentPageNumber > pageCount - Math.floor(pagerElementCount / 2)){
    startNumber = pageCount - (pagerElementCount - 1); 
  }else{
    startNumber = currentPageNumber - Math.floor(pagerElementCount / 2);
  }

  /**
   * Insert pager elements.
   */
  for(pagerCounter = startNumber + pagerElementCount - 1; pagerCounter >= startNumber; pagerCounter--){
    if(parseInt(currentPageNumber) == pagerCounter){
      anchorElement = document.createElement('span');
      anchorElement.setAttribute('class', 'disabled');
      anchorElement.textContent = pagerCounter;
      pager[0].insertBefore(anchorElement, pager[0].childNodes[3]);
    }else{
      anchorElement = document.createElement('a');
      anchorElement.setAttribute('href', '/' + userName + '?page=' + pagerCounter);
      anchorElement.textContent = pagerCounter;
      pager[0].insertBefore(anchorElement, pager[0].childNodes[3]);
    }
  }
}
