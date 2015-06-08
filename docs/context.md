#Morearty context docs
#### Basics composition

    start: {
                games: [], //all the games availables [{id: 3, id: 6}]
                gameChosen: {}, //the game chosen  {id: 2}
              },
    game: {
                board: {}, //the board for the game, see common/map.js
                dice: {//dice
                  enabled: false, //can throw
                  rolling: false,  //is rolling
                  values: [1,1] //values on the dice
                },
                message: data.message //message displayed for the current status
              },
              players: Players, //all player in the game, see common/player.js
              step: Globals.step.init, //current step of the game. See lib/global.js
              server: data.server //info send by the server for the reconnect
            }

#### Morearty Component

https://github.com/Kineolyan/Catane/blob/develop/client/js/components/parts/MoreartyComponent.react.js
A basic component using the MoreartyMixin and setting up the context for this component. 

#### Board
Board - an instance of 
(https://github.com/Kineolyan/Catane/blob/develop/client/js/components/common/map.js) 

#####Load the board from the context
From a Morearty Component =>

    var binding = this.getDefaultBinding();
    var container = binding.get('game.board').toJS(); // get the container for the board, transform to JS
    var board = container.getBoard(); //get the board from the container

In a listener, `binding` is available as the `_binding` property.

##### Save the board
To update the board context =>

    board.setSelectableType('cities');//set the cities selectable
    binding.set('game.board', Immutable.fromJS(container)); 
    
    //Save the container, not the instance itself. Immutable works with Plain JavaScript Object, and not with instance of class if we want the diff on Morearty side to work.
    
####Players
Players - all the players
 (https://github.com/Kineolyan/Catane/blob/develop/client/js/components/common/players.js) 
 
#####Load the players
Same as the board, a container for the players
From a Morearty Component =>

    var binding = this.getDefaultBinding();
    var players = binding.get('players').toJS(); // get the container for the players, transform to JS
    var player = players.getMe(); //get the board from the container

#####Update a player
  player.name = 'Bob';
  binding.set('players', Immutable.fromJS(players));//save the container not the instance, same story as map


#### Sub binding
Some components use a sub binding
 (see https://github.com/Kineolyan/Catane/blob/develop/client/js/components/parts/GameInterface/GameInterface.react.js)

In these components (Dice, Map, etc...) we have a reduced context. For instance, in Map, we only access to the board directly =>

    var container = this.getDefaultBinding().get().toJS();
    // => the board container directly
They are re-rendered only when the path (e.g. 'game.board' is updated.)
