/* Hamburger Menu */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");

document.onclick = function (e) {
    if (e.target.id !== 'navbar' && !e.target.classList.contains('hamburger') ) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }
    if (!e.target.classList.contains('avatar')) {profileMenu.style.display = 'none';};
    if (e.target.classList.contains('register')) {register.style.display = "none";};
    if (e.target.classList.contains('login')) {login.style.display = "none";};
    if (e.target.classList.contains('card')) {buyCardModal.style.display = "none";};
}

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll("nav ul li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))
/* End of Hamburger Menu */

/* Profile menu */
const avatar = document.querySelector('.avatar')
const header = document.querySelector('header')
const profileMenu = document.querySelector('.profile')

function profile() {
    profileMenu.style.display = 'flex';
    profileMenu.style.top = `${avatar.getBoundingClientRect().bottom}px`;
    profileMenu.style.right = `${header.getBoundingClientRect().right - avatar.getBoundingClientRect().right}px`;
}
/* Enf of Profile menu */

/* About Section */
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const dots = document.querySelectorAll('.dot');
const track = document.querySelector('.about-images');

let trackTranslate;
let index = 0;

showSlides(index)
activateDot(index)

window.addEventListener('resize', () => {
    // Header section
    profileMenu.style.top = `${avatar.getBoundingClientRect().bottom + 3}px`;
    profileMenu.style.right = `${header.getBoundingClientRect().right - avatar.getBoundingClientRect().right}px`;
    // About section
    prev.style.display = window.matchMedia("(max-width: 1440px)").matches ? 'flex' : 'none'
    next.style.display = window.matchMedia("(max-width: 1440px)").matches ? 'flex' : 'none'

    if (!window.matchMedia("(max-width: 1440px)").matches) {
        index = index > 2 ? 2 : index
    }
    showSlides(index)
    activateDot(index)
    // 
})

next.addEventListener('click', () => {
    index++;
    // trackTranslate = (track.style.transform.match(/-+[0-9]+/) || [])[0] || '0'
    currentSlide(index)
})

prev.addEventListener('click', () => {
    index--;
    currentSlide(index)
})

function currentSlide(n) {
    showSlides(index = n);
    activateDot(n)
}

function showSlides(index) {
    if (window.matchMedia("(max-width: 1440px)").matches) {
        track.style.transform = `translateX(-${index * 450}px)`
    } else {
        track.style.transform = `translateX(-${index * 470}px)`
    }
    prev.disabled = index <= 0 ? true : false
    next.disabled = index >= 4 ? true : false
}

function activateDot(index) {
    Array.from(dots).map((dot) => dot.classList.remove('active'))
    dots[index].classList.add('active')
}
/* End of About Section */

/* Favorites Section */
const radios = ['winter', 'spring', 'summer', 'autumn']
    .reduce((arr, r) => {
        return [...arr, document.getElementById(r)]
    }, [])

const seasons = ['booksWinter', 'booksSpring', 'booksSummer', 'booksAutumn']
    .reduce((arr, s) => {
        return [...arr, document.getElementById(s)]
    }, [])

seasons.map((s) => {
    s.classList.add('fadeOut')
})

let favIndex = 0;
let favLoopIdx = 0;
let isRadioClicked = false;

const radioClicked = (b) => isRadioClicked = b

showSeasons()

function currentSeason(n) {
    seasons[favIndex].classList.add('fadeOut')
    seasons[favIndex].classList.remove('fadeIn')

    seasons[n].classList.add('fadeIn')
    seasons[n].classList.remove('fadeOut')

    favIndex = n
}

function showSeasons() {
    if (!isRadioClicked) {
        radios.map((r) => {
            r.removeAttribute('checked')
        })
        radios[favLoopIdx].setAttribute('checked', '')
        currentSeason(favLoopIdx);
        favLoopIdx = favLoopIdx === 3 ? 0 : ++favLoopIdx;
        // setTimeout(showSeasons, 2500)
    }
}
/* End of Favorites Section */

/* M O D A L S */

/* Sign Up */
const register = document.querySelector('.register');
const regClose = document.querySelector('#reg-close');
const regForm = document.querySelector('#reg-form');
const hrefLogin = document.getElementById('hrefLogin')
const hrefRegister = document.getElementById('hrefRegister')
const signupBtn = document.getElementById('signupBtn')
const loginBtn = document.getElementById('loginBtn')
const profBtn = document.getElementById('profileBtn')

hrefLogin.onclick = function(e) {
    e.preventDefault();
    loginForm();
}

hrefRegister.onclick = function(e) {
    e.preventDefault();
    registerForm();
}

signupBtn.onclick = function(e) {
    e.preventDefault()
    registerForm()
}

loginBtn.onclick = function(e) {
    e.preventDefault()
    loginForm()
}

profBtn.onclick = function(e) {
    e.preventDefault();
    myprofileForm();
}

regClose.onclick = function() {
    regForm.reset();
    register.style.display = "none";
}

regForm.addEventListener('submit', registerHandle)

function registerForm() {
    profileMenu.style.display = 'none';
    login.style.display = 'none'
    register.style.display = 'flex'
}

function registerHandle(event) {
    event.preventDefault()

    let card = [...Array(9)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    let userExist = false;
    let user_data = {
        firstName: regForm['fname'].value.trim(),
        lastName: regForm['lname'].value.trim(),
        email: regForm['email'].value.trim(),
        password: regForm['psw'].value.trim(),
        card: card,
        books: [],
        visits: 1,
        bonus: 0,
        hasCard: false,
    }

    let usersArray = JSON.parse(localStorage.getItem("users") || "[]");
    
    for (user of usersArray) {
        if (user_data.email === user.email) {
            userExist = true
            break;
        }
    }
    
    if (!userExist) {
        localStorage.setItem('users', JSON.stringify([...usersArray, user_data]))
        changeAvatar(user_data)
        libBtn.removeAttribute('disabled')
    } else {
        alert(`Email ${user_data.email} already exist, please login`)
    }
    
    register.style.display = 'none'
    regForm.reset()
}

/* Log In */
const login = document.querySelector('.login');
const logClose = document.querySelector("#login-close");
const logForm = document.querySelector('#log-form');
const profMenu = document.querySelectorAll('#auth');
const getCard = document.querySelectorAll('.getCard');
let currentUser = {}

logClose.onclick = function() {
    logForm.reset();
    login.style.display = "none";
}

logForm.addEventListener('submit', loginHandle)

function loginForm() {
    profileMenu.style.display = 'none';
    register.style.display = 'none';
    login.style.display = 'flex'
}

function loginHandle(event) {
    event.preventDefault()
    let usersArray = JSON.parse(localStorage.getItem("users") || "[]");
    let loginUser = logForm['username'].value.match(/\S+@\S+\.\S+/) ? 
            usersArray.find(({email}) => email === logForm['username'].value) : 
            usersArray.find(({card}) => card === logForm['username'].value);

    if (loginUser?.password === logForm['login-pass'].value.trim()) {
        login.style.display = 'none';
        currentUser = loginUser;
        currentUser.visits += 1;
        updateUserData();
        changeAvatar(loginUser);
        profMenu[0].children[0].style.display = 'none';
        profMenu[0].children[1].style.display = 'none';
        profMenu[0].children[2].style.display = 'flex';
        profMenu[0].children[3].style.display = 'flex';
        checkCard();
        getCard[0].children[0].innerText = 'Visit your profile'
        getCard[0].children[1].innerText = "With a digital library card you get free access to the Library's wide array of digital resources including e-books, databases, educational resources, and more."
        getCard[0].children[2].children[0].style.display = 'none'
        getCard[0].children[2].children[1].style.display = 'none'
        getCard[0].children[2].children[2].style.display = 'inline-block'
        Array.from(buyButtons).forEach((btn) => {
            btn.removeEventListener('click', loginForm)
            btn.addEventListener('click', buycardHandle)
        })
        checkRentedBooks()
    } else {
        alert('Please enter correct data...');
    }
    logForm.reset();
}

/* My Profile */
const myProfile = document.querySelector('.myProfile');
const myprofLeft = document.querySelector('.myprofLeft');
const myprofRates = document.querySelector('.myprofRates');
const myprofBooks = document.getElementById('bookList');
const myprofCard = document.querySelector('.myprofCard');
const myprofClose = document.querySelector('#myprof-close');

myprofCard.children[2].addEventListener('click', copyCard)

myprofClose.onclick = function() {
    myProfile.style.display = "none";
}

function myprofileForm() {
    myprofLeft.children[0].innerText = `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    myprofLeft.children[1].children[0].innerText = `${currentUser.firstName} ${currentUser.lastName}`
    
    myprofRates.children[0].children[2].innerText = currentUser.visits
    myprofRates.children[1].children[2].innerText = currentUser.bonus
    myprofRates.children[2].children[2].innerText = currentUser.books.length

    myprofBooks.innerHTML = "";
    currentUser.books.forEach((book) => {
        let li = document.createElement('li');
        li.innerText = book;
        myprofBooks.appendChild(li)
    })

    myprofCard.children[1].innerText = currentUser.card
    profileMenu.style.display = 'none';
    myProfile.style.display = 'flex';
}

function copyCard() {
    navigator.clipboard.writeText(myprofCard.children[1].innerText.trim()).then(
        () => {alert('Card number copied')},
        () => {alert('Failed to copy card number')}
    );
}
/* Buy card */
const buyCardModal = document.querySelector('.card')
const books = document.querySelectorAll('.bg-description');
const buyButtons = document.querySelectorAll('.buy_btn');
const buyClose = document.querySelector("#buy-close");
const buyForm = document.querySelector('#buy-form');
const buyCard = document.querySelector('#buy-card')
 
// assign data attribute and value = book title&author to Favorites buy-button's 
Array.from(books).map((x) => {
    let title = x.children[2].children[0].innerHTML.toLowerCase().trim()
    let author = x.children[2].children[1].innerHTML.toLowerCase().replace('by ','').trim()
    x.children[4].setAttribute('data', `${title}, ${author}`)
})
// assign click event to Favorites buy-buttons
Array.from(buyButtons).forEach((btn) => {
    btn.addEventListener('click', loginForm)
})
// assign blur event to buy card inputs
Array.from(buyForm).map((x) => {
    if (x.localName === 'input') {
        x.addEventListener('blur', isCardFilled)
    }
})

buyClose.onclick = function() {
    buyForm.reset();
    buyCardModal.style.display = "none";
}

// card buy button click event
buyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    currentUser.hasCard = true;
    updateUserData();
    buyCardModal.style.display = 'none';
})

function isCardFilled() {
    let isCardFilled = Array.from(buyForm)
        .filter((x) => x.localName === 'input')
        .every((x) => {return x.value.length !==0})
    if (isCardFilled) {
        buyForm[8].removeAttribute('disabled')
    } else {
        buyForm[8].setAttribute('disabled','')
    }
}

function buycardHandle(event) {
    event.preventDefault()
    if (currentUser.hasCard) {
        event.srcElement.innerText ='own'
        event.srcElement.setAttribute('disabled','')
        currentUser.books.push(event.srcElement.getAttribute('data'))
        updateUserData();
        checkCard();
    } else {
        buyCardModal.style.display = 'flex'
    }
}
/* Log Out */
function logoutHandle() {
    avatar.title = ''
    avatar.firstElementChild.removeAttribute('hidden');
    avatar.lastElementChild.setAttribute('hidden','');
    profileMenu.firstElementChild.style.fontSize = '15px';
    profileMenu.firstElementChild.innerHTML = 'Profile';
    profMenu[0].children[0].style.display = 'flex';
    profMenu[0].children[1].style.display = 'flex';
    profMenu[0].children[2].style.display = 'none';
    profMenu[0].children[3].style.display = 'none';
    cardRates.style.display = 'none';
    libBtn.style.display = 'inline-block';
    libBtn.setAttribute('disabled', 'true');
    Array.from(cardInput).map((x)=> {
        x.value = ''
        x.style.color = '#8E8E8E'
        x.removeAttribute('disabled')
    });
    getCard[0].children[0].innerText = 'Get a reader card';
    getCard[0].children[1].innerText = 'You will be able to see a reader card after \
                                        logging into account or you can register a new \
                                        account';
    getCard[0].children[2].children[0].style.display = 'inline-block';
    getCard[0].children[2].children[1].style.display = 'inline-block';
    getCard[0].children[2].children[2].style.display = 'none';

    updateUserData()

    currentUser = {};
    Array.from(buyButtons).forEach((btn) => {
        btn.removeEventListener('click', buycardHandle)
        btn.addEventListener('click', loginForm)
    })
    Array.from(books).map((x) => {
        x.children[4].removeAttribute('disabled')
        x.children[4].innerText = 'Buy'
    })
}
/* Check Card */
const libBtn = document.querySelector('.checkButton')
const cardRates = document.querySelector('.readerRates')
const cardInput = document.querySelector('#lib-card')
const readerRates = document.querySelectorAll('.readerRates')

function checkCard() {
    if (Object.keys(currentUser).length === 0) { /* register mode */
        if (cardInput.children[1].value && cardInput.children[2].value) {
            let regData = JSON.parse(localStorage.getItem("users") || "[]")
                .find(({card, firstName}) => card === cardInput.children[2].value.trim() && 
                    firstName.toLowerCase() === cardInput.children[1].value.trim().toLowerCase());
            if (regData) {
                libBtn.style.display = 'none'
                cardRates.style.display = 'flex'
                cardRates.children[0].children[2].innerText = regData.visits
                // cardRates.children[1].children[2].innerText = regData.bonus
                // cardRates.children[2].children[2].innerText = regData.books.length
                setTimeout(() => {
                    libBtn.style.display = 'inline-block'
                    cardRates.style.display = 'none'
                    cardInput.reset()
                }, "10000");
            } else {
                alert('Please enter correct data...')
            }
        } else {
            alert('Please fill in both fields...')
        }
    } else { /* login mode */
        Array.from(cardInput).map((x)=> {
            x.value = currentUser[x.name] 
            x.style.color = '#BB945F'
            x.setAttribute('disabled', 'true')
        })
        libBtn.style.display = 'none';
        cardRates.style.display = 'flex';
        readerRates[0].children[0].children[2].innerText = currentUser.visits;
        readerRates[0].children[1].children[2].innerText = currentUser.bonus;
        readerRates[0].children[2].children[2].innerText = currentUser.books.length
    }
}

/* utility functions */
function changeAvatar(data) {
    avatar.firstElementChild.setAttribute('hidden','hidden')
    avatar.lastElementChild.removeAttribute('hidden')
    avatar.lastElementChild.innerHTML = `${data.firstName[0]}${data.lastName[0]}`
    avatar.title = `${data.firstName} ${data.lastName}`
    profileMenu.firstElementChild.style.fontSize = '12px';
    profileMenu.firstElementChild.innerHTML = data.card
}
function updateUserData() {
    let usersArray = JSON.parse(localStorage.getItem("users"))
        .filter((item) => {return item.email !== currentUser.email})
    localStorage.setItem('users', JSON.stringify([...usersArray, currentUser]))
}
function checkRentedBooks() {
    Array.from(books).map((x) => {
        if (currentUser.books.includes(x.children[4].getAttribute('data'))) {
            x.children[4].setAttribute('disabled','')
            x.children[4].innerText = 'Own'
        }
    })
}