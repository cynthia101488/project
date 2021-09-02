class Food {
  constructor() {
    this.pageObject = {
      foodArr: [],
      currentIndex: 0,
      rowSize: 10,
      isLoad: true
    }

    this.elemPage = document.querySelector('#Page');
    this.elemTable = document.querySelector('#Table');
    this.elemLoad = document.querySelector('#Load');
    this.init();
  }

  init() {
    this.getData();
    this.setEvent();
  }

  setLoad() {
    if (!this.pageObject.isLoad) {
      this.elemLoad.style = 'display:none';
    }
  }

  getData() {
    const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx'
    fetch(api)
      .then(res => res.json())
      .then(data => {
        this.pageObject.foodArr = this.dataSplit(data);
        this.setPage(this.pageObject.foodArr);
        this.setTemplate(this.pageObject.currentIndex);
      })
      .catch(err => {
        if (err) {
          alert('資料來源有誤!');
        }
      })
      .finally(() => {
        this.pageObject.isLoad = false;
        this.setLoad();
      });
  }

  dataSplit(data) {
    for (let i = 0, len = data.length; i < len; i += this.pageObject.rowSize) {
      this.pageObject.foodArr.push(data.slice(i, i + this.pageObject.rowSize));
    }
    return this.pageObject.foodArr;
  }

  setPage(arr) {
    let pageCode = '';
    arr.forEach((item, i) => {
      pageCode += `<button class="nav__page" type="button" data-id="${i}">${i + 1}</button>`;
    });
    this.elemPage.innerHTML = pageCode;
    this.elemPage.children[this.pageObject.currentIndex].classList.add('js-nav__page');
  }

  setTemplate(index) {
    const rowStartIndex = index * this.pageObject.rowSize + 1;
    let str = '';
    this.pageObject.foodArr[index].forEach((item, i) => {
      str += `<tr class="table__ls ${this.changeBgColor(i)}">
                <td class="table__item text-center text-gray">${rowStartIndex + i}</td>
                <td class="table__item">${item.City}</td>
                <td class="table__item">
                  <div class="img__inner">
                    <img class="image" src="${item.PicURL}" alt="${item.Name}">
                    <img class="image-hidden" src="${item.PicURL}" alt="${item.Name}">
                  </div>    
                </td>
                <td class="table__item text-overflow">${item.Url ? `<a href="${item.Url}" target="_blank">${item.Name}</a>` : `${item.Name}`}</td>
                <td class="table__item">${this.textLimit(item.HostWords)}</td>
              </tr>`;
    });
    this.elemTable.innerHTML = str;
  }

  changeBgColor(index) {
    return index % 2 === 0 ? '' : 'js-table__ls';
  }

  textLimit(text) {
    let len = text.length;
    return len > 50 ? text.substring(0, 50) + '...' : text;
  }

  setEvent() {
    this.elemPage.addEventListener('click', (e) => {
      this.doClick(e);
    });
  }

  doClick(e) {
    const self = e.target;
    if (self.nodeName === 'BUTTON') {
      const prevIndex = this.pageObject.currentIndex;
      this.pageObject.currentIndex = parseInt(self.dataset.id);
      this.setTemplate(this.pageObject.currentIndex);
      this.setBtn(prevIndex);
    }
  }

  setBtn(index) {
    this.elemPage.children[this.pageObject.currentIndex].classList.add('js-nav__page');
    this.elemPage.children[index].classList.remove('js-nav__page');
  }
}

const food = new Food();