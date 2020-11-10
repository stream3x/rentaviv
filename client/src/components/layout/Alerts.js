// Node Modules
import React, { useContext } from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
// Context
import AlertContext from '../../context/alert/alertContext';

// define styles
const useStyles = makeStyles(theme => ({
	alertItem: {
		width: '100%'
	}
}));

// Alerts Component
const Alerts = () => {
	// define classes
	const classes = useStyles();

	// load alert context
	const alertContext = useContext(AlertContext);

	return (
		<TransitionGroup>
			{alertContext.alerts.length > 0 &&
				alertContext.alerts.map(alert => (
					<motion.div
						transition={{
							duration: 0.6,
							type: 'tween'
							// damping: 10,
							// stiffness: 70
						}}
						initial={{ opacity: 1 }}
						animate={{ opacity: 0 }}
						key={alert.id}
						className={classes.alertItem}
					>
						<Alert className={`alert-${alert.type}`} severity={alert.type}>
							{alert.msg}
						</Alert>
					</motion.div>
				))}
		</TransitionGroup>
	);
};

// export Alerts Component
export default Alerts;
