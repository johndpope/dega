import axios from 'axios';
import {
  GET_SPACES_SUCCESS,
  GET_SPACES_FAILURE,
  ADD_SPACE_FAILURE,
  ADD_SPACE_SUCCESS,
  LOADING_SPACES,
  API_ADD_SPACE,
  API_GET_SPACES,
  API_DELETE_SPACE,
  API_UPDATE_SPACE,
  SET_SELECTED_SPACE,
  DELETE_SPACE_SUCCESS,
  DELETE_SPACE_FAILURE,
  UPDATE_SPACE_SUCCESS,
  UPDATE_SPACE_FAILURE,
} from '../constants/spaces';

export const getSpaces = () => {
  return (dispatch) => {
    dispatch(loadingSpaces());
    return axios
      .get(API_GET_SPACES)
      .then((response) => {
        dispatch(getSpacesSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getSpacesFailure(error.message));
      });
  };
};

export const setSelectedSpace = (space) => ({
  type: SET_SELECTED_SPACE,
  payload: space,
});

export const addSpace = (data) => {
  return (dispatch) => {
    dispatch(loadingSpaces());
    return axios
      .post(API_ADD_SPACE, data)
      .then((response) => {
        dispatch(addSpaceSuccess(response.data));
      })
      .catch((error) => {
        dispatch(addSpaceFailure(error.message));
      });
  };
};

export const deleteSpace = (id) => {
  return (dispatch) => {
    dispatch(loadingSpaces());
    return axios
      .delete(API_DELETE_SPACE + '/' + id)
      .then(() => {
        dispatch(deleteSpaceSuccess(id));
      })
      .catch((error) => {
        dispatch(deleteSpaceFailure(error.message));
      });
  };
};

export const updateSpace = (data) => {
  return (dispatch) => {
    dispatch(loadingSpaces());
    return axios
      .put(API_UPDATE_SPACE + '/' + data.id, data)
      .then((response) => {
        dispatch(updateSpaceSuccess(response.data));
      })
      .catch((error) => {
        dispatch(updateSpaceFailure(error.message));
      });
  };
};

const loadingSpaces = () => ({
  type: LOADING_SPACES,
});

const getSpacesSuccess = (spaces) => ({
  type: GET_SPACES_SUCCESS,
  payload: spaces,
});

const getSpacesFailure = (error) => ({
  type: GET_SPACES_FAILURE,
  payload: {
    error,
  },
});

const addSpaceSuccess = (space) => ({
  type: ADD_SPACE_SUCCESS,
  payload: space,
});

const addSpaceFailure = (error) => ({
  type: ADD_SPACE_FAILURE,
  payload: {
    error,
  },
});

const updateSpaceSuccess = (data) => ({
  type: UPDATE_SPACE_SUCCESS,
  payload: data,
});

const updateSpaceFailure = (error) => ({
  type: UPDATE_SPACE_FAILURE,
  payload: {
    error,
  },
});

const deleteSpaceSuccess = (id) => ({
  type: DELETE_SPACE_SUCCESS,
  payload: id,
});

const deleteSpaceFailure = (error) => ({
  type: DELETE_SPACE_FAILURE,
  payload: {
    error,
  },
});
