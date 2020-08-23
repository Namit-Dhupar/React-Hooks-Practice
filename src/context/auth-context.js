import React, {useState} from 'react';

//Creating a context so that the create and initiate the below objects to be used globally
export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); //Initially false

    const loginHandler = () => {
        setIsAuthenticated(true);

    }
    return(
        <AuthContext.Provider value={{isAuth: isAuthenticated, login: loginHandler}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

//Now use this component as wrapper in index.js to wrap the whole app