
import * as Auth0Chrome from 'auth0-chrome';

const env = {
    AUTH0_DOMAIN: 'mothersele.eu.auth0.com',
    AUTH0_CLIENT_ID: 'G81PjVxfq4HIaKWms9g3PA4paPn2U5re'
};


chrome.runtime.onMessage.addListener(function (event) {
    if (event.type === 'authenticate') {

        // scope
        //  - openid if you want an id_token returned
        //  - offline_access if you want a refresh_token returned
        //  - profile if you want an additional claims like name, nickname, picture and updated_at.
        // device
        //  - required if requesting the offline_access scope.
        let options = {
            scope: 'openid profile offline_access',
            device: 'chrome-extension'
        };

        new Auth0Chrome(env.AUTH0_DOMAIN, env.AUTH0_CLIENT_ID)
            .authenticate(options)
            .then(function (authResult) {
                localStorage.authResult = JSON.stringify(authResult);
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/kendraio-logo.png',
                    title: 'Login Successful',
                    message: 'You can use the app now'
                });
            }).catch(function (err) {
            chrome.notifications.create({
                type: 'basic',
                title: 'Login Failed',
                message: err.message,
                iconUrl: 'icons/kendraio-logo.png'
            });
        });
    }
});

function captureThis(callback) {
    callback('hello from main process');
}
