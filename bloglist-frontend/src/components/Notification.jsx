import PropTypes from 'prop-types';

const Notification = ({ message, isError }) => {
  //
  if (message === null) {
    return null;
  }
  return (
    <div className={isError ? 'notification isError' : 'notification'}>
      {message}
    </div>
  );
};

export default Notification;

Notification.displayName = 'Notification';
Notification.propTypes = {
  message: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
};
