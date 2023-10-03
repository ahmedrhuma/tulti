import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { filter, pull, findIndex, get, find, map, includes, isEqual } from 'lodash';
import isMobile from '@/isMobile';
// And
import { SaveOutlined, CloseOutlined, CheckOutlined, DeleteOutlined, ReloadOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ProCard, ModalForm, ProFormText, PageContainer } from '@ant-design/pro-components';
import { Divider, Tooltip, Alert, Switch, Descriptions, Button, Tabs, message, Modal } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';
// Umijs
import { history } from 'umi';
// Local
import { updateGroup, createGroup, fetchGroups, removeGroup } from '@/services/groups';

const { confirm } = Modal;

const permissions_text = {
  read: 'عرض',
  update: 'تعديل',
  delete: 'حذف',
  create: 'إنشاء',
  manage: 'إدارة'
};
// Permissions List
const ENTITIES: Group.Access[] = [
    {
    title: 'المتاجر والربط',
    name: '',
    subject: '',
    action: []
  },
  {
    subject: 'stores',
    name: 'المتاجر',
    action: ['read', 'create', 'update', 'delete', 'manage']
  },
  {
    name: '',
    title: 'النظام',
    subject: '',
    action: []
  },
  {
    subject: 'users',
    name: 'المستخدمين',
    action: ['read', 'create', 'update', 'delete', 'manage']
  },
  {
    subject: 'groups',
    name: 'المجموعات',
    action: ['read', 'manage']
  },
  {
    subject: 'system',
    name: 'النظام',
    action: ['manage']
  }
];

