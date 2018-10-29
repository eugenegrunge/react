import React from 'react';
import Box from './Box.jsx';

const Container = React.createClass({
    getInitialState: function() {
        return {
            supportUnreadMessages: 0,
            writerUnreadMessages: 0
        };
    },

    updateState: function (data) {
        this.setState({
            supportUnreadMessages: data.supportUnreadMessages,
            writerUnreadMessages: data.writerUnreadMessages
        });
    },

    decSupportNewMessages: function() {
        if (this.state.supportUnreadMessages > 0) {
            this.state.supportUnreadMessages -= 1;
            this.setState(this.state);
        }
    },

    decWriterNewMessages: function () {
        if (this.state.writerUnreadMessages > 0) {
            this.state.writerUnreadMessages -= 1;
            this.setState(this.state);
        }
    },

    clearSupportCounter: function(counter) {
        this.state.supportUnreadMessages -= counter;
        if (this.state.supportUnreadMessages < 0) {
            this.state.supportUnreadMessages = 0;
        }
        this.setState(this.state);
    },

    clearWriterCounter: function(counter) {
        this.state.writerUnreadMessages -= counter;
        if (this.state.writerUnreadMessages < 0) {
            this.state.writerUnreadMessages = 0;
        }
        this.setState(this.state);
    },

    selectTabHandler: function() {
        setTimeout(function() {
            $('body').trigger('select.chat');

            var activeWriterTab = $('.nav-tabs li:nth-child(2)').hasClass('active');

            $('.nav-tabs li.active').parents('#messages-container').find('.messages-head').css('background', '#a27fdb');

            if(activeWriterTab === true) {
                $('.nav-tabs li.active').parents('#messages-container').find('.messages-head').css('background', '#3399cc');
            }

        }, 0);
    },

    // @TODO: need refactor
    render: function() {
        var supportUnreadMessages = this.state.supportUnreadMessages || '';
        var writerUnreadMessages = this.state.writerUnreadMessages || '';

        return (
            <div className="messages-body">
                <ul className="nav nav-tabs" role="tablist">

                        <li className="active support-tab">
                            <a href="#support-chat" aria-controls="support-chat" role="tab" data-toggle="tab"
                               onClick={this.selectTabHandler}>
                                <span className="messages-tab-circle">
                                    <i className="material-icons">supervisor_account</i>
                                </span>
                                <span className="support-tab-text">{this.props.t.support}</span>
                                <span className="badge">{supportUnreadMessages}</span>
                            </a>
                        </li>


                        <li className="writer-tab">
                            <a href="#writer-chat" aria-controls="writer-chat" role="tab" data-toggle="tab" onClick={this.selectTabHandler}>
                                <span className="messages-tab-circle">
                                    <i className="material-icons">school</i>
                                </span>
                                <span className="writer-tab-text">{this.props.t.writer}</span>
                                <span className="badge">{writerUnreadMessages}</span>
                            </a>
                        </li>

                </ul>
                <div className="tab-content">

                        <div id="support-chat" className="tab-pane mt10 active">
                            <Box
                                process="support"
                                clearCounter={this.clearSupportCounter}
                                decNewMessage={this.decSupportNewMessages}
                                canWrite={this.props.access.can_send_to_support}
                                onStateChanged={this.updateState}
                                pullInterval={this.props.pullInterval}
                                fetchUrl={this.props.fetchUrl}
                                sendUrl={this.props.sendUrl}
                                readUrl={this.props.readUrl}
                                t = {this.props.t}
                                responseText = {this.props.t.support_response}
                                supportStatusMessage={this.props.supportStatusMessage}
                            />
                        </div>


                        <div id="writer-chat" className="tab-pane mt10">
                            <Box
                                process="writer"
                                clearCounter={this.clearWriterCounter}
                                decNewMessage={this.decWriterNewMessages}
                                canWrite={this.props.access.can_send_to_writer}
                                onStateChanged={this.updateState}
                                pullInterval={this.props.pullInterval}
                                fetchUrl={this.props.fetchUrl}
                                sendUrl={this.props.sendUrl}
                                readUrl={this.props.readUrl}
                                t = {this.props.t}
                                responseText = {this.props.t.writer_response}
                                noWriterMessages={this.props.t.no_writer_messages}
                                writerStatusMessage={this.props.writerStatusMessage}
                            />
                        </div>

                </div>
            </div>
        );
    }
});

export default Container;
