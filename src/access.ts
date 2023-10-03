import { map, get, set, capitalize } from 'lodash';

type Allowed = 'Financials'|'Reservations'|'System'|'Users'|'Groups'|'Items'|'Patches'|'Customers'|'Storages'|'Sales';

type Perm = 'read'|'create'|'delete'|'update'|'manage';

type Access = {
  [key in `${Perm}${Allowed}`]?: boolean;
} & {
  strictMode?: boolean;
};

export default function access(initialState: { currentUser?: User.Data } | undefined) {
  const { currentUser } = initialState ?? {};
  const permissions: Access = {};
  map(['Financials', 'Reservations', 'System', 'Sales', 'Storages', 'Customers', 'Patches', 'Users', 'Groups', 'Items'], item => {
    set(permissions, 'read'+item, false);
    set(permissions, 'create'+item, false);
    set(permissions, 'update'+item, false);
    set(permissions, 'delete'+item, false);
    set(permissions, 'manage'+item, false);
  })
  map(get(currentUser, 'permissions.permissions', []), perm => {
    map(perm.action, a => {
      if(a==='manage'){
        set(permissions, 'create'+capitalize(perm.subject), true);
        set(permissions, 'read'+capitalize(perm.subject), true);
        set(permissions, 'update'+capitalize(perm.subject), true);
        set(permissions, 'delete'+capitalize(perm.subject), true);
        set(permissions, a+capitalize(perm.subject), true);
      } else set(permissions, a+capitalize(perm.subject), true);
    });
  });

  return { ...permissions };
}
