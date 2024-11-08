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
