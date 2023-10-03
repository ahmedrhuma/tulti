import {
    DrawerForm,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDigit
} from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Image, message, Upload } from 'antd';
import type { FormInstance } from 'antd/es/form'
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { createItem, uploadImage, patchItem } from '@/services/items';
import { useIntl, connect } from 'umi';
import { map, omit } from 'lodash';
import isMobile from '@/isMobile';
import { useState, useEffect } from 'react';

import { IMAGE_BASE } from '@/URL';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

const AddItem: React.FC<{ types: Items.Types[], images: string[]; id: number; form: FormInstance<Items.ItemData>, mode?: 'new'|'edit'; open: boolean; onClose: () => void }> = ({ types, images, id, form, mode='new', open, onClose }) => {
    const [preview, setPreview] = useState<{ current: number; visible: boolean; title: string; image: string; }>({ current: 0, visible: false, title: '', image: '' });
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const intl = useIntl();

    useEffect(() => {
        if(mode === 'edit') {
            const newFileList: UploadFile[] = [];
            map(images, (img, ix) => {
                newFileList.push({
                    uid: String(ix),
                    name: img,
                    status: 'done',
                    url: `${IMAGE_BASE}${img}`
                })
            })

            setFileList(newFileList);
        }
    }, [images, mode])

    const closeThis = () => {
        setFileList([]);
        onClose();
    }

    const onFinish = (values: Items.ItemData) => {
        if(mode === 'new') {
            return createItem(values).then(res => {
                message.success(<div>تم إضافة الصنف <strong>{res.name}</strong> بنجاح!</div>)
                closeThis();
            }).catch(e => {
                message.error(<div>خطأ في إضافة الصنف <strong>{values.name}</strong>، جرب مرة ثانية بعدين!</div>)
            })
        }
        else {
            return patchItem(id as number, omit(values, 'images')).then(res => {
                message.success(<div>تم تعديل الصنف <strong>{res.name}</strong> بنجاح!</div>)
                closeThis();
            }).catch(e => {
                message.error(<div>خطأ في تعديل الصنف <strong>{values.name}</strong>، جرب مرة ثانية بعدين!</div>)
            })
        }
    }

    const uploadButton = (
        <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>{intl.formatMessage({ id: 'global.upload_image', defaultMessage: 'رفع صورة' })}</div>
        </div>
    );

    const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
        if(file.status === "removed") {
            return patchItem(id as number, { image: file.name, status: 'removed' }).then(() => {
                setFileList(newFileList);
            }).catch(() => {
                message.error('فشل حذف الصورة، الرجاء المحاولة مرة أخرى لاحقا!');
            })
        }
    }

    const setVisible = () => setPreview({ ...preview, visible: false });

    const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }

      setPreview({
        current: 0,
        visible: true,
        image: file.url || (file.preview as string),
        title: file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
      })
    };

    const customRequest = (file: any) => {
        return uploadImage(id as number, file.file).then(res => {
            setFileList(oldFileList => {
                const newFileList = [...oldFileList];
                newFileList.push({
                    uid: String(newFileList.length),
                    name: res.file as string,
                    status: 'done',
                    url: `${IMAGE_BASE}${res.file as string}`
                });

                return newFileList;
            });
            return res;
        }).catch(e => {
            message.error('فشل رفع الصورة، جرب مرة ثانية بعدين!');
            throw e
        })
    }

    const beforeUpload = (file, fs) => {
        file.uid = fs.length;
        return Promise.resolve(file);
    }

    return (
        <>
            <div style={{ display: 'none' }}>
                <Image.PreviewGroup preview={{ current: preview.current, visible: preview.visible, onVisibleChange: (vis) => setVisible(vis) }}>
                    {fileList.map(file => <Image src={file.url} key={file.uid} /> )}
                </Image.PreviewGroup>
            </div>
            <DrawerForm<Items.ItemData>
                form={form}
                title={mode === "new" ? "إضافة صنف جديد" :"تعديل صنف"}
                open={open}
                autoFocusFirstInput
                drawerProps={{
                    onClose: closeThis,
                    destroyOnClose: true
                }}
                grid
                width={isMobile() ? "100%" : "50%"}
                onFinish={onFinish}
            >
                <ProForm.Group>
                    <ProFormText
                        colProps={{ xs: 24, md: 12 }}
                        rules={[{
                            required: true,
                            message: intl.formatMessage({ id: 'global.required_field', defaultMessage: 'الحقل ضروري منه!' })
                        }]}
                        name="name"
                        label={intl.formatMessage({ id: 'pages.items.name', defaultMessage: 'إسم العنصر' })}
                        placeholder={intl.formatMessage({ id: 'pages.items.name_ph', defaultMessage: 'شن إسم المنتج؟' })}
                    />
                    <ProFormText
                        colProps={{ xs: 24, md: 12 }}
                        name="code"
                        label={intl.formatMessage({ id: 'pages.items.name', defaultMessage: 'كود العنصر' })}
                        placeholder={intl.formatMessage({ id: 'pages.items.name_ph', defaultMessage: 'شن كود المنتج؟' })}
                        extra="خليه فاضي باش يتكون بشكل تلقائي"
                    />
                </ProForm.Group>

                <ProFormSelect
                    options={map(types, type => ({ label: type.name, value: type.id }))}
                    rules={[{
                        required: true,
                        message: intl.formatMessage({ id: 'global.required_field', defaultMessage: 'الحقل ضروري منه!' })
                    }]}
                    colProps={{ xs: 24, md: 12 }}
                    name="type"
                    label={intl.formatMessage({ id: 'pages.items.type', defaultMessage: 'نوع المنتج' })}
                />
                <ProFormDigit
                    colProps={{ xs: 24, md: 12 }}
                    rules={[{
                        required: true,
                        message: intl.formatMessage({ id: 'global.required_field', defaultMessage: 'الحقل ضروري منه!' })
                    }]}
                    fieldProps={{
                        addonAfter: 'غ',
                        type: "number"
                    }}
                    name="weight"
                    tooltip="أكتب الوزن للشحنة، بالباكو والتغليف وكل شي"
                    label={intl.formatMessage({ id: 'pages.items.name', defaultMessage: 'الوزن (غ)' })}
                    placeholder={intl.formatMessage({ id: 'pages.items.name_ph', defaultMessage: 'وزن المنتج ضروري منه!' })}
                />

                <ProFormTextArea
                    name="desc"
                    colProps={{ xs: 24, md: { span: 16, offset: 5 } }}
                    label={intl.formatMessage({ id: 'pages.items.desc', defaultMessage: 'وصف العنصر' })}
                    placeholder={intl.formatMessage({ id: 'pages.items.desc_ph', defaultMessage: 'شن هو المنتج؟' })}
                />

                {mode === 'edit' ? <ProForm.Item
                    label={intl.formatMessage({ id: 'pages.items.images', defaultMessage: 'صور المنتج' })}
                    name="images"
                    wrapperCol={{ xs: 24 }}
                >
                    <Upload
                        customRequest={customRequest}
                        multiple
                        beforeUpload={beforeUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        accept='image/*'
                        onPreview={handlePreview}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </ProForm.Item> : null}
                
                <ProFormList
                    name="links"
                    className="ahmedrhuma-custom-list"
                    copyIconProps={{
                        tooltipText: intl.formatMessage({ id: 'global.copy', defaultMessage: 'نسخ' })
                    }}
                    deleteIconProps={{
                        tooltipText: intl.formatMessage({ id: 'global.delete', defaultMessage: 'حذف' })
                    }}
                    creatorButtonProps={{
                        position: 'bottom',
                        creatorButtonText: intl.formatMessage({ id: 'pages.items.add_link', defaultMessage: 'إضافة رابط للمنتج' })
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <ProFormText
                            name="link"
                            label={intl.formatMessage({ id: 'pages.items.link', defaultMessage: 'رابط للمنتج' })}
                            rules={[{
                                type: 'url',
                                message: intl.formatMessage({ id: 'global.invalid_url', defaultMessage: 'الرابط مش مزبوط!' })
                            }]}
                            colProps={{ xs: 24, md: 16 }}
                        />
                        <ProFormText
                            name="name"
                            label={intl.formatMessage({ id: 'pages.items.linkname', defaultMessage: 'إسم المصدر' })}
                            rules={[{
                                required: true,
                                message: intl.formatMessage({ id: 'global.required_field', defaultMessage: 'ضروري تكتب إسم المصدر!' })
                            }]}
                            colProps={{ xs: 24, md: 8 }}
                        />
                    </Row>

                </ProFormList>
            </DrawerForm>
        </>
    );
};


const AddItemPageConnected = connect((state: any) => ({ types: state.types.types }))(AddItem);
export default AddItemPageConnected;