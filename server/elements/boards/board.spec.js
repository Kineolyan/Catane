import Board from './board';

describe('Board', function() {

  describe('constructor', function() {
  	beforeEach(function() {
  		this.board = new Board();
  	});

  	it('has no tiles', function() {
  		console.log(this.board);
  		expect(this.board.tiles).toBeEmpty();
  	});

  	it('has no cities', function() {
  		expect(this.board.cities).toBeEmpty();
  	});

  	it('has no paths', function() {
  		expect(this.board.paths).toBeEmpty();
  	});
  });

  describe('#generate', function() {
  	beforeEach(function() {
  		this.board = new Board();
  		this.board.generate({
  			forEachTile: function(action) {
  				action("tile");
  			},
  			forEachCity: function(action) {
  				action("city-1");
  				action("city-2");
  			},
  			forEachPath: function(action) {
  				action("path-1");
  				action("path-2");
  				action("path-3");
  			}
  		});
  	});

  	it('has all generated tiles', function() {
  		expect(this.board.tiles).toEqual([ "tile" ]);
  	});

  	it('has all generated cities', function() {
  		expect(this.board.cities).toEqual([ 'city-1', 'city-2' ]);
  	});

  	it('has all generated paths', function() {
  		expect(this.board.paths).toEqual([ 'path-1', 'path-2', 'path-3' ]);
  	});
  });

});
