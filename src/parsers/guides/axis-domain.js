import {Top, Bottom} from './constants';
import guideMark from './guide-mark';
import {RuleMark} from '../marks/marktypes';
import {AxisDomainRole} from '../marks/roles';

export default function(spec, config, userEncode, dataRef) {
  var orient = spec.orient,
      zero = {value: 0},
      encode = {}, enter, update, u, u2, v;

  encode.enter = enter = {
    opacity: zero,
    stroke: {value: config.tickColor},
    strokeWidth: {value: config.tickWidth}
  };

  encode.exit = {
    opacity: zero
  };

  encode.update = update = {
    opacity: {value: 1}
  };

  (orient === Top || orient === Bottom)
    ? (u = 'x', v = 'y')
    : (u = 'y', v = 'x');
  u2 = u + '2',

  enter[v] = zero;
  update[u] = enter[u] = position(spec, 0);
  update[u2] = enter[u2] = position(spec, 1);

  return guideMark(RuleMark, AxisDomainRole, null, dataRef, encode, userEncode);
}

function position(spec, pos) {
  return {scale: spec.scale, range: pos};
}
