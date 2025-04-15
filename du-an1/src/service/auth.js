export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
};

export const isCustomer = () => {
    const user = getCurrentUser();
    return user && user.role === 'CUSTOMER';
};
