// Node Modules
import React, { useContext, useEffect, useState, Fragment } from 'react';
import { Link as RouterLink, withRouter, Redirect } from 'react-router-dom';
import { Container, Box, Breadcrumbs, Link, Grid, Typography } from '@material-ui/core';
import { ArrowRight as ArrowRightIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
// Context
import AuthContext from '../../context/auth/authContext';
import QueryContext from '../../context/query/queryContext';
// Components
import CardMediaV2 from '../cards/CardMediaV2';
import Pagination from '../layout/Pagination';
// Assets
import LoadingGif from '../../assets/loading-transparent.gif';
import EmptySvg from '../../assets/undraw/empty.svg';

// define styles
const useStyles = makeStyles(theme => ({
	textPrimary: {
		color: theme.palette.primary.main
	},
	profile: {
		minHeight: '100vh',
		padding: theme.spacing(20, 0, 8)
	},
	breadcrumps: {
		margin: theme.spacing(0, 0, 4)
	},
	contentBox: {
		marginTop: theme.spacing(2)
	},
	loadingGif: {
		height: '20vh'
	},
	title: {
		fontSize: '1.7rem',
		fontWeight: 700,
		margin: theme.spacing(0, 0, 3)
	},
	noOffersContainer: {
		marginTop: theme.spacing(12),
		minHeight: '50vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		'& h3': {
			textAlign: 'center',
			fontSize: '1.5rem',
			fontWeight: 700,
			color: theme.palette.primary.main,
			margin: theme.spacing(1.5, 0)
		},
		'& p': {
			textAlign: 'center'
		}
	},
	emptySvg: {
		height: '200px'
	},
	offersCard: {
		height: '100%'
	}
}));

// Profile Component
const Profile = props => {
	// define classes
	const classes = useStyles();

	// load authContext
	const authContext = useContext(AuthContext);
	const { user } = authContext;

	// load query context
	const queryContext = useContext(QueryContext);
	const { errors, loading, page, pageCount, offers, getUserOffers, getUserBookings, setPage } = queryContext;

	// profile state
	const [ profileState, setprofileState ] = useState({
		tabLocation: window.location.search.split('=')[1],
		redirect: false
	});

	// on page load
	useEffect(() => {
		// reset profile state
		setprofileState({ tabLocation: 'offers', redirect: false });
		// scroll to top
		window.scrollTo(0, 0);
	}, []);

	// set tabLocation
	useEffect(
		() => {
			const tabLocation = props.history.location.search.split('=')[1];
			if (tabLocation === 'offers' || tabLocation === 'bookings' || tabLocation === 'messages') {
				setprofileState({ ...profileState, tabLocation: tabLocation });
			} else {
				setprofileState({ ...profileState, redirect: true });
			}
		},
		// eslint-disable-next-line
		[ props.history.location.search ]
	);

	// query content on tab change
	useEffect(
		() => {
			if (profileState.tabLocation === 'offers') getUserOffers();
			if (profileState.tabLocation === 'bookings') getUserBookings();
			if (profileState.tabLocation === 'messages') console.log('messages query');
		},
		// eslint-disable-next-line
		[ profileState.tabLocation ]
	);

	// handle pagination
	const handlePagination = (e, value) => {
		// scroll to top of results
		window.scroll(0, 0);
		// set page
		setPage(value);
	};

	// tab location elements
	const TabLocation = () => {
		switch (profileState.tabLocation) {
			case 'bookings':
				return loading ? (
					<Box className={classes.contentBox} width='100%' textAlign='center'>
						<img className={classes.loadingGif} src={LoadingGif} alt='loading...' />
					</Box>
				) : (
					<div>Bookings</div>
				);
			case 'messages':
				return loading ? (
					<Box className={classes.contentBox} width='100%' textAlign='center'>
						<img className={classes.loadingGif} src={LoadingGif} alt='loading...' />
					</Box>
				) : (
					<div>Messages</div>
				);
			default:
				return loading ? (
					<Box className={classes.contentBox} width='100%' textAlign='center'>
						<img className={classes.loadingGif} src={LoadingGif} alt='loading...' />
					</Box>
				) : offers[0] ? (
					<Fragment>
						<Typography className={classes.title} width='100%' variant='h2'>
							Your <span className={classes.textPrimary}>Offers</span>
						</Typography>
						<Grid className={classes.offersGrid} container width='100%' spacing={3}>
							{offers.map(el => {
								return (
									<Grid key={el._id} item xs={12} sm={6} md={4}>
										<motion.div
											className={classes.offersCard}
											transition={{
												duration: 1,
												type: 'tween'
											}}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
										>
											<CardMediaV2
												price={`${el.price} ${el.currency} daily`}
												link={`/profile/offer/edit?id=${el._id}`}
												image={`${el.imagesThumb[0]}`}
												title={el.title}
												btnName='View'
												btnIcon={<ArrowRightIcon />}
												location={el.location.label}
											>
												<Typography className={classes.cardParagraph} variant='body1'>
													{el.description.join(' ').length > 150 ? (
														el.description.join(' ').substring(0, 150) + '...'
													) : (
														el.description.join(' ')
													)}
												</Typography>
											</CardMediaV2>
										</motion.div>
									</Grid>
								);
							})}
						</Grid>
						<Pagination page={page} pageCount={pageCount} onChange={handlePagination} />
					</Fragment>
				) : (
					<Box className={classes.noOffersContainer} width='100%' height='100%'>
						<img className={classes.emptySvg} src={EmptySvg} alt='Empty' />
						<Typography variant='h3'>{errors}</Typography>
						<Typography variant='body1'>You can see your offers here after you created one.</Typography>
					</Box>
				);
		}
	};

	return (
		<div className={classes.profile}>
			<Container maxWidth='xl'>
				<Breadcrumbs className={classes.breadcrumps}>
					<Link component={RouterLink} to='/' color='inherit'>
						Home
					</Link>
					<Typography color='textPrimary'>
						{user && profileState.tabLocation ? (
							`${user.username}'s ${profileState.tabLocation.charAt(0).toUpperCase() +
								profileState.tabLocation.slice(1)}`
						) : (
							'Profile'
						)}
					</Typography>
				</Breadcrumbs>
				<TabLocation />
			</Container>
			{profileState.redirect && <Redirect to='/profile?tab=offers' />}
		</div>
	);
};

// export Profile Component
export default withRouter(Profile);
