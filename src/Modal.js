import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component {
  render() {
    const {title, leftPanel, rightPanel} = this.props;

    return (
        <div className="modal show">
            <div id="main-modal" className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>       
                        <h3 className="modal-title">{title}</h3>
                    </div>
                    <div id="main-body">
                        <div className="col-md-6 h-100">
                            {leftPanel}
                        </div> 
                        <div className="col-md-6 h-100" style={{backgroundColor: '#f3ecfe'}}>
                            {rightPanel}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Modal;