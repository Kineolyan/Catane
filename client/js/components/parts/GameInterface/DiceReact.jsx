'use strict';

/* 
  A tile of the map 
*/

var React = require('react');
var Group = require('react-art').Group;
var Rectangle = require('react-art/shapes/rectangle');
var Text = require('react-art').Text;
var Globals = require('../../libs/globals');
var Socket = require('../../libs/socket');

var DiceReact = React.createClass({


  getInitialState() {
    return {
      first: 1,
      second: 1,
      rolling: false,
      launched: false
    };
  },

  componentDidMount() {
    this.initSocket();
  },

  result(dice) {
    var round = 10;

    var chg = (time, result) => {
      setTimeout(() => {

        this.setState({
          first: result ? result.first : parseInt(Math.random() * 6 + 1),
          second: result ? result.second : parseInt(Math.random() * 6 + 1),
          rolling: result ? false : true
        });

        round -= 1;
        if(round > 0) {
          chg(time * 1.15);
        } else if (round === 0) {
          chg(time, dice);
        } else {
          this.setState({launched: false});
        }

      }, time);
    };

    chg(200);

  },

  launch() {
    if(!this.state.launched) {
      this.setState({launched: true}, () => {
        Socket.emit(Globals.socket.mapDice);
      });
    }
  },
  render() {
    
    var size = this.props.size,
        margin = size + 10,
        color = this.state.rolling ? '#FBF896' : '#D1FFA3';
    return (
      <Group x={this.props.x} y={this.props.y} onClick={this.launch}>
        
        <Rectangle width={size} height={size} stroke="black" fill={color} />
        <Text y={size / 4} x={size / 2} fill="black" alignment="center" font={{'font-size': size / 2 + 'px'}}>
          {this.state.first + ''}
        </Text>

        <Rectangle x={margin} width={size} height={size} stroke="black" fill={color} />
        <Text y={size / 4} x={margin + size / 2} fill="black" alignment="center" font={{'font-size': size / 2 + 'px'}}>
          {this.state.second + ''}
        </Text>
      </Group>
      );
  },


  initSocket() {
    Socket.on(Globals.socket.mapDice, (data) => {
      this.result(data.result);
    });
  }
});

module.exports = DiceReact;