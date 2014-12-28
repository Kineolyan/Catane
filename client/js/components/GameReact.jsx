'use strict';

var CaseReact = require('./CaseReact');
var React = require('react');

var GameReact = React.createClass({
  render() {
    return (
      <svg height="500" width="600" xmlns="http://www.w3.org/2000/svg">
        <CaseReact startX="50" startY="20" size="50" color="lightblue"/>
        <CaseReact startX="200" startY="20" size="50" color="lightgreen"/>

      </svg>
    );
  }
});

module.exports = GameReact;