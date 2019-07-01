import React, { Component } from 'react'

import Auth from '../utils/AuthHelper.js';
const auth = new Auth();

const UserContext = React.createContext();

export class UserProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            username: '',
            admin: 0,
            isLoggedIn: false,
            logout: this.logout
        };
    }

    componentDidMount() {
        const self = this;
        // plz don't kill me for using global method
        global.updateUserContext = () => {
            console.log('updating context');
            self.updateData();
        }
        this.updateData();
    }

    componentWillUnmount() {
        // See I'm a good boy and removes the global function on unmount
        global.updateUserContext = undefined;
    }

    /**
     * Log out user
     */
    logout() {
        auth.logout();
    }

    /**
     * Update UserContext data
     * So all UserContext.Consumer get new data.
     */
    updateData() {
        const data = auth.getTokenData();
        if (data) {
            this.setState({
                ...data,
                isLoggedIn: true
            }, () => {
            });
        } else {
            this.setState({
                id: null,
                username: '',
                admin: 0,
                isLoggedIn: false
            });

        }
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

// When a component want's to consume this context
// impport this
export const UserConsumer = UserContext.Consumer;

export default UserContext;