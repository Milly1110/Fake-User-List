(function () {
  // new variable
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  // const SHOW_URL = BASE_URL + '/api/v1/users/:id'

  const data = []

  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)  //save response.data.results
      displayData(data)     //渲染資料
      getTotalPage(data)    //載入頁碼
      getPageData(1, data)  //取出對應頁面的資料
      console.log(response)
      console.log(response.data.results)
    })
    .catch((err) => {
      console.log(err)
    })

  //把資料放進網頁
  const dataPanel = document.querySelector('#data-panel')

  function displayData(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-xs-12 col-sm-4 col-md-3"  style="width: 12rem;">
          <div class="card mb-2" >
          <!-- Button trigger modal -->
          <a type="button" class="btn-primary" data-toggle="modal" data-target="#showuserdetail">
          <img class="card-img-top" data-id=${item.id} src=${item.avatar} alt="Card img cap" style="border:30%;">
          </a>

          <div class="card-body">
            <p class="card-title" style="font-size:1.2em ; padding:2px ;">${item.name} ${item.surname} </br> <i class="far fa-heart add-favorite fa-2x" style="color:#FF8282" data-id="${item.id}"></i>
            </p>

          </div>
          </div>
        </div>
      </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //點擊頭像彈出視窗
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.card-img-top')) {
      showUser(event.target.dataset.id)
    }
    else if (event.target.matches('.add-favorite')) {
      addFavorite(event.target.dataset.id)
    }
  })

  function showUser(id) {
    //get elements
    const modalUserName = document.querySelector('.modal-title')
    const modalUserAvatar = document.querySelector('#show-user-avatar')
    const modalUserGender = document.querySelector('#show-user-gender')
    const modalUserAge = document.querySelector('#show-user-age')
    const modalUserRegion = document.querySelector('#show-user-region')
    const modalUserBirthday = document.querySelector('#show-user-birthday')

    //set request URL
    const URL = INDEX_URL + id
    console.log(URL)

    //send request to show API
    axios.get(URL)
      .then((response) => {
        const data = response.data
        // console.log(data)

        //insert data into Modal
        modalUserName.textContent = `${data.name} ${data.surname}`
        modalUserAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid">`
        modalUserGender.innerHTML = `Gender: ${data.gender}`
        modalUserAge.innerHTML = `Age: ${data.age}`
        modalUserRegion.innerHTML = `Region: ${data.region}`
        modalUserBirthday.innerHTML = `Birthday: ${data.birthday}`

      })
      .catch((err) => { console.log(err) })
  }
  // search Bar
  const searchForm = document.querySelector('#search')
  const searchInput = document.querySelector('#search-input')
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    console.log('success')
    let input = searchInput.value.toLowerCase()
    let results = data.filter(user => user.name.toLowerCase().includes(input))
    displayData(results)
  })

  // 正規寫法
  // searchForm.addEventListener('submit', event => {
  //   event.preventDefault()
  //   let results = []
  //   const regex = new RegExp(searchInput.value, 'i')
  //   results = data.filter(user => user.name.match(regex))
  //     console.log(results)
  //     displayData (results) 
  // })

  //add favorite
  function addFavorite(id) {
    const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    const User = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${User.name} ${User.surname} is already in favorite list.`)
    }
    else {
      list.push(User)
      alert(`${User.name} ${User.surname} added to favorite list.`)
    }
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
  }

  // add pagination
  const pagination = document.querySelector('.pagination')
  const ItemPerPage = 20
  function getTotalPage(data) {
    let totalPage = Math.ceil(data.length / ItemPerPage) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPage; i++) {
      pageItemContent += `      
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>`
    }
    pagination.innerHTML = pageItemContent
  }

  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })
  let paginationData = []
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ItemPerPage
    let pageData = paginationData.slice(offset, offset + ItemPerPage)
    displayData(pageData)
  }

})()