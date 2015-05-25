
import Morearty from 'morearty';
import reactMixin from 'react-mixin';
import React from 'react';

export default class MoreartyComponent extends React.Component {
  constructor() {
    super(...arguments);
  }
}

reactMixin.onClass(MoreartyComponent, Morearty.Mixin);