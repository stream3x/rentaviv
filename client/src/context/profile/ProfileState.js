import React, { useReducer } from 'react';
import axios from 'axios';
import ProfileContext from './profileContext';
import profileReducer from './profileReducer';

import { RESET_PROFILE_STATE, SET_TAB_LOCATION, SET_REDIRECT } from '../types';

// ProfileState
const ProfileState = props => {
	// initial state
	const initialState = {
		tabLocation: window.location.search.split('=')[1],
		redirect: false,
		modalOpen: false
	};

	// geoCodeApiKey
	let geoCodeApiKey;
	// set geoCodeApiKey
	if (process.env.NODE_ENV !== 'production') {
		geoCodeApiKey = process.env.REACT_APP_GEOCODE_API_KEY;
	} else {
		geoCodeApiKey = process.env.GEOCODE_API_KEY;
	}

	// destructure reducer
	const [ state, dispatch ] = useReducer(profileReducer, initialState);

	// reset profile state
	const resetProfileState = () => dispatch({ type: RESET_PROFILE_STATE });

	// set tab location
	const setTabLocation = tabLocation => dispatch({ type: SET_TAB_LOCATION, payload: tabLocation });

	// set redirect
	const setRedirect = bool => dispatch({ type: SET_REDIRECT, payload: bool });

	return (
		<ProfileContext.Provider
			value={{
				tabLocation: state.tabLocation,
				redirect: state.redirect,
				modalOpen: state.modalOpen,
				resetProfileState,
				setTabLocation,
				setRedirect
			}}
		>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileState;
