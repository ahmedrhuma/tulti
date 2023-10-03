import app from '@/connect';

const service = app.service('api/system');

export const fetchDashboard = (): Promise<System.Dashboard> => service.find({
    query: {
        dashboard: true
    }
});

export const subscribeNotification = (subscription: any): Promise<System.Dashboard> => service.patch(null, {
    subscribe: true,
    subscription
});

export const getNotificationsSettings = () => service.find({
    query: {
        notifications: true
    }
});

export const updateNotificationsSettings = (data) => service.patch(null, data);