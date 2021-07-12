import React from 'react';
export class MessageComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.delete = () => {
            const { deleteMessage, id, message, k } = this.props;
            void (deleteMessage === null || deleteMessage === void 0 ? void 0 : deleteMessage(id, message, k));
        };
    }
    get payload() {
        return this.props.message.bdy.pld;
    }
    get senderId() {
        return this.props.message.uid;
    }
    render() {
        const { id, k } = this.props;
        return (<div style={{ border: '1px solid black' }}>
        <span>
          {id}; {k && `Key: ${k}`}; From: {this.senderId}
        </span>
        <div>{this.payload}</div>
        <button onClick={this.delete}>Delete</button>
      </div>);
    }
}
//# sourceMappingURL=message-component.jsx.map