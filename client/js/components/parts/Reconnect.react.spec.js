import 'client/js/components/libs/test';

import React from 'react/addons';
import reactBootstrap from 'react-bootstrap';

import Reconnect from 'client/js/components/parts/Reconnect.react.js';

var Button = reactBootstrap.Button;
var utils = React.addons.TestUtils;

describe('<Reconnect>', function() {
  function render(obj) {
    var data = { id: 1, sid: 2 };
    obj.reconnect = utils.renderIntoDocument(<Reconnect init={data}/>);
  }

  beforeEach(function() {
    this.localStorage = global.window.localStorage;
  });

  afterEach(function() {
    this.localStorage.removeItem('server');
  });

  describe('with previous session', function() {
    beforeEach(function() {
      this.localStorage.server = JSON.stringify({
        id: 1, sid: 1
      });
      render(this);
    });

    it('says that a previous session exists', function() {
      expect(this.reconnect.hasPreviousSession()).toBe(true);
    });

    it('renders a container with id "reconnect"', function() {
      // TODO check the existence of the div
    });

    it('renders a button', function() {
      expect(utils.scryRenderedComponentsWithType(this.reconnect, Button).length).toBe(1);
    });

    describe('on click', function() {
      beforeEach(function() {
        this.reconnect.reconnect();
      });

      it('disappears', function() {
        expect(utils.scryRenderedComponentsWithType(this.reconnect, Button).length).toBe(0);
      });
    });
  });

  describe('with expired previous session', function() {
    beforeEach(function() {
      this.localStorage.server = JSON.stringify({
        id: 2, sid: 3
      });
      render(this);
    });

    it('does not find a previous session', function() {
      expect(this.reconnect.hasPreviousSession()).toBe(false);
    });

    it('renders am empty container with id "reconnect"', function() {
      // TODO check the existence of the div
      expect(utils.scryRenderedComponentsWithType(this.reconnect, Button).length).toBe(0);
    });
  });

  describe('without previous session', function() {
    beforeEach(function() {
      render(this);
    });

    it('does not find a previous session', function() {
      expect(this.reconnect.hasPreviousSession()).toBe(false);
    });

    it('renders am empty container with id "reconnect"', function() {
      // TODO check the existence of the div
      expect(utils.scryRenderedComponentsWithType(this.reconnect, Button).length).toBe(0);
    });
  });

});