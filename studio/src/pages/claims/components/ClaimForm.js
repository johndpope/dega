import React from 'react';
import { Button, Form, Input, DatePicker, Row, Col, Collapse } from 'antd';
import Selector from '../../../components/Selector';
import Editor from '../../../components/Editor';
import { maker, checker } from '../../../utils/sluger';
import moment from 'moment';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import MonacoEditor from '../../../components/MonacoEditor';
import getJsonValue from '../../../utils/getJsonValue';

const layout = {
  // labelCol: {
  //   span: 8,
  //   offset: 2,
  // },
  // wrapperCol: {
  //   span: 20,
  //   offset: 2,
  // },
};

const ClaimForm = ({ onCreate, data = {} }) => {
  if (data && data.meta_fields) {
    if (typeof data.meta_fields !== 'string') {
      data.meta_fields = JSON.stringify(data.meta_fields);
    }
  }
  const [form] = Form.useForm();
  const [valueChange, setValueChange] = React.useState(false);
  const { Panel } = Collapse;
  const [activeKey, setActiveKey] = React.useState(['1', '2']);

  const onReset = () => {
    form.resetFields();
  };

  const disabledDate = (current) => {
    return current.valueOf() > Date.now();
  };

  const onSave = (values) => {
    values.claimant_id = values.claimant || 0;
    values.rating_id = values.rating || 0;
    values.claim_date = values.claim_date
      ? moment(values.claim_date).format('YYYY-MM-DDTHH:mm:ssZ')
      : null;
    values.checked_date = values.checked_date
      ? moment(values.checked_date).format('YYYY-MM-DDTHH:mm:ssZ')
      : null;

    onCreate(values);
  };

  const onClaimChange = (string) => {
    if (string.length > 150) {
      form.setFieldsValue({
        slug: maker(string.substring(0, 150)),
      });
    } else {
      form.setFieldsValue({
        slug: maker(string),
      });
    }
  };

  if (data && data.id) {
    data.claim_date = data.claim_date ? moment(data.claim_date) : null;
    data.checked_date = data.checked_date ? moment(data.checked_date) : null;
  }

  const handleCollapse = (props) => {
    setActiveKey(props);
  };

  return (
    <div>
      <Form
        {...layout}
        form={form}
        initialValues={data}
        name="create-claim"
        onFinish={(values) => {
          if (values.meta_fields) {
            values.meta_fields = getJsonValue(values.meta_fields);
          }
          onSave(values);
          onReset();
        }}
        onFinishFailed={(errors) => {
          let name = errors.errorFields[0].name[0];
          if (['claim', 'slug', 'claimant', 'rating'].includes(name)) {
            setActiveKey(['1']);
          } else {
            setActiveKey(['2']);
          }
          if (errors.errorFields[0].name[0] !== 'review_sources') {
          }
          if (errors.errorFields[0].name[0] !== 'claim_sources') {
          }
        }}
        onValuesChange={() => {
          setValueChange(true);
        }}
        scrollToFirstError={true}
        style={{
          paddingTop: '24px',
        }}
        layout="vertical"
      >
        <Form.Item>
          <Button
            disabled={!valueChange}
            type="primary"
            htmlType="submit"
            style={{ marginLeft: 'auto', display: 'block' }}
          >
            {data && data.id ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
        <Collapse
          style={{ width: '100%', marginBottom: '15px', maxWidth: 800, margin: '0 auto' }}
          defaultActiveKey={['1', '2']}
          activeKey={activeKey && activeKey}
          onChange={(props) => handleCollapse(props)}
          expandIconPosition="right"
          expandIcon={({ isActive }) => <Button>{isActive ? 'Close' : 'Expand'}</Button>}
        >
          <Panel header="Basic" key="1">
            <Form.Item
              name="claim"
              label="Claim"
              rules={[
                {
                  required: true,
                  message: 'Please input the Claim!',
                },
                { min: 3, message: 'Claim must be minimum 3 characters.' },
                { max: 5000, message: 'Claim must be maximum 5000 characters.' },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Enter claim...."
                onChange={(e) => onClaimChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="slug"
              label="Slug"
              rules={[
                {
                  required: true,
                  message: 'Please input the slug!',
                },
                {
                  pattern: checker,
                  message: 'Please enter valid slug!',
                },
                { max: 150, message: 'Slug must be maximum 150 characters.' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="fact" label="Fact">
              <Input.TextArea rows={6} placeholder={'Enter Fact ...'} />
            </Form.Item>
            <Form.Item
              name="claimant"
              label="Claimant"
              rules={[
                {
                  required: true,
                  message: 'Please add claimant!',
                },
              ]}
            >
              <Selector action="Claimants" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              rules={[
                {
                  required: true,
                  message: 'Please add rating!',
                },
              ]}
            >
              <Selector action="Ratings" />
            </Form.Item>
            <Form.Item>
              <Form.Item
                name="claim_date"
                label="Claim Date"
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              >
                <DatePicker disabledDate={disabledDate} />
              </Form.Item>
              <Form.Item
                name="checked_date"
                label="Checked Date"
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              >
                <DatePicker disabledDate={disabledDate} />
              </Form.Item>
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Editor placeholder="Enter Description..." />
            </Form.Item>
          </Panel>
          <Panel header="Sources" key="2">
            <Form.Item label="Claim Sources">
              <Form.List name="claim_sources" label="Claim sources">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Row
                        style={{ justifyContent: 'center', alignItems: 'baseline' }}
                        key={field}
                        gutter={13}
                      >
                        <Col span={11}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'url']}
                            fieldKey={[field.fieldKey, 'url']}
                            rules={[{ required: true, message: 'Url required' }]}
                            wrapperCol={24}
                          >
                            <Input placeholder="Enter url" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'description']}
                            fieldKey={[field.fieldKey, 'description']}
                            rules={[{ required: true, message: 'Description required' }]}
                            wrapperCol={24}
                          >
                            <Input placeholder="Enter description" />
                          </Form.Item>
                        </Col>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Claim sources
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label="Review Sources">
              <Form.List name="review_sources" label="Review sources">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Row
                        style={{ justifyContent: 'center', alignItems: 'baseline' }}
                        gutter={13}
                        key={field}
                      >
                        <Col span={11}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'url']}
                            fieldKey={[field.fieldKey, 'url']}
                            rules={[{ required: true, message: 'Url required' }]}
                            wrapperCol={24}
                          >
                            <Input placeholder="Enter url" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'description']}
                            fieldKey={[field.fieldKey, 'description']}
                            rules={[{ required: true, message: 'Description required' }]}
                            wrapperCol={24}
                          >
                            <Input placeholder="Enter description" />
                          </Form.Item>
                        </Col>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Review sources
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Panel>
        </Collapse>
        <Collapse
          expandIconPosition="right"
          expandIcon={({ isActive }) => <Button>{isActive ? 'Close' : 'Expand'}</Button>}
          style={{ width: '100%', marginBottom: '15px', maxWidth: 800, margin: '0 auto' }}
        >
          <Panel header="Meta Data">
            <Form.Item name={['meta', 'title']} label="Meta Title">
              <Input />
            </Form.Item>
            <Form.Item name={['meta', 'description']} label="Meta Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={['meta', 'canonical_URL']} label="Canonical URL">
              <Input />
            </Form.Item>
          </Panel>
        </Collapse>
        <Collapse
          expandIconPosition="right"
          expandIcon={({ isActive }) => <Button>{isActive ? 'Close' : 'Expand'}</Button>}
          style={{ width: '100%', marginBottom: '15px', maxWidth: 800, margin: '0 auto' }}
        >
          <Panel header="Code Injection">
            <Form.Item name="header_code" label="Header Code">
              <MonacoEditor language="html" width="100%" />
            </Form.Item>
            <Form.Item name="footer_code" label="Footer Code">
              <MonacoEditor language="html" width="100%" />
            </Form.Item>
          </Panel>
        </Collapse>
        <Collapse
          expandIconPosition="right"
          expandIcon={({ isActive }) => <Button>{isActive ? 'Close' : 'Expand'}</Button>}
          style={{ width: '100%', marginBottom: '15px', maxWidth: 800, margin: '0 auto' }}
        >
          <Panel header="Meta Fields" key="3">
            <Form.Item name="meta_fields">
              <MonacoEditor language="json" />
            </Form.Item>
          </Panel>
        </Collapse>
      </Form>
    </div>
  );
};

export default ClaimForm;
