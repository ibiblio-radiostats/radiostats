import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DatePicker from "react-datepicker";

export default class FilterModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={this.props.open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={this.props.open}>
              <div>
                <h2 id="transition-modal-title">Transition modal</h2>
              </div>
            </Fade>
          </Modal>
        );
    }
}