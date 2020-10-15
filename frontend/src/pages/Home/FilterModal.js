import React from 'react';
import Modal from '@material-ui/core/Modal';

export default class FilterModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal open={this.props.open}>
                Hello
            </Modal>
        );
    }
}