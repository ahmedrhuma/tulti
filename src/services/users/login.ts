import app from '@/connect';

export const login = (data: User.LoginData) => app.authenticate(data);

export const outLogin = () => app.logout();