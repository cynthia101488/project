const elemPage = document.querySelector('#Page');
const elemLoad = document.querySelector('#Load');
let arr = [];
let currentIndex = 0;

getData();
setEvent();

function getData() {
  const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx'
  fetch(api)
  .then(res => res.json())
  .then(data => {
    arr = dataSplit(data);
    setPage(arr);
    setTemplate(currentIndex);
  })
  .catch(err => {
    if (err) {
      alert('資料來源有誤!');
    }
  })
  .finally(() => {
    elemLoad.style = 'display:none';
  });
}

function dataSplit(data) {
  const rowSize = 10;
  for (let i = 0, len = data.length; i < len; i += rowSize) {
    arr.push(data.slice(i, i + rowSize));
  }
  return arr;
}

function setPage(arr) {
  let pageCode = '';
  for (let i = 0, len = arr.length; i < len; i++) {
    pageCode += `<button class="nav__page" type="button" data-id="${i}">${i + 1}</button>`;  
  }
  elemPage.innerHTML = pageCode;
  elemPage.children[currentIndex].classList.add('js-nav__page');
}

function setTemplate(index) {
  const elemTable = document.querySelector('#Table');
  let str = '';
  const rowStartIndex = index * 10 + 1;
  arr[index].forEach((item, i) => {
    str += `<tr class="table__ls ${changeBgColor(i)}">
              <td class="table__item text-center text-gray">${rowStartIndex + i}</td>
              <td class="table__item">${item.City}</td>
              <td class="table__item">
                <div class="img__inner">
                  <img class="image" src="${item.PicURL}" alt="${item.Name}">
                  <img class="image-hidden" src="${item.PicURL}" alt="${item.Name}">
                </div>    
              </td>
              <td class="table__item text-overflow">${item.Url ? `<a href="${item.Url}" target="_blank">${item.Name}</a>` : `${item.Name}`}</td>
              <td class="table__item">${textLimit(item.HostWords)}</td>
            </tr>`;
  });
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