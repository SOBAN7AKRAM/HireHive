const LoadingModal = ({ show, text }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content w40" style={{height: '15rem'}}>
          <div className="modal-body d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>
            <span className="ms-3">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
