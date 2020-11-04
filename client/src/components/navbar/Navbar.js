// Node Modules
import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Link, IconButton, Badge, Toolbar, Typography } from '@material-ui/core';
import {
	Menu as MenuIcon,
	Mail as MailIcon,
	Home as HomeIcon,
	Map as MapIcon,
	Info as InfoIcon,
	Help as HelpIcon,
	Notifications as NotificationsIcon,
	AccountCircle as AccountCircleIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
// Components
import UserMenu from './UserMenu';
import MainMenu from './MainMenu';
// Context
import AuthContext from '../../context/auth/authContext';
import NavbarContext from '../../context/navbar/navbarContext';
// Assets
import logoWhite from '../../assets/logo/logo-white.svg';
import logoPrimary from '../../assets/logo/logo-primary.svg';
import logoBlack from '../../assets/logo/logo-black.svg';

// define styles
const useStyles = makeStyles(theme => ({
	grow: {
		flexGrow: 1
	},
	navbar: {
		padding: '0.3em 0',
		boxShadow: 'none',
		[theme.breakpoints.up('xl')]: {
			backgroundColor: theme.palette.background.default
		}
	},
	logoCont: {
		display: 'flex',
		alignItems: 'center',
		'&:hover': {
			textDecoration: 'none'
		}
	},
	logo: {
		maxWidth: '34px',
		height: 'auto',
		marginRight: '1em'
	},
	title: {
		letterSpacing: theme.spacing(0.2),
		fontWeight: 900,
		fontSize: '1.5rem',
		color: 'white',
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		}
	},
	titleSpan1: {
		color: theme.palette.primary.main
	},
	sectionUser: {
		color: '#fff'
	},
	menuButton: {
		marginLeft: '0.7em',
		color: '#fff'
	},
	itemsResponsivePosition: {
		[theme.breakpoints.down('xs')]: {
			display: 'none'
		}
	}
}));

// main menu links
const mainMenuLinks = [
	{
		id: 'home',
		href: '/',
		icon: <HomeIcon />,
		linkName: 'Home'
	},
	{
		id: 'local',
		href: '/local',
		icon: <MapIcon />,
		linkName: 'Near You'
	},
	{
		id: 'about',
		href: '/about',
		icon: <InfoIcon />,
		linkName: 'About'
	},
	{
		id: 'help',
		href: '/help',
		icon: <HelpIcon />,
		linkName: 'FAQ'
	}
];

// Navbar Component
const Navbar = props => {
	// styling classes
	const classes = useStyles();

	// load auth context
	const authContext = useContext(AuthContext);
	// destructure auth context
	const { isAuthenticated } = authContext;

	// load navbar context
	const navbarContext = useContext(NavbarContext);
	// destructure context
	const { toggleMainMenu, handleUserMenuOpen } = navbarContext;

	// user menu id
	const menuId = 'primary-user-account-menu';

	return (
		<div className={classes.grow}>
			<AppBar className={classes.navbar} color='transparent' position='fixed'>
				<Toolbar>
					<Link className={classes.logoCont} component={RouterLink} to='/'>
						<img className={classes.logo} src={logoPrimary} alt='logo' />
						<Typography className={classes.title} variant='h6' noWrap>
							<span className={classes.titleSpan1}>{props.title1}</span>
							<span className={classes.titleSpan2}>{props.title2}</span>
						</Typography>
					</Link>
					<div className={classes.grow} />
					<div className={classes.sectionUser}>
						{isAuthenticated && (
							<Fragment>
								<IconButton className={classes.itemsResponsivePosition} aria-label='show new messages' color='inherit'>
									<Badge badgeContent={4} color='secondary'>
										<MailIcon />
									</Badge>
								</IconButton>
								<IconButton
									className={classes.itemsResponsivePosition}
									aria-label='show new notifications'
									color='inherit'
								>
									<Badge badgeContent={17} color='secondary'>
										<NotificationsIcon />
									</Badge>
								</IconButton>
							</Fragment>
						)}
						<IconButton
							edge='end'
							aria-label='account of current user'
							aria-controls={menuId}
							aria-haspopup='true'
							onClick={handleUserMenuOpen}
							color='inherit'
						>
							<AccountCircleIcon />
						</IconButton>
						<IconButton
							onClick={() => toggleMainMenu(true)}
							edge='end'
							className={classes.menuButton}
							color='inherit'
							aria-label='open drawer'
						>
							<MenuIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<UserMenu menuId={menuId} />
			<MainMenu links={mainMenuLinks} title1={props.title1} title2={props.title2} />
		</div>
	);
};

// PropTypes
Navbar.propTypes = {
	title1: PropTypes.string.isRequired,
	title2: PropTypes.string.isRequired
};

// Default Props
Navbar.defaultProps = {
	title1: 'Share',
	title2: 'Stuff'
};

// export Navbar Component
export default Navbar;
