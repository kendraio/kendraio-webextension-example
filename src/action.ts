import * as jwt_decode from 'jwt-decode';

const env = {
    AUTH0_DOMAIN: 'mothersele.eu.auth0.com',
    AUTH0_CLIENT_ID: 'G81PjVxfq4HIaKWms9g3PA4paPn2U5re'
};


function isLoggedIn(token) {
    // The user is logged in if their token isn't expired
    return jwt_decode(token).exp > Date.now() / 1000;
}

function logout() {
    // Remove the idToken from storage
    localStorage.clear();
    main();
}
function capture() {
    // alert('select part of document');
    // console.log('select part of the page');

    chrome.runtime.getBackgroundPage(function(eventPage: any) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This injects
        // content.js into the current tab's HTML
        eventPage.captureThis((message) => alert(message));
    });
}


// Minimal jQuery
const $$ = document.querySelectorAll.bind(document);
const $  = document.querySelector.bind(document);


function renderProfileView(authResult) {
    $('.default').classList.add('hidden');
    $('.loading').classList.remove('hidden');
    fetch(`https://${env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
            'Authorization': `Bearer ${authResult.access_token}`
        }
    }).then(resp => resp.json()).then((profile) => {
        ['picture', 'name', 'nickname'].forEach((key) => {

            const element = $('.' +  key);
            if( element.nodeName === 'DIV' ) {
                element.style.backgroundImage = 'url(' + profile[key] + ')';
                return;
            }

            element.textContent = profile[key];
        });
        $('.loading').classList.add('hidden');
        $('.profile').classList.remove('hidden');
        $('.logout-button').addEventListener('click', logout);

        $('.capture-button').addEventListener('click', capture);
    }).catch(logout);
}


function renderDefaultView() {
    $('.default').classList.remove('hidden');
    $('.profile').classList.add('hidden');
    $('.loading').classList.add('hidden');

    $('.login-button').addEventListener('click', () => {
        $('.default').classList.add('hidden');
        $('.loading').classList.remove('hidden');
        chrome.runtime.sendMessage({
            type: "authenticate"
        });
    });
}

function main () {
    const authResult = JSON.parse(localStorage.authResult || '{}');
    const token = authResult.id_token;
    if (token && isLoggedIn(token)) {
        renderProfileView(authResult);
    } else {
        renderDefaultView();
    }
}

document.addEventListener('DOMContentLoaded', main);