const GroupsPage: React.FC = () => {
    const [data, setData] = useState<{groups: Group.Data[]; loading: boolean; active: string|undefined;}>({
        groups: [],
        loading: true,
        active: undefined
    })
    const [modalSettings, setModalSettings] = useState<{ id?: number; visible: boolean; mode: 'new'|'edit'}>({ visible: false, mode: 'new'} );
    const formRef = useRef<ProFormInstance>();

    const { groups, loading } = data;

    const load = () => fetchGroups().then((response: Group.Data[]) => {
        setData({ loading: false, groups: response, active: String(response[0]?.id) });
    });

    useEffect(() => {
      load();
    }, []);

    //   Add to groups object array
    const addToGroups = (group: Group.Data) => {
        const newgroups = [...groups];
        newgroups.push(group);
        setData({
        ...data,
        groups: newgroups
        });
    }

    // Update groups state
    const updateGroupState = (group: Group.Data) => {
        const newgroups = [...groups];
        const ix = findIndex(newgroups, d => isEqual(String(d.id),String(group.id)));
        if(ix>=0){
        newgroups[ix]=group;
        setData({
            ...data,
            groups: newgroups
        });
        }
    }

    const saveChanges = () => {
        // get the dirty groups
        const dirty = filter(data.groups, { dirty: true }) as Group.Data[];
        if(dirty.length===0) return;
        setData({
        ...data,
        loading: true
        });
        map(dirty, item => updateGroup(get(item, 'id'), { permissions: item.permissions }).then((result: Group.Data) => {
            updateGroupState(result);
            setData({
                ...data,
                loading: false
            });
            message.success('تمام التمام! المجموعات تحدثت والأمور طيبة');
          }).catch(() => {
            message.error('في مشكلة في تحديث المجموعة، جرب مرة ثانية بعدين!');
            setData({
                ...data,
                loading: false
            });
          }))
    }

    // Handle add or edit group
    const handleGroupOperation = (values: Pick<Group.Data, 'name'>) => {
        if(modalSettings.mode==='new'){
            return createGroup(values).then((response: Group.Data) => {
                addToGroups(response);
                setModalSettings({ ...modalSettings, visible: false });
                message.success('تم إضافة المجموعة بنجاح!');
            }).catch(() => {});
        }
        else if(modalSettings.mode==='edit'){
            return updateGroup(modalSettings.id as number, values).then((response: Group.Data) => {
                setModalSettings({ ...modalSettings, visible: false });
                updateGroupState(response)
                message.success(`عَـلى طُـول، المجموعة ${response.name} تعدلت تمام!`);
            }).catch(() => {});
        }
        
        return Promise.reject(false);
    }

  const ChangePermission = (id: number, subject: string, permission: Partial<Group.Permission>, value: boolean) => {
    const newgroups = data.groups;
    const ix = findIndex(newgroups, { id });
    if(ix>=0){
      const group = {...newgroups[ix]};
      const subjectid = findIndex(get(group, ['permissions'], []) as Group.Access[], { subject });
      if(subjectid >=0){
        const action = pull(get(group.permissions, [subjectid, 'action']), permission);
        if(value) action.push(permission);
        group.permissions = [
          ...group.permissions
        ];
        group.permissions[subjectid].action=action;
      }
      else {
        const action: Group.Permission[] = [] as Group.Permission[];
        if(value) action.push(permission);
        group.permissions.push({
          subject,
          action
        });
      }
      group.dirty = true;
      newgroups[ix] = group;
      setData({
        loading: false,
        active: data.active,
        groups: newgroups
      })
    }
  }

  const renderGroup = (group: Group.Data) => {
    const items: React.ReactNode[]=[];
    let counter=1;
    let row=1;
    let entries: React.ReactNode[]=[];
    const PERROW = isMobile() ? 2 : 3;
    map(ENTITIES, (entity, ix) => {
      if(entity.title) {
        counter = PERROW;
      }
      else {
        entries.push(
          <ProCard style={{ marginBottom: '16px' }} key={`group_${group.id}_entity_${entity.subject}`} title={entity.name} colSpan={{ sm: 24, md: 12 }} bordered>
            {entity.subject==="settings" ? <Alert style={{ marginBottom: '10px' }} message="الرجاء الإنتباه لهذه الصلاحية نظرا لحساسيتها، ويرجى فقط إعطائها للموثوق منهم!" type="warning" showIcon closable /> : null}
            <Descriptions style={{ width: '100%' }} size="small" layout="vertical" bordered>
                {map(entity.action as Group.Permission[], a => <Descriptions.Item key={`group_${group.id}_entity_${entity.subject}_${permissions_text[a]}`} label={permissions_text[a]}><Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={includes(get(find(group.permissions, { subject: entity.subject  }), 'action', []), a)}
                  onChange={val => ChangePermission(group.id, entity.subject, a as Partial<Group.Permission>, val)}
                  /></Descriptions.Item>)}
            </Descriptions>
          </ProCard>
        )
        counter++;
      }
      if(counter === PERROW || ix === ENTITIES.length-1){
        counter=1;
        if(entries.length > 0) items.push(
          <ProCard key={`main_${group.id}_row_${row++}`} colSpan={24} ghost gutter={[16,16]}>
            {entries}
          </ProCard>
        )
        entries = [];
        if(entity.title) items.push(<ProCard style={{ marginBottom: '16px' }} key={`group_${group.id}_entity_${entity.title}`} colSpan={{ sm: 24}} ghost>
          <Divider>{entity.title}</Divider>
      </ProCard>);
      }
    });
    return items;
  }

  const onEdit = (targetKey: any, action: string) => {
    if(action==='add') {
      formRef?.current?.resetFields();
      setModalSettings({
        ...modalSettings,
        mode: 'new',
        visible: true
      })
    }
  };

  const updateGroupName = () => {
    const group= find(groups, d => isEqual(String(d.id), String(data.active))) as Group.Data;
    setModalSettings({
      ...modalSettings,
      mode: 'edit',
      visible: true,
      id: group.id
    });
    setTimeout(() => {
      formRef?.current?.setFieldsValue({ name: group?.name });
    }, 0);
  }

  const onChange = (key: string) => {
    setData({
      ...data,
      active: key
    })
  }

  const doReload = () => {
    setData({
      ...data,
      loading: true
    });
    load();
  }

  const deleteGroup = () => {
    const groupname = get(find(data.groups, { id: data.active as string }), 'name');
    confirm({
      okText: 'تأكيد',
      cancelText: 'إلغاء',
      title: <div>هل أنت متأكد من حذف المجموعة <strong>{groupname}</strong></div>,
      icon: <ExclamationCircleOutlined />,
      content: 'المجموعة حتنحذف بشكل نهائي وماتقدرش تتراجع عن العملية!',
      direction: 'rtl',
      onOk() {
        return removeGroup(Number(data.active as string)).then(() => {
          doReload();
          message.success('تم حذف المجموعة بنجاح!');
        }).catch(() => {})
      },
      onCancel() {},
    });
  }

  return (
    <>
      <Helmet>
        <title>مجموعات الأعضاء</title>
      </Helmet>
      <PageContainer
        onBack={history.back}
        loading={loading}
        title="مجموعات الأعضاء"
        content="هني تقدر تعرّف مجموعات الأعضاء وتعطي لكل مجموعة الصلاحيات الخاصة بيها."
        header={{
          extra: [
            <Button onClick={saveChanges} type="primary" icon={<SaveOutlined />} key="savedata">حفظ</Button>,
            <Button onClick={doReload} type="dashed" icon={<ReloadOutlined />} key="reload">تحديث</Button>,
            groups.length>0?<Tooltip color="gold" title="تعديل إسم المجموعة" key="editname" ><Button onClick={updateGroupName} icon={<EditOutlined />} /></Tooltip>:null,
            groups.length>0?<Tooltip key="remove" color="red" title="حذف المجموعة"><Button onClick={deleteGroup} danger icon={<DeleteOutlined />} type="primary" /></Tooltip>:null,
          ],
        }}
      >
        <Tabs
          type="editable-card"
          activeKey={data.active}
          onChange={onChange}
          onEdit={onEdit}
          animated
          items={groups.map(group => ({
            label: group.name,
            key: String(group.id),
            closable: false,
            children: renderGroup(group)
          }))}
        />
        <ModalForm
          title={modalSettings.mode==="new" ? "إضافة مجموعة جديدة" : "تعديل إسم المجموعة"}
          width="400px"
          autoFocusFirstInput
          formRef={formRef}
          open={modalSettings.visible}
          onVisibleChange={(v: boolean) => setModalSettings({ ...modalSettings, visible: v })}
          onFinish={handleGroupOperation}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: 'إسم المجموعة ضروري منه!',
              },
            ]}
            width="md"
            name="name"
            label="إسم المجموعة"
          />
        </ModalForm>
      </PageContainer>
    </>
  );
};

export default GroupsPage;
