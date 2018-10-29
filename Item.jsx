import React from 'react';
import Linkify from 'react-linkify';

const Item = React.createClass({

    handleMouseOver: function() {
        var m = this.props.message;
        if (m.status == 'new' && m.from != 'my') {
            // this.props.onMouseOver(m);
        }
    },

    render: function() {
        var message = this.props.message;
        var messageClass = 'clearfix message ' + message.from + ' ' + message.status;
        var author = message.author;
        if(message.from === 'writer') {
            author = message.author + ' ID #' + message.senderId
        }
        if (message.my === true) {
            return (
                <div className={messageClass}>
                    <div className="message-block pull-right clearfix">
                        <div className="message-author">
                            <span>{author}</span>
                            <span className="pull-right pl20">
                                <span className="icon icon-extended" title={this.props.t.read}></span>
                                {message.formattedTime}
                            </span>

                        </div>
                        <div className="messageText">
                            <span className="message-core">
                                <Linkify properties={{target: '_blank'}}>{message.text}</Linkify>
                            </span>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div data-id={message.id} className={messageClass} onMouseOver={this.handleMouseOver}>
                        <div className="message-block">
                            <div className="message-author">
                                <span>{author}</span>
                                    <span className="pull-right pl20">
                                        <span className="icon icon-extended" title={this.props.t.read}></span>
                                        {message.formattedTime}
                                    </span>
                            </div>
                            <div className="messageText">
                                <span className="message-core">
                                    <Linkify properties={{target: '_blank'}}>{message.text}</Linkify>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
});

export default Item;
