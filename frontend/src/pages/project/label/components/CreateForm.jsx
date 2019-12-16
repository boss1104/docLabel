import React from 'react';
import { Form, Modal, Input, Button, Select, Row, Col } from 'antd';
import { TwitterPicker } from 'react-color';

const FormItem = Form.Item;
const { Option } = Select;

const shortKeys = 'abcdefghijklmnopqrstuvwxyz';
const SHORT_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const defaultTextColors = [
  '#4D4D4D',
  '#333333',
  '#000000',
  '#999999',
  '#666666',
  '#808080',
  '#D9E3F0',
  '#CCCCCC',
  '#F44E3B',
  '#FE9200',
];
function CreateForm({ form, modalVisible, setModalVisible, handleSubmit, loading, onCreate }) {
  console.log('[DEBUG]: CreateForm -> form', form.getFieldsValue());
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
        handleSubmit(fieldsValue);
        form.resetFields();
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
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
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
        offset: 5,
      },
    },
  };

  const getButonStyle = () => ({
    backgroundColor: `${getFieldValue('background_color')}`,
    color: `${getFieldValue('text_color')}`,
  });

  return (
    <Modal
      title="Add Label"
      visible={modalVisible}
      footer={null}
      confirmLoading={loading}
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
        <FormItem
          label="Shortcut"
          help={hasFieldError('suffix_key') || ''}
          validateStatus={hasFieldError('suffix_key') ? 'error' : ''}
        >
          <Row type="flex">
            <Col>
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
            </Col>
            <Col>
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
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Colors">
          <Button onClick={() => setVisible(!visible)} style={getButonStyle()}>
            {getFieldValue('text') || 'Text'}
          </Button>
        </FormItem>
        <div style={{ display: visible ? 'block' : 'none' }}>
          <FormItem
            label="Background"
            validateStatus={hasFieldError('background_color') ? 'error' : ''}
            help={hasFieldError('background_color') || ''}
          >
            {getFieldDecorator('background_color', {
              initialValue: '#FF6900',
            })(<div />)}
            <TwitterPicker
              triangle="hide"
              onChange={color =>
                setFieldsValue({
                  background_color: color.hex,
                })
              }
            />
          </FormItem>
          <FormItem
            label="Text color"
            validateStatus={hasFieldError('text_color') ? 'error' : ''}
            help={hasFieldError('text_color') || ''}
          >
            {getFieldDecorator('text_color', {
              initialValue: '#FFFFFF',
            })(<div />)}
            <TwitterPicker
              triangle="hide"
              colors={defaultTextColors}
              onChange={color =>
                setFieldsValue({
                  text_color: color.hex,
                })
              }
            />
          </FormItem>
        </div>

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
}

export default Form.create()(CreateForm);
