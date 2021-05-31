import React, { useState } from 'react';
import { Popconfirm, Button, List, Input, Select, Form, Space, Tag, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPages, deletePage } from '../../../actions/pages';
import { Link } from 'react-router-dom';
import Selector from '../../../components/Selector';
import deepEqual from 'deep-equal';
import ImagePlaceholder from '../../../components/ErrorsAndImage/PlaceholderImage';
import QuickEdit from '../../../components/List/QuickEdit';
import moment from 'moment';

function PageList({ actions, format, status }) {
  const dispatch = useDispatch();
  const { Option } = Select;
  const [form] = Form.useForm();

  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 20,
  });
  const [id, setID] = useState(0);

  const { pages, total, loading, tags, categories } = useSelector((state) => {
    const node = state.pages.req.find((item) => {
      return deepEqual(item.query, filters);
    });

    if (node)
      return {
        pages: node.data.map((element) => {
          const page = state.pages.details[element];

          page.medium = state.media.details[page.featured_medium_id];
          return page;
        }),
        total: node.total,
        loading: state.pages.loading,
        tags: state.tags.details,
        categories: state.categories.details,
      };
    return { pages: [], total: 0, loading: state.pages.loading, tags: {}, categories: {} };
  });

  React.useEffect(() => {
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchPages = () => {
    dispatch(getPages(filters));
  };

  const onSave = (values) => {
    let filterValue = {
      tag: values.tags,
      category: values.categories,
      sort: values.sort,
      q: values.q,
      author: values.authors,
      status: values.status !== 'all' ? values.status : null,
    };
    setFilters({ ...filters, ...filterValue });
  };

  const getTagList = (tagids) => {
    return tagids.map((id) => <Tag>{tags[id].name}</Tag>);
  };
  const getCategoryList = (catIds) => {
    return catIds.map((id) => <Tag>{categories[id].name}</Tag>);
  };

  return (
    <Space direction="vertical">
      <Form
        initialValues={filters}
        form={form}
        name="filters"
        layout="inline"
        onFinish={(values) => onSave(values)}
        style={{ maxWidth: '100%' }}
        className="ant-advanced-search-form"
      >
        <Row gutter={24}>
          <Col span={8} key={1}>
            <Form.Item name="q" label="Search" style={{ width: '260px' }}>
              <Input placeholder="search Pages" />
            </Form.Item>
          </Col>
          <Col span={8} key={2}>
            <Form.Item name="sort" label="Sort" style={{ width: '260px' }}>
              <Select defaultValue="desc" style={{ maxWidth: '260px' }}>
                <Option value="desc">Latest</Option>
                <Option value="asc">Old</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} key={3}>
            <Form.Item name="status" label="Status" style={{ width: '260px' }}>
              <Select defaultValue="all" style={{ maxWidth: '260px' }}>
                <Option value="all">All</Option>
                <Option value="draft">Draft</Option>
                <Option value="publish">Publish</Option>
                <Option value="ready">Ready to Publish</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} key={4}>
            <Form.Item name="tags" label="Tags" style={{ width: '260px' }}>
              <Selector
                mode="multiple"
                action="Tags"
                placeholder="Filter Tags"
                style={{
                  maxWidth: '260px',
                  marginTop: '8px',
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8} key={5}>
            <Form.Item name="categories" label="Categories" style={{ width: '260px' }}>
              <Selector
                mode="multiple"
                action="Categories"
                placeholder="Filter Categories"
                style={{
                  maxWidth: '260px',
                  marginTop: '8px',
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8} key={6}>
            <Form.Item name="authors" label="Authors" style={{ width: '260px' }}>
              <Selector
                mode="multiple"
                action="Authors"
                placeholder="Filter Authors"
                display={'email'}
                style={{
                  maxWidth: '260px',
                  marginTop: '8px',
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: '8px', marginLeft: '1080px' }}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <List
        bordered
        className="post-list"
        loading={loading}
        itemLayout="vertical"
        dataSource={pages}
        pagination={{
          total: total,
          current: filters.page,
          pageSize: filters.limit,
          onChange: (pageNumber, pageSize) =>
            setFilters({ ...filters, page: pageNumber, limit: pageSize }),
        }}
        renderItem={(item) => (
          <List.Item
            actions={
              item.id !== id
                ? [
                    <Link
                      style={{
                        marginRight: 8,
                      }}
                      to={`/pages/${item.id}/edit`}
                    >
                      <Button
                        icon={<EditOutlined />}
                        disabled={!(actions.includes('admin') || actions.includes('update'))}
                      >
                        Edit
                      </Button>
                    </Link>,
                    <Popconfirm
                      title="Sure to Delete?"
                      onConfirm={() => dispatch(deletePage(item.id)).then(() => fetchPages())}
                      disabled={!(actions.includes('admin') || actions.includes('delete'))}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        disabled={!(actions.includes('admin') || actions.includes('delete'))}
                      >
                        Delete
                      </Button>
                    </Popconfirm>,
                    <Button
                      icon={<EditOutlined />}
                      disabled={!(actions.includes('admin') || actions.includes('update'))}
                      onClick={() => setID(item.id)}
                    >
                      Quick Edit
                    </Button>,
                    item.status === 'publish' ? (
                      <Button style={{ border: 'solid 1px', color: 'green', width: '140px' }}>
                        Published
                      </Button>
                    ) : item.status === 'draft' ? (
                      <Button style={{ border: 'solid 1px', color: 'red', width: '140px' }}>
                        Draft
                      </Button>
                    ) : item.status === 'ready' ? (
                      <Button style={{ border: 'solid 1px', color: 'gold', width: '140px' }}>
                        Ready to Publish
                      </Button>
                    ) : null,
                  ]
                : []
            }
            extra={
              item.id !== id ? (
                item.medium ? (
                  <img
                    style={{ width: '150', height: '150' }}
                    alt={item.medium.alt_text}
                    src={
                      item.medium.url?.proxy
                        ? `${item.medium.url.proxy}?resize:fill:150:150/gravity:sm`
                        : ''
                    }
                  />
                ) : (
                  <ImagePlaceholder height={150} width={150} />
                )
              ) : null
            }
          >
            {item.id !== id ? (
              <List.Item.Meta
                title={<Link to={`/pages/${item.id}/edit`}>{item.title}</Link>}
                description={item.excerpt}
              />
            ) : null}
            {item.id === id ? (
              <QuickEdit data={item} setID={setID} slug={format.slug} page={true} />
            ) : null}
            {item.id !== id ? (
              <Space direction="vertical">
                {item.published_date ? (
                  <div>Published Date: {moment(item.published_date).format('MMMM Do YYYY')}</div>
                ) : null}
                {item.tags && item.tags.length > 0 ? (
                  <div>Tags: {getTagList(item.tags)}</div>
                ) : null}

                {item.categories && item.categories.length > 0 ? (
                  <div>Categories: {getCategoryList(item.categories)}</div>
                ) : null}
              </Space>
            ) : null}
          </List.Item>
        )}
      />
    </Space>
  );
}

export default PageList;
