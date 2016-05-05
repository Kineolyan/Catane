import { Reply } from 'server/core/com/sockets.js';
import * as starter from 'server/catane/game/games/game-spec.starter.js';

describe('Reply', function() {
  beforeEach(function() {
    this.env = starter.createLocalGame(2);
    [this.p, this.other] = this.env.players.map(p => p.client);
    this.reply = new Reply(this.env.players[0].player);
  });

  describe('constructor', function() {
    it('has no initial actions', function() {
      expect(this.reply._actions).toBeEmpty();
    });
  });

  describe('#processMessage', function() {
    it('returns the message and channel if defined', function() {
      var [channel, message] = this.reply.processMessage('default', 'channel', { value: 42 });
      expect(channel).toEqual('channel');
      expect(message).toEqual({ value: 42, _success: true });
    });

    it('uses the default channel if none specified', function() {
      var [channel, message] = this.reply.processMessage('default', { value: 43 });
      expect(channel).toEqual('default');
      expect(message.value).toEqual(43);
    });
  });

  describe('#emit', function() {
    beforeEach(function() {
      this.reply.emit({ ok: true });
      this.reply.execute('channel');
    });

    it('sends the message to the user', function() {
      const message = this.p.lastMessage('channel');
      expect(message.ok).toBe(true);
    });

    it('does not send anything to the other players', function() {
      expect(this.other.messages('channel')).toBeEmpty();
    });
  });

  describe('#others', function() {
    beforeEach(function() {
      this.reply.others({ ok: false });
      this.reply.execute('channel');
    });

    it('sends the message to all but the user', function() {
      const message = this.other.lastMessage('channel');
      expect(message.ok).toBe(false);
    });

    it('does not send anything to the other players', function() {
      expect(this.p.messages('channel')).toBeEmpty();
    });
  });

  describe('#all', function() {
    beforeEach(function() {
      this.reply.all({ ok: 'yeah' });
      this.reply.execute('channel');
    });

    it('sends the message to all players', function() {
      this.env.players.forEach(p => {
        const message = p.client.lastMessage('channel');
        expect(message.ok).toEqual('yeah');
      })
    });
  });
});
