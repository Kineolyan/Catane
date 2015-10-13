/**
 * Root class implementing delegate API.
 * This does nothing and throws on every call. Delegates with purposes
 * just have to extend that class and override wanted methods.
 */
export class DefaultDelegate {

  /**
   * Constructor.
   * @param  {GameManager} manager the game manager
   */
  constructor(manager) {
    this._manager = manager;
    this._listener = this._manager.createSubListener();
  }

	complete(notifyManager = false) {
		this._listener.off();
    if (notifyManager) {
      this._manager.notifyDelegateCompletion();
    }
	}

  /**
   * Throws an error to indicate unsupported action.
   * @private
   */
  throwUnsupported() {
    throw new Error('Unsupported action');
  }

  /**
   * Selects a tile.
   * @throws Error since the method is unsupported
   */
  selectTile() {
    this.throwUnsupported();
  }

  /**
   * Selects a path.
   * @throws Error since the method is unsupported
   */
  selectPath() {
    this.throwUnsupported();
  }

  /**
   * Selects a city.
   * @throws Error since the method is unsupported
   */
  selectCity() {
    this.throwUnsupported();
  }

  /**
   * Selects a card.
   * @throws Error since the method is unsupported
   */
  selectCard() {
    this.throwUnsupported();
  }

}

export default DefaultDelegate;
