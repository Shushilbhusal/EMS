import React from 'react'
import NotFoundPage from '../pages/NotFound';

const IsLoggedIn = ({children}: {children: React.ReactNode}) => {
    const token = localStorage.getItem("token");
    
  return token ? children : <NotFoundPage />;
}

export default IsLoggedIn 
