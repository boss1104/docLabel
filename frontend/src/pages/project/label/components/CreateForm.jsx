import React from 'react';
import { Form, Modal, Input, Button, Select, Row, Col } from 'antd';
import { TwitterPicker } from 'react-color';

const FormItem = Form.Item;
const { Option } = Select;

const shortKeys = 'abcdefghijklmnopqrstuvwxyz';
const SHORT_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default Form.create()(props => {
  const { form, modalVisible, setModalVisible, handleSubmit, loading, onCreate } = props;
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (onCreate) {
      onCreate(form);
    }
  }, []);

  const handleOk = onOK => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
      } else {
        if (onOK) {
          setModalVisible(false);
          form.resetFields();
        }
        handleSubmit(fieldsValue);
      }
    });
  };

  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
    getFieldValue,
    setFieldsValue,
  } = form;
  const hasFieldError = fieldname => isFieldTouched(fieldname) && getFieldError(fieldname);
  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  };

  return (
    <Modal
      title="Add Label"
      visible={modalVisible}
      okText="Submit and Close"
      cancelText="Close"
      confirmLoading={loading}
      okButtonProps={{ disabled: hasErrors(getFieldsError()) }}
      onOk={() => handleOk(true)}
      onCancel={() => setModalVisible(false)}
    >
      <Form
        layout="horizontal"
        {...formItemLayout}
        onSubmit={e => {
          e.preventDefault();
          handleOk();
        }}
      >
        <Form.Item label="id" style={{ display: 'none' }}>
          {getFieldDecorator('id', {})(<Input />)}
        </Form.Item>
        <FormItem
          label="Text"
          // validateStatus={getFieldError('text') ? 'error' : ''}
          // help={getFieldError('text') || ''}
        >
          {getFieldDecorator('text', {
            rules: [{ required: true, message: 'Text required' }],
          })(<Input placeholder="Label text" />)}
        </FormItem>
        <Row>
          <Col sm={8}>
            <FormItem
              label="Shortcut"
              // validateStatus={hasFieldError('suffix_key') ? 'error' : ''}
              // help={hasFieldError('suffix_key') || ''}
              {...{
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 12 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 12 },
                },
              }}
            >
              {getFieldDecorator('prefix_key', {
                initialValue: '',
              })(
                <Select style={{ width: 120 }}>
                  <Option value="">None</Option>
                  <Option value="ctrl">Ctrl</Option>
                  <Option value="shift">Shift</Option>
                  <Option value="ctrl shift">Ctrl + Shift</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={{ span: 8, offset: 2 }}>
            <FormItem
              // validateStatus={getFieldError('suffix_key') ? 'error' : ''}
              // help={getFieldError('suffix_key') || ''}
              {...{
                labelCol: {
                  xs: { span: 0 },
                  sm: { span: 0 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 24 },
                },
              }}
            >
              {getFieldDecorator('suffix_key', {
                rules: [{ required: true, message: 'Hotkey required' }],
              })(
                <Select style={{ width: 120 }} showSearch>
                  {[...shortKeys].map(key => (
                    <Option key={key} value={key}>
                      {SHORT_KEYS[shortKeys.indexOf(key)]}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col sm={6}></Col>
        </Row>

        <FormItem
          label="Color"
          validateStatus={hasFieldError('background_color') ? 'error' : ''}
          help={hasFieldError('background_color') || ''}
        >
          {getFieldDecorator('background_color', {
            initialValue: '#209cee',
            rules: [{ required: true, message: 'Color required' }],
          })(
            <Button
              onClick={() => setVisible(!visible)}
              style={{ backgroundColor: getFieldValue('background_color') }}
            >
              {getFieldValue('text') || 'Text'}
            </Button>,
          )}
          {visible && (
            <TwitterPicker
              triangle="hide"
              onChange={color =>
                setFieldsValue({
                  background_color: color.hex,
                })
              }
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button
            htmlType="submit"
            type="primary"
            disabled={hasErrors(getFieldsError())}
            loading={loading}
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
});
