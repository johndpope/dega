import axios from 'axios';
import {
  ADD_EPISODE,
  ADD_EPISODES,
  ADD_EPISODES_REQUEST,
  SET_EPISODES_LOADING,
  RESET_EPISODES,
  EPISODES_API,
} from '../constants/episodes';
import { addErrorNotification, addSuccessNotification } from './notifications';
import getError from '../utils/getError';

export const getEpisodes = (query) => {
  return (dispatch) => {
    dispatch(loadingEpisodes());
    return axios
      .get(EPISODES_API, {
        params: query,
      })
      .then((response) => {
        dispatch(addEpisodesList(response.data.nodes));
        dispatch(
          addEpisodesRequest({
            data: response.data.nodes.map((item) => item.id),
            query: query,
            total: response.data.total,
          }),
        );
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      })
      .finally(() => dispatch(stopEpisodesLoading()));
  };
};

export const getEpisode = (id) => {
  return (dispatch) => {
    dispatch(loadingEpisodes());
    return axios
      .get(EPISODES_API + '/' + id)
      .then((response) => {
        dispatch(getEpisodeByID(response.data));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      })
      .finally(() => dispatch(stopEpisodesLoading()));
  };
};

export const addEpisode = (data) => {
  return (dispatch) => {
    dispatch(loadingEpisodes());
    return axios
      .post(EPISODES_API, data)
      .then(() => {
        dispatch(resetEpisodes());
        dispatch(addSuccessNotification('Episode added'));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      });
  };
};

export const updateEpisode = (data) => {
  return (dispatch) => {
    dispatch(loadingEpisodes());
    return axios
      .put(EPISODES_API + '/' + data.id, data)
      .then((response) => {
        dispatch(getEpisodeByID(response.data));
        dispatch(addSuccessNotification('Episode updated'));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      })
      .finally(() => dispatch(stopEpisodesLoading()));
  };
};

export const deleteEpisode = (id) => {
  return (dispatch) => {
    dispatch(loadingEpisodes());
    return axios
      .delete(EPISODES_API + '/' + id)
      .then(() => {
        dispatch(resetEpisodes());
        dispatch(addSuccessNotification('Episode deleted'));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      });
  };
};

export const addEpisodes = (episodes) => {
  return (dispatch) => {
    dispatch(addEpisodesList(episodes));
  };
};

export const loadingEpisodes = () => ({
  type: SET_EPISODES_LOADING,
  payload: true,
});

export const stopEpisodesLoading = () => ({
  type: SET_EPISODES_LOADING,
  payload: false,
});

export const getEpisodeByID = (data) => ({
  type: ADD_EPISODE,
  payload: data,
});

export const addEpisodesList = (data) => ({
  type: ADD_EPISODES,
  payload: data,
});

export const addEpisodesRequest = (data) => ({
  type: ADD_EPISODES_REQUEST,
  payload: data,
});

export const resetEpisodes = () => ({
  type: RESET_EPISODES,
});
