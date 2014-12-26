'use strict';

var GameReact = React.createClass({displayName: "GameReact",
  render:function() {
    return (
      React.createElement("svg", {height: "600", width: "600", xmlns: "http://www.w3.org/2000/svg"}
        
      )
    );
  }
});

React.render(
  React.createElement(GameReact, null),
  document.getElementById('content')
);