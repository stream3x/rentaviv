// Node Modules
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, TextField, Grid } from '@material-ui/core';
import { ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
// Context
import AuthContext from '../../context/auth/authContext';

// define styles
const useStyles = makeStyles(theme => ({
	registerUserData: {
		padding: theme.spacing(3, 4)
	},
	description: {
		textAlign: 'center',
		margin: theme.spacing(0, 0, 3)
	},
	grid: {
		marginBottom: theme.spacing(3)
	},
	gridItem: {},
	textfield: {
		width: '100%'
	},
	// nextButton: {
	// 	width: '100%'
	// },
	buttonIcon: {
		[theme.breakpoints.down('xs')]: {
			display: 'none'
		}
	}
}));

// RegisterUserData Component
const RegisterUserData = props => {
	// styling classes
	const classes = useStyles();

	// load auth context
	const authContext = useContext(AuthContext);
	// destructure auth context
	const {
		loading,
		usernameErr,
		emailErr,
		passwordErr,
		passwordConfirmErr,
		validateUserData,
		clearErrors,
		setState
	} = authContext;

	// destructure props
	const { values, handleInputChange, nextStep } = props;

	// continue form
	const continueForm = input => {
		clearErrors();
		validateUserData(input);
	};

	// execute on error state change
	useEffect(
		() => {
			if (!loading && !usernameErr && !emailErr && !passwordErr && !passwordConfirmErr) {
				//console.log('next');
				setState('SET_LOADING', true);
				nextStep();
			}
		},
		// eslint-disable-next-line
		[ loading, usernameErr, emailErr, passwordErr, passwordConfirmErr ]
	);

	return (
		<Box className={classes.registerUserData} width='100%'>
			<Typography className={classes.description} variant='subtitle1'>
				Please enter your user details.
			</Typography>
			<Grid className={classes.grid} width='100%' container spacing={2}>
				<Grid item xs={12} className={classes.gridItem}>
					<TextField
						id='username'
						name='username'
						className={classes.textfield}
						variant='outlined'
						label={usernameErr ? usernameErr : 'Username'}
						placeholder='toolsmaster'
						type='text'
						error={usernameErr ? true : false}
						onChange={handleInputChange('username')}
						defaultValue={values.username}
					/>
				</Grid>
				<Grid item xs={12} className={classes.gridItem}>
					<TextField
						id='email'
						name='email'
						className={classes.textfield}
						variant='outlined'
						label={emailErr ? emailErr : 'Email'}
						placeholder='john.doe@gmail.com'
						type='email'
						error={emailErr ? true : false}
						onChange={handleInputChange('email')}
						defaultValue={values.email}
					/>
				</Grid>
				<Grid item xs={12} className={classes.gridItem}>
					<TextField
						id='password'
						name='password'
						className={classes.textfield}
						variant='outlined'
						label={passwordErr ? passwordErr : 'Password'}
						type='password'
						error={passwordErr ? true : false}
						onChange={handleInputChange('password')}
						defaultValue={values.password}
					/>
				</Grid>
				<Grid item xs={12} className={classes.gridItem}>
					<TextField
						id='passwordConfirm'
						name='passwordConfirm'
						className={classes.textfield}
						variant='outlined'
						label={passwordConfirmErr ? passwordConfirmErr : 'Confirm Password'}
						type='password'
						error={passwordConfirmErr ? true : false}
						onChange={handleInputChange('passwordConfirm')}
						defaultValue={values.passwordConfirm}
					/>
				</Grid>
			</Grid>
			<Box width='100%' display='flex' justifyContent='flex-end'>
				<Button
					className={classes.nextButton}
					width='100%'
					variant='outlined'
					color='primary'
					endIcon={<ArrowForwardIcon className={classes.buttonIcon} />}
					size='large'
					onClick={() => continueForm(values)}
				>
					Continue
				</Button>
			</Box>
		</Box>
	);
};

// PropTypes
RegisterUserData.propTypes = {
	nextStep: PropTypes.func.isRequired,
	handleInputChange: PropTypes.func.isRequired,
	values: PropTypes.object.isRequired
};

// export RegisterUserData Component
export default RegisterUserData;
