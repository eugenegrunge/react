import React from 'react';
import ReactDOM from 'react-dom';

const Form = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            isEmptyText: true,
            textTooLong: false
        };
    },

    handleTextChange: function(e) {
        this.checkText(e.target.value);
    },

    checkText: function(value, fromSubmit) {
        this.setState({text: value});
        var msgLength = value.trim().length;

        this.state.isEmptyText = (msgLength == 0);

        var node = ReactDOM.findDOMNode(this);

        if (msgLength > 1000) {
            this.state.textTooLong = true;
            node.classList.add("has-error");
        } else if (msgLength == 0 && fromSubmit) {
            this.state.textTooLong = false;
            node.classList.add("empty-form");
        } else {
            this.state.textTooLong = false;
            node.classList.remove("has-error");
            node.classList.remove("empty-form");
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();
        this.submitMsg(e.target.elements["text"]);
    },
    
    submitMsg: function (textarea) {
        this.checkText(textarea.value, true);

        if (this.state.isEmptyText || this.state.textTooLong) {
            return;
        }

        this.props.onMessageSend(this.state.text.trim(), function() {
            this.setState({text: ''});
        }.bind(this));  
    },

    handleFocus: function() {
        this.props.markAllNewAsRead();
    },

    handleKeyPress: function (e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            this.submitMsg(e.target);
        }
    },

    render: function() {
        return (
            <div className="messagesForm">
                <div className="line mb10"></div>
                <form onSubmit={this.handleSubmit} onKeyPress={this.handleKeyPress} >
                    <div className="pl20 pr20">
                        <span className="gray-text placed-text fs12">{this.props.responseText}</span>
                    </div>
                    <textarea name="text" onFocus={this.handleFocus} onChange={this.handleTextChange} onPaste={this.handleTextChange} value={this.state.text} placeholder={this.props.t.write_message} />
                    <div className="help-block">{this.props.t.characters_limit_exceeded}</div>
                    <div className="pl20 pr20">
                        <span className='gray-text placed-text message-enter-send fs12'>{this.props.t.sendingAdvice}</span>
                        <button type="submit" className="btn btn-success pull-right"><i className="material-icons">send</i></button>
                    </div>
                </form>
            </div>
        );
    }
});

export default Form;
