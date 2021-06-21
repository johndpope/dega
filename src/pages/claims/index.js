import React from 'react';
import { Space, Button, Row, Col, Form, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import ClaimList from './components/ClaimList';
import { useDispatch, useSelector } from 'react-redux';
import deepEqual from 'deep-equal';
import Selector from '../../components/Selector';
import { getClaims } from '../../actions/claims';

function Claims({ permission }) {
  const { actions } = permission;
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 20,
  });
  const [form] = Form.useForm();
  const { Option } = Select;

  const { claims, total, loading } = useSelector((state) => {
    const node = state.claims.req.find((item) => {
      return deepEqual(item.query, filters);
    });

    if (node) {
      const list = node.data.map((element) => {
        let claim = state.claims.details[element];
        claim.claimant = state.claimants.details[claim.claimant_id].name;
        claim.rating = state.ratings.details[claim.rating_id].name;
        return claim;
      });
      return {
        claims: list,
        total: node.total,
        loading: state.claims.loading,
      };
    }
    return { claims: [], total: 0, loading: state.claims.loading };
  });

  React.useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchClaims = () => {
    dispatch(getClaims(filters));
  };

  const onSave = (values) => {
    let filterValue = {
      claimant: values.claimants,
      rating: values.ratings,
      sort: values.sort,
      q: values.q,
    };

    setFilters({ ...filters, ...filterValue });
  };

  return (
    <Space direction="vertical">
      <Form
        initialValues={filters}
        form={form}
        name="filters"
        onFinish={(values) => onSave(values)}
        style={{ maxWidth: '100%' }}
        onValuesChange={(changedValues, allValues) => {
          console.log('changedValues', changedValues, 'all', allValues);
          if (!changedValues.q) {
            onSave(allValues);
          }
        }}
      >
        <Row gutter={24}>
          <Col key={1}>
            <Link to="/claims/create">
              <Button disabled={!(actions.includes('admin') || actions.includes('create'))}>
                Create New
              </Button>
            </Link>
          </Col>
          <Col key={2} span={9} offset={12}>
            <Space direction="horizontal">
              <Form.Item name="q">
                <Input placeholder="search post" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">Search</Button>
              </Form.Item>
              <Form.Item name="sort" label="Sort" style={{ width: '100%' }}>
                <Select defaultValue="desc">
                  <Option value="desc">Latest</Option>
                  <Option value="asc">Old</Option>
                </Select>
              </Form.Item>
            </Space>
          </Col>
        </Row>
        <Row gutter={2}>
          <Col span={5}>
            <Form.Item name="claimants" label="Claimants">
              <Selector mode="multiple" action="Claimants" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item name="ratings" label="Ratings">
              <Selector mode="multiple" action="Ratings" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ClaimList
        actions={actions}
        data={{ claims: claims, total: total, loading: loading }}
        filters={filters}
        setFilters={setFilters}
        fetchClaims={fetchClaims}
      />
    </Space>
  );
}

export default Claims;
