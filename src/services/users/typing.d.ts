declare namespace User {

    type LoginData = {
        email: string;
        password: string;
        strategy: 'local';
    }

    type LoginParams = LoginData & { autoLogin: boolean; };

    type Data = {
        id?: number;
        name: string;
        email: string;
        group: number;
        phone: string;
        mobile: string;
        notes: string;
        permissions: Group.Data;
    }

    type Users = Api.Pagination & { data: Data[] };
}