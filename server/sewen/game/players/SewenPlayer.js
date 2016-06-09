import { makeEnum } from 'libs/enum';

import { BasePlayerDecorator } from 'server/core/game/players/player';

export const Side = makeEnum(['OWN', 'LEFT', 'RIGHT']);

export class SewenPlayer extends BasePlayerDecorator {
	constructor(corePlayer) {
		super(corePlayer);
	}
}

export default SewenPlayer;