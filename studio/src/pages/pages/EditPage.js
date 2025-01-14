import React from 'react';
import PageEditForm from '../posts/components/PostForm';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { updatePage, getPage } from '../../actions/pages';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import RecordNotFound from '../../components/ErrorsAndImage/RecordNotFound';
import getUserPermission from '../../utils/getUserPermission';

function EditPage({ formats }) {
  const history = useHistory();
  const { id } = useParams();
  const spaces = useSelector(({ spaces }) => spaces);
  const actions = getUserPermission({ resource: 'pages', action: 'get', spaces });

  const dispatch = useDispatch();

  const { page, loading } = useSelector((state) => {
    return {
      page: state.pages.details[id] ? state.pages.details[id] : null,
      loading: state.pages.loading,
    };
  });

  React.useEffect(() => {
    dispatch(getPage(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Skeleton />;

  if (!page) {
    return <RecordNotFound />;
  }

  const onUpdate = (values) => {
    dispatch(updatePage({ ...page, ...values })).then(() => {
      history.push(`/pages/${id}/edit`);
    });
  };
  return (
    <PageEditForm
      data={page}
      onCreate={onUpdate}
      actions={actions}
      format={formats.article}
      page={true}
    />
  );
}

export default EditPage;
