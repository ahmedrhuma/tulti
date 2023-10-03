declare namespace Group {
    type Data = {
        id: number;
        name: string;
        permissions: Access[];
        dirty?: boolean;
    }

    type Permission = 'create'|'read'|'update'|'delete'|'manage';

    type Access = {
        title?: string;
        name?: string;
        subject: string;
        action: Permission[];
    }
}