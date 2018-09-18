import React, { Component } from 'react';

class Modal extends Component {
  render() {
    const {title, leftPanel, rightPanel} = this.props;

    return (
        <div className="modal show">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>       
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body">
                        <div>
                            {leftPanel}
                        </div> 
                        <div>
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