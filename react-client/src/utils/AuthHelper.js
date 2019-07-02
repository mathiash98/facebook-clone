export default class AuthHelper {
    constructor(domain) {
        this.domain = domain || window.location.protocol+'//'+window.location.hostname+':8888';
    }

    /**
     * Login with email and password, saves token to localstorage
     * returns a promise, resolves if success, reject if not success.
     * Returns token or errormessage.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<String>} Token on resolve or errormessage on reject
     */
    login = (email, password) => {
        return new Promise((resolve, reject) => {
            this.fetch('/auth/local-login', {
                method: "POST",
                headers: {
                    'Content-type': 'Application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            .then(token => {
                this.setToken(token);
                global.updateUserContext(); // Update UserContext
                resolve(token);
            })
            .catch(err => {
                reject(err);
            });
        })
    }

    /**
     * Register with email, password and data, saves token to localstorage
     * returns a promise, resolves if success, reject if not success.
     * Returns token or errormessage.
     * @param {Object} user
     * @returns {Promise<String>} Token on resolve or errormessage on reject
     */
    register = (user) => {
        return new Promise((resolve, reject) => {
            this.fetch('/auth/local-signup', {
                method: "POST",
                headers: {
                    'Content-type': 'Application/json'
                },
                body: JSON.stringify(user)
            })
            .then(token => {
                this.setToken(token);
                global.updateUserContext(); // Update UserContext
                resolve(token);
            })
            .catch(err => {
                reject(err);
            });
        })
    }

    /**
     * Logout user by deleting jwt token from localstorage.
     */
    logout = () => {
        localStorage.removeItem('jwt');
        global.updateUserContext(); // Update UserContext
    }

    /**
     * Save token to localstorage at 'jwt'
     * @param {string} token
     */
    setToken = (token) => {
        localStorage.setItem('jwt', token);
    }
    
    /**
     * Return token from localstorage at 'jwt'
     * @returns {string} token
     */
    getToken = () => {
        return localStorage.getItem('jwt');
    }
    
    /**
     * Get data from token at localstorage
     * @returns {{id: number, username: string, admin: boolean}|null} Returns object with user information or null
     */
    getTokenData = () => {
        const token = this.getToken();
        const decoded = this.decodeToken(token);

        if (decoded && !this.isTokenExpired(token)) {
            return decoded.data;
        } else {
            return null;
        }
    }

    /**
     * Check if user is authenticated and token is not expired
     * @returns {bool}
     */
    loggedIn = () => {
        const token = this.getToken();
        return token && !this.isTokenExpired(token);
    }

    /**
     * Check if token has expired
     * @param {string} token
     * @returns {bool}
     */
    isTokenExpired = (token) => {
        try {
            const decoded = this.decodeToken(token);
            if (decoded.exp < Date.now()/1000) {
                this.logout();
                return true;
            } else {
                return false;
            }
        } catch (error) {
            // Usually happening because decoded = null because token = null
            return false;
        }
    }

    /**
     * Decode the jwt token and extracts the payload
     * @param {string} token
     * @returns {({data: Object, iat: number, exp: number}|null)} {@link TokenPayload}
     */
    decodeToken = (token) => {
        if (token === null) {
            return null;
        } else {
            var base64Url = token.split('.')[1];
            var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(base64);
        }
    }

    /**
     * Middleware for fetch, where domain and Authentication header is added
     * @param {string} url Not including domain, so etc: "/api/post"
     * @param {object} options Normal fetch object
     * @returns {Promise} normal fetch, where if res.ok is false rejects the error
     */
    fetch = (url, options) => {
        return new Promise((resolve, reject) => {
            if (this.loggedIn) {
                if (options.hasOwnProperty("headers")) {
                    options.headers["Authorization"] = "Bearer " + this.getToken();
                } else {
                    options.headers = {
                        "Authorization": "Bearer " + this.getToken()
                    }
                }
            }
    
            options.mode = 'cors';
    
            fetch(this.domain+url, options)
            .then(this._handleFetchPromise)
            .then(([statusOk, body]) => {
                if (statusOk) {
                    resolve(body);
                } else {
                    reject(body);
                }
            })
            .catch(err => {
                reject(err);
            });
            
        })
    }
    
    /**
     * Handle fetch promise according to Content-Type
     * @param {object} res Fetch res object
     * @returns {Promise}
     */
    _handleFetchPromise = res => {
        if (res.headers) {
            const contentType = res.headers.get('Content-Type');
            if (contentType) {
                if (contentType.includes('application/json')) {
                    return Promise.all([res.ok, res.json()]);
                } else if (contentType.includes('image/')){
                    return Promise.all([res.ok, res.blob()]);
                } else if (contentType.includes('text/')){
                    return Promise.all([res.ok, res.text()]);
                }
            } else {
                return Promise.all([res.ok, res.text()]);
            }
        }
    }
}