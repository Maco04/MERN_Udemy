import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { alerts } from '../../actions/alert';

const Alert2 = ({ alerts }) => (
  <section className="container">
      <div className="alert-wrapper">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
              {alert.msg}
            </div>
          ))}
        </div>
  </section>
  
);

// const Alert2=({alerts})=>
//   alerts!== null &&
//   alerts.length>0&&
//   alerts.map(alert=>(
//     <div key={alert.id}className={`alert alert-${alert.alertType}`}>
//       {alert.msg}
//    </div>
//  ));

Alert2.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert2);