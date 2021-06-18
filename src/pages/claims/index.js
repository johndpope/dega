import React from 'react';
import { Space, Button, Row, Col, Form, Input, Select } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import ClaimList from './components/ClaimList';
import { useDispatch, useSelector } from 'react-redux';
import deepEqual from 'deep-equal';
import Selector from '../../components/Selector';
import { getClaims } from '../../actions/claims';

function Claims({ permission }) {
  const { actions } = permission;
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [filters, setFilters] = React.useState({
    page: query.get('page') ? query.get('page') : 1,
    limit: 20,
    sort: query.get('sort'),
    q: query.get('q'),
    rating: query.getAll('rating').map((r) => parseInt(r)),
    claimant: query.getAll('claimant').map((c) => parseInt(c)),
  });
  Object.keys(filters).forEach(function (key) {
    if (filters[key] && key !== 'limit')
      if (filters[key].length !== 0 && (key === 'claimant' || key === 'rating')) {
        query.delete(key);
        filters[key].map((each) => {
          query.append(key, each);
        });
      } else if (filters[key].length === 0) {
        query.delete(key);
      } else {
        query.set(key, filters[key]);
      }
  });
  window.history.replaceState({}, '', `${window.PUBLIC_URL}${location.pathname}?${query}`);
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
      claimant: values.claimant,
      rating: values.rating,
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
          let changedKey = Object.keys(changedValues)[0];
          if (
            (changedValues[changedKey].length !== 0 && changedKey === 'rating') ||
            changedKey === 'claimant'
          ) {
            query.append(changedKey, changedValues[changedKey]);
          } else {
            query.set(changedKey, changedValues[changedKey]);
          }
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
            <Form.Item name="claimant" label="Claimants">
              <Selector mode="multiple" action="Claimants" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item name="rating" label="Ratings">
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
