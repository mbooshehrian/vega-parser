import {Index, Label, Size, Total, Value} from './constants';
import guideMark from './guide-mark';
import {SymbolMark} from '../marks/marktypes';
import {LegendSymbolRole} from '../marks/roles';

export default function(spec, config, userEncode, dataRef) {
  var zero = {value: 0},
      encode = {}, enter, update;

  encode.enter = enter = {
    opacity: zero,
    shape: {value: config.symbolType},
    size: {value: config.symbolSize},
    strokeWidth: {value: config.symbolStrokeWidth}
  };

  if (!spec.fill) {
    enter.stroke = {value: config.symbolColor};
  }

  encode.exit = {
    opacity: zero
  };

  encode.update = update = {
    opacity: {value: 1}
  };

  enter.x = update.x = {
    field: Size,
    mult:  0.5
  };

  enter.y = update.y = {
    field: Size,
    mult:  0.5,
    offset: {
      field: Total,
      offset: {
        field: {group: 'entryPadding'},
        mult: {field: Index}
      }
    }
  };

  ['shape', 'size', 'fill', 'stroke', 'opacity'].forEach(function(scale) {
    if (spec[scale]) {
      update[scale] = enter[scale] = {scale: spec[scale], field: Value};
    }
  });

  return guideMark(SymbolMark, LegendSymbolRole, Label, dataRef, encode, userEncode);
}
