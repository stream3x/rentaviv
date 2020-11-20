// Node Modules
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Grid } from '@material-ui/core';
import { ArrowRight as ArrowRightIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
// Context
import AuthContext from '../../context/auth/authContext';
// Components
import Hero from '../layout/Hero';
import CardMediaV1 from '../layout/CardMediaV1';
// Assets
import LoadingGif from '../../assets/loading-transparent.gif';

// define styles
const useStyles = makeStyles(theme => ({
	h2: {
		fontSize: '1.7rem',
		fontWeight: 700,
		margin: theme.spacing(6, 0, 3)
	},
	textPrimary: {
		color: theme.palette.primary.main
	},
	loadingGif: {
		height: '20vh'
	},
	motionDiv: {
		height: '100%'
	}
}));

// Home Component
const Home = () => {
	// define classes
	const classes = useStyles();

	// load auth context
	const authContext = useContext(AuthContext);

	// home state
	const [ homeState, setHomeState ] = useState({
		loading: true,
		categories: null,
		offers: null
	});
	// destructure home state
	const { loading, categories, offers } = homeState;

	// load user
	useEffect(() => {
		if (localStorage.token) {
			authContext.loadUser();
		}
		// eslint-disable-next-line
	}, []);

	// get categories
	const getDbEntries = async () => {
		// response
		const resCategories = await axios.get('/api/categories/get', { params: { rand: true, limit: 4 } });
		const resOffers = await axios.get('/api/offers/get', { params: { rand: true, limit: 3 } });
		// set sate
		if ((resCategories.data, resOffers.data)) {
			setHomeState({ loading: false, categories: resCategories.data, offers: resOffers.data });
		}
	};

	// load assets
	useEffect(() => {
		getDbEntries();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='home'>
			<Hero />
			<Container className={classes.categories} maxWidth='lg'>
				{loading ? (
					<Box width='100%' textAlign='center'>
						<img className={classes.loadingGif} src={LoadingGif} alt='loading...' />
					</Box>
				) : (
					[
						<Box key='categories-box' width='100%'>
							<Typography className={classes.h2} variant='h2'>
								Featured <span className={classes.textPrimary}>Categories</span>
							</Typography>
							<Grid container width='100%' spacing={4}>
								{categories.map(category => {
									return (
										<Grid key={category._id} item xs={12} sm={6} md={3}>
											<motion.div
												className={classes.motionDiv}
												transition={{
													duration: 1,
													type: 'tween'
												}}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
											>
												<CardMediaV1
													link={`/offers/${category.title}`}
													image={category.image}
													title={category.title}
													btnname='Explorer'
													btnicon={<ArrowRightIcon />}
												>
													{category.description}
												</CardMediaV1>
											</motion.div>
										</Grid>
									);
								})}
							</Grid>
						</Box>,
						<br key='break-1' />,
						<Box key='offers-box' width='100%'>
							<Typography className={classes.h2} variant='h2'>
								Featured <span className={classes.textPrimary}>Offers</span>
							</Typography>
							<Grid container width='100%' spacing={4}>
								{offers.map(offer => {
									return (
										<Grid key={offer._id} item xs={12} sm={6} md={3}>
											<motion.div
												className={classes.motionDiv}
												transition={{
													duration: 1,
													type: 'tween'
												}}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
											>
												<CardMediaV1
													link={`/offers/${offer.title}`}
													image={`/${offer.images[0]}`}
													title={offer.title}
													btnname='Explorer'
													btnicon={<ArrowRightIcon />}
												>
													{offer.description}
												</CardMediaV1>
											</motion.div>
										</Grid>
									);
								})}
							</Grid>
						</Box>
					]
				)}
			</Container>
		</div>
	);
};

// export Home Component
export default Home;
