const elemPage = document.querySelector('#Page');
const elemLoad = document.querySelector('#Load');
let arr = [];
let currentIndex = 0;

setInit();
getData();
setEvent();

function setInit() {
  elemLoad.innerHTML = `<div class="init__body">
                          <img src="https://illinoislock.com/assets/images/loading.gif" alt="">
                          <p class="init__text">資料下載中...請稍後！</p>
                        </div>`
}

function getData() {
  const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx'
  fetch(api)
  .then(res => res.json())
  .then(data => {
    dataSplit(data);
    setPage(data);
    setTemplate(currentIndex);
    elemLoad.style = 'display:none';
  })
  .catch(err => {
    if (err) {
      alert('資料來源有誤!');
    }
  })
}

function dataSplit(data) {
  for (let i = 0, len = data.length; i < len; i += 10) {
    arr.push(data.slice(i, i + 10));
  }
}

function setPage(data) {
  let pageCode = '';
  let i = 0;
  data.forEach((item, index) => {
    if (index % 10 === 0) {
      pageCode += `<button class="nav__page" type="button" data-id="${i}">${i + 1}</button>`;
      i += 1;
    }
  });
  elemPage.innerHTML = pageCode;
  elemPage.children[currentIndex].classList.add('js-nav__page');
}

function setTemplate(startNum) {
  const elemTable = document.querySelector('#Table');
  let str = '';
  for (let i = 0; i < arr[startNum].length; i++) {
    str += `<tr class="table__ls ${changeBgColor(i)}">
              <td class="table__item text-center text-gray">${i + 1}</td>
              <td class="table__item">${arr[startNum][i].City}</td>
              <td class="table__item">
                <div class="img__inner">
                  <img class="image" src="${arr[startNum][i].PicURL}" alt="${arr[startNum][i].Name}">
                  <img class="image-hidden" src="${arr[startNum][i].PicURL}" alt="${arr[startNum][i].Name}">
                </div>    
              </td>
              <td class="table__item text-overflow">${arr[startNum][i].Url ? `<a href="${arr[startNum][i].Url}" target="_blank">${arr[startNum][i].Name}</a>` : `${arr[startNum][i].Name}`}</td>
              <td class="table__item">${textLimit(arr[startNum][i].HostWords)}</td>
            </tr>`;
  }
  elemTable.innerHTML = str;
}

function changeBgColor(index) {
  return index % 2 === 0 ? '' : 'js-table__ls';
}

function textLimit(text) {
  let len = text.length;
  return len > 50 ? text.substring(0,50) + '...' : text;
}

function setEvent() {
  elemPage.addEventListener('click', doClick);
}

function doClick(e) {
  const self = e.target;
  if (self.nodeName === 'BUTTON') {
    const prevIndex = currentIndex;
    currentIndex = parseInt(self.dataset.id);
    setTemplate(currentIndex);
    setBtn(prevIndex)
  }
}

function setBtn(index) {
  elemPage.children[currentIndex].classList.add('js-nav__page');
  elemPage.children[index].classList.remove('js-nav__page');
}