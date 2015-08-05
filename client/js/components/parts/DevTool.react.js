import Immutable from 'immutable';
import MoreartyComponent from 'client/js/components/parts/MoreartyComponent.react';
import Bootstrap from 'react-bootstrap';

import React from 'react'; // eslint-disable-line no-unused-vars
import Globals from 'client/js/components/libs/globals';
import MapHelper from 'client/js/components/common/map';

var Button = Bootstrap.Button;
var Glyphicon = Bootstrap.Glyphicon;
var ButtonToolbar = Bootstrap.ButtonToolbar;

export default class DevTool extends MoreartyComponent {
	constructor() {
		super(...arguments);

		this.localStorage = window.localStorage;
		this.getDefaultBinding().set('devTool', Immutable.fromJS({ open: false }));
	}

	render() {
		var binding = this.getDefaultBinding().get('devTool');
		var opened = binding && binding.get('open');
		var loadInput = null;
		if (opened) {
			loadInput = <textarea ref="loadContent"
			                      className="load-content"
			                      rows="10" cols="35" placeholder="Paste a JSON board">
				{binding.get('export')}
				</textarea>;
		}
		var localInfo = this.localStorage['devTool.context'];
		var localInput = null;
		if (localInfo !== undefined) {
			localInput = <Button onClick={this.restore.bind(this)}>
				<Glyphicon glyph={"play-circle"}/>
			</Button>;
		}

		return (<div id="dev" className={opened ? 'open' : ''}>
			{ opened ?
					<Glyphicon className={"pull-right"} glyph={"remove"}
					           onClick={this.close.bind(this)}/> :
					null }
			<ButtonToolbar>
				{ localInput }
				<Button onClick={this.load.bind(this)}>
					<Glyphicon glyph={"floppy-open"}/>
				</Button>
				<Button onClick={this.persist.bind(this)}>
					<Glyphicon glyph={"floppy-disk"}/>
				</Button>
				<Button onClick={this.export.bind(this)}>
					<Glyphicon glyph={"floppy-save"} title="Export current context"/>
				</Button>
				{ opened ?
						<Button onClick={this.clear.bind(this)}>
							<Glyphicon glyph={"floppy-remove"}/>
						</Button> :
						null }
			</ButtonToolbar>
			{ loadInput }
		</div>);
	}

	getBinding() {
		return this.getDefaultBinding().sub('devTool');
	}

	close() {
		this.getBinding().set('open', false);
	}

	load() {
		var binding = this.getBinding();
		var open = binding.get('open');

		if (!open) {
			// Display
			binding.set('open', true);
		} else {
			// Hide and load
			var content = this.refs.loadContent.getDOMNode().value.trim();
			this.getDefaultBinding.set(Immutable.fromJS(content));
			this.getBinding().set('open', false);

			// Previous method
			// var atomicUpdate = this.getDefaultBinding().atomically();

			// var content = this.refs.loadContent.getDOMNode().value.trim();
			// if (content) {
			// 	let definition = JSON.parse(content);
			// 	atomicUpdate = this.setContext(definition, atomicUpdate)
			// 			.set('devTool.export', content);
			// }

			// atomicUpdate.set('devTool.open', false)
			// 		.commit();
		}
	}

	persist() {
		this.localStorage['devTool.context'] = this.getBinding().get('export');
	}

	restore() {
		var localDev = JSON.parse(this.localStorage['devTool.context']);
		this.getDefaultBinding().set(Immutable.fromJS(localDev));
		this.getBinding().set('open', false);
		// this.setContext(localDev);
	}

	clear() {
		this.localStorage.removeItem('devTool.context');

		this.getBinding().atomically()
				.set('open', false)
				.set('export', undefined)
				.commit();
	}

	export() {
		var content = JSON.stringify(this.getDefaultBinding().get().toJS());

		this.getBinding().atomically()
			.set('open', true)
			.set('export', content)
			.commit();
	}

	setContext({ board: board, players: players, me: myInfo, message: message }, ctx) {
		if (ctx === undefined) {
			ctx = this.getDefaultBinding();
		}

		if (board) { ctx.set('game.board', Immutable.fromJS(MapHelper.init(board))); }
		if (players) {
			let playersBinding = this.getDefaultBinding().get('players')
					.withMutations(binding => {
						binding.clear();
						players.forEach((player) => binding.push(Immutable.fromJS(player)));
					});

			ctx.set('players', playersBinding);
		}
		if (myInfo) { ctx.set('me', Immutable.fromJS(myInfo)); }
		if (message) { ctx.set('game.message', Immutable.fromJS(message)); }

		return ctx.set('step', Globals.step.started);
	}
}

DevTool.displayName = 'DevTool';