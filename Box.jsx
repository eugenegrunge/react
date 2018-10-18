import React from 'react';
import List from './List.jsx';
import Form from './Form.jsx';

const Box = React.createClass({

    readyForMarkAsRead: {},

    getInitialState: function() {
        return {
            obj: {},
            list: [],
            nextPage: 1,
            canLoad: true,
            canSend: true,
            enableScroll: true
        };
    },

    enableScroll: function() {
        this.state.enableScroll = true;
    },

    disableScroll: function() {
        this.state.enableScroll = false;
    },

    doAutoScroll: function(scrollCallback) {
        if (this.state.enableScroll) {
            scrollCallback();
        }
    },

    markAsReadMessages: function() {
        var msgIds = Object.keys(this.readyForMarkAsRead);
        if (msgIds.length) {
            this.clearMarked(msgIds);
            this.submitMarkAsRead(msgIds);
        }
    },

    componentDidMount: function() {
        var self = this;
        this.loadMessages(1);
        if (this.props.pullInterval) {
            setInterval(function() {
                self.loadMessages(1);
            }, parseInt(this.props.pullInterval) * 1000);
        }

        setInterval(this.markAsReadMessages, 2000);
    },

    loadPreviousMessages: function() {
        this.loadMessages(this.state.nextPage, function() {
            this.disableScroll();
        }.bind(this));
    },

    handleScroll: function(node) {
        var self = this;
        $(node).scroll(function() {
            if (this.scrollTop < 100) {
                self.loadPreviousMessages();
            }
            if (this.scrollHeight == (this.scrollTop + $(this).height())) {
                self.enableScroll();
            } else {
                self.disableScroll();
            }
        });
    },

    loadMessages: function(page, then) {
        if (this.state.canLoad && page) {
            $.ajax({
                url: this.props.fetchUrl,
                data: {
                    process: this.props.process,
                    page: page
                },
                dataType: 'json',
                cache: false,
                success: function (res) {
                    if (then) {
                        then();
                    }
                    this.updateState(res);
                    this.setState({
                        resData: res.data
                    });
                    this.state.canLoad = true;

                }.bind(this),
                beforeSend: function() {
                    this.state.canLoad = false;
                }.bind(this)
            });
            return true;
        }
        return false;
    },

    sendMessage: function(text, callback) {
        if (this.state.canSend) {
            $.ajax({
                url: this.props.sendUrl,
                dataType: 'json',
                type: 'POST',
                data: { text: text, process: this.props.process },
                success: function(res) {
                    this.setState({
                        resData: res.data
                    });
                    this.enableScroll();
                    this.updateState(res);
                    if (callback) {
                        callback(res);
                    }
                }.bind(this),
                complete: function() {
                    this.state.canSend = true;
                }.bind(this),
                beforeSend: function() {
                    this.state.canSend = false;
                }.bind(this)
            });
        }
    },

    submitMarkAsRead: function(msgIds) {
        if (this.props.readUrl) {
            $.ajax({
                url: this.props.readUrl,
                type: 'POST',
                data: { msgIds: msgIds, process: this.props.process}
            });
        }
    },

    clearMarked: function(msgIds) {
        for (var i = 0; i < msgIds.length; i++) {
            delete this.readyForMarkAsRead[msgIds[i]];
        }
    },

    markAsReadMessage: function(msgId) {
        this.props.decNewMessage();
        var messages = this.state.list;
        var result = $.grep(messages, function(e) { return e.id == msgId; });
        if (result.length) {
            result[0].status = 'read';
            this.readyForMarkAsRead[msgId] = 1;
            this.state.list = messages;
            this.setState(this.state);
        }
    },

    markAllNewAsRead: function() {
        var counter = 0;
        for (var i = 0; i < this.state.list.length; i++) {
            if (!this.state.list[i].my && this.state.list[i].status == 'new') {
                counter++;
                this.state.list[i].status = 'read';
                this.readyForMarkAsRead[this.state.list[i].id] = 1;
            }
        }
        this.props.clearCounter(counter);
        this.setState(this.state);
    },

    updateState: function(res) {
        this.props.onStateChanged(res);

        var state = this.state;

        for (var i = 0; i < res.data.length; i++) {
            state.obj[res.data[i].id] = res.data[i];
        }

        var list = [];
        for (var id in state.obj) {
            list.push(state.obj[id]);
        }

        state.list = list;
        state.nextPage = res.nextPage;

        this.setState(state);
    },

    render: function() {
        return (
            <div className="messagesBox clearfix">
                {
                    (this.props.process == 'support' && (this.state.resData && this.state.resData.length === 0)) ?
                        <div className="noSupportMessage deep-gray-text">
                            <div dangerouslySetInnerHTML={{__html: this.props.supportStatusMessage}} />
                        </div>
                        : null
                }
                {
                    (this.props.process == 'writer' && (this.state.resData && this.state.resData.length === 0)) ?
                        <div className="noWriterMessage deep-gray-text">
                            <div dangerouslySetInnerHTML={{__html: this.props.writerStatusMessage}} />
                        </div>
                    : null
                }
                <List
                    list={this.state.list}
                    onScroll={this.handleScroll}
                    doAutoScroll={this.doAutoScroll}
                    markAsReadMessage={this.markAsReadMessage}
                    onListMouseOver={this.markAsRead}
                    t={this.props.t}
                />
                {   this.props.canWrite &&
                <Form onMessageSend={this.sendMessage}
                      markAllNewAsRead={this.markAllNewAsRead}
                      t={this.props.t}
                      responseText={this.props.responseText}
                />
                }
            </div>
        );
    }
});

export default Box;
