import React from 'react';
import ReactDOM from 'react-dom';

import Item from './Item.jsx';

const List = React.createClass({

    /**
     * Sort messages
     * @param messages
     * @returns {*}
     */
    sortMessages: function(messages) {
        messages.sort(function (a, b) {
            return b.time - a.time;
        });
        return messages;
    },

    /**
     * Added today and yesterday separator items
     * @param messages
     * @returns {Array}
     */
    formatMessages: function(messages) {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);

        var yesterday = new Date();
        yesterday.setHours(0);
        yesterday.setMinutes(0);
        yesterday.setSeconds(0);
        yesterday.setDate(today.getDate() - 1);

        var laterList = [];
        var yesterdayList = [];
        var todayList = [];

        for (var i = 0; i < messages.length; i++) {
            if (messages[i].time < (yesterday.getTime() / 1000)) {
                laterList.push(messages[i]);
            } else if (messages[i].time < (today.getTime() / 1000)) {
                yesterdayList.push(messages[i]);
            } else {
                todayList.push(messages[i]);
            }
        }

        var result = [];

        if (laterList.length) {
            result = laterList;
        }

        if (yesterdayList.length) {
            if (result.length) {
                result.push({yesterday: true, id: 'yesterday'});
            }
            result = result.concat(yesterdayList);
        }

        if (todayList.length) {
            if (result.length) {
                result.push({today: true, id: 'today'});
            }
            result = result.concat(todayList);
        }

        return result;
    },

    /**
     * Prepare messages (sort and format)
     * @param messages
     * @returns {Array.<T>}
     */
    prepareMessages: function(messages) {
        messages = this.sortMessages(messages);
        messages = messages.reverse();

        return this.formatMessages(messages);
    },

    newMessagesSelector: '.message.support.new,.message.writer.new',

    getFirstNotReadMessage: function() {
        var node = ReactDOM.findDOMNode(this);
        return $(node).find(this.newMessagesSelector)[0];
    },

    scrollToFirstNew: function() {
        var node = ReactDOM.findDOMNode(this);
        var message = this.getFirstNotReadMessage();
        if (message) {
            node.scrollTop = $(message).position().top;
        } else {
            node.scrollTop = node.scrollHeight;
        }
    },

    msgForMarkAsRead: {},

    /**
     * Collect messages for mark "as read"
     * Messages are "as read" if they are in the visible part of scrollable container
     */
    handleMouseOver: function() {
        var offset = -50;
        var self = this;

        var list = $(ReactDOM.findDOMNode(self));
        var boxHeight = list.height();

        list.find(this.newMessagesSelector).each(function() {
            var elTop = $(this).position().top;
            if (elTop < (boxHeight + offset) && elTop >= offset) {
                self.props.markAsReadMessage($(this).attr('data-id'));
            }
        });
    },

    componentDidMount: function() {
        this.props.onScroll(ReactDOM.findDOMNode(this));

        var self = this;
        $('body').on('select.chat', function() {
            self.scrollToFirstNew();
        });

        this.scrollToFirstNew();
    },

    componentDidUpdate: function() {
        this.props.doAutoScroll(this.scrollToFirstNew);
    },

    render: function() {
        var messagesNodes = this.prepareMessages(this.props.list).map(function(message) {
            if (message.today) {
                return (
                    <div key="today" className="text-center message-day">
                        <span className="message-day-text">{this.props.t.today}</span>
                    </div>
                );
            }
            if (message.yesterday) {
                return (
                    <div key="yesterday" className="text-center message-day">
                        <span className="message-day-text">{this.props.t.yesterday}</span>
                    </div>
                );
            }
            return (
                <Item
                    message={message}
                    key={message.id}
                    t={this.props.t}
                    onMouseOver={this.props.onItemMouseOver} />
            );
        }.bind(this));

        return (
            <div className="messagesList" onMouseOver={this.handleMouseOver}>
                {messagesNodes}
            </div>
        );
    }
});

export default List;
