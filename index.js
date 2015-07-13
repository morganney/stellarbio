var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var $ = require('jquery');

var ScrollMixin = {
  componentDidMount: function() {
    $(window).scroll(_.throttle(this.onScroll, 1000));
  },

  componentWillUnmount: function() {
    $(window).off('scroll');
  }
};

var Label = React.createClass({
  render: function() {
    return (
      <span className={this.props.classes}>New</span>
    );
  }
});

var Headline = React.createClass({
  render: function() {
    var labelClass = this.props.isNew ? 'label label-default' : 'hide';

    return (
      <li>
        <Label classes={labelClass} />
        <h2>{this.props.title}</h2>
        <p><em>{this.props.published}</em></p>
      </li>
    );
  }
});

var App = React.createClass({
  mixins: [ScrollMixin],

  getDocumentHeight: function() {
    var d = document;

    // normalize browser differences
    return Math.max(
      d.body.scrollHeight, d.documentElement.scrollHeight,
      d.body.offsetHeight, d.documentElement.offsetHeight,
      d.body.clientHeight, d.documentElement.clientHeight
    );
  },

  getInitialState: function() {
    return {
      offset: 0,
      limit: 10,
      headlines: []
    };
  },

  componentDidMount: function() {
    this.fetchHeadlines(this.state.offset, this.state.limit);
  },

  fetchHeadlines: function(offset, limit) {
    $.get(this.props.url, {offset, limit})
      .done(json => {
        this.setState({
          limit,
          offset: offset + limit,
          headlines: this.state.headlines.concat(json.news)
        });
      });
  },

  render: function() {
    const FORMAT = 'dddd, MMMM Do YYYY, h:mm:ss a';
    var offset = this.state.offset;
    var limit = this.state.limit;
    var headlines = this.state.headlines.map((headline, index) => {

      return (
        <Headline
          key={index}
          title={headline.title}
          isNew={(index + limit) >= offset}
          published={Moment(headline.published).format(FORMAT)}
        />
      );
    });

    return (
      <ul className='list-inline'>{headlines}</ul>
    );
  },

  onScroll: function(e) {
    const BUFFER = 100;
    var scrolledView = $(window).scrollTop() + $(window).height();
    var docHeight = this.getDocumentHeight() - BUFFER;
    var userNearBottom = (scrolledView > docHeight);

    if (userNearBottom) {
      this.fetchHeadlines(this.state.offset, this.state.limit);
    }
  }
});

React.render(
  <App url='http://www.stellarbiotechnologies.com/media/press-releases/json' />,
  document.getElementById('headlines')
);
