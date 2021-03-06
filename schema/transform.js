function transformSchema(name, def) {
  function parameters(list) {
    list.forEach(function(param) {
      if (param.type === 'param') {
        var schema = {
          "oneOf": param.params.map(subParameterSchema)
        };
        props[param.name] = param.array
          ? {"type": "array", "items": schema}
          : schema;
      } else if (param.params) {
        parameters(param.params)
      } else {
        props[param.name] = parameterSchema(param);
        if (param.required) required.push(param.name);
      }
    })
  }

  var props = {
        "type": {"enum": [name]},
        "signal": {"type": "string"}
      },
      required = ["type"];

  parameters(def.params || []);

  var schema = {
    "type": "object",
    "properties": props,
    "additionalProperties": false,
    "required": required
  };

  return schema;
}

function parameterSchema(param) {
  var p = {};

  switch (param.type) {
    case 'projection':
    case 'data':
      p = {"type": "string"};
      break;
    case 'field':
      p = {
        "oneOf": [
          {"$ref": "#/refs/scaleField"},
          {"$ref": "#/refs/paramField"}
        ]
      };
      break;
    case 'compare':
      p = {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "field": {
                "oneOf": [
                  {"type": "string"},
                  {"$ref": "#/refs/signal"}
                ]
              },
              "order": {"$ref": "#/refs/sortOrder"}
            }
          },
          {
            "type": "object",
            "properties": {
              "field": {
                "type": "array",
                "items": {
                  "anyOf": [
                    {"type": "string"},
                    {"$ref": "#/refs/signal"}
                  ]
                }
              },
              "order": {
                "type": "array",
                "items": {"$ref": "#/refs/sortOrder"}
              }
            }
          }
        ]
      };
      break;
    case 'enum':
      p = {
        "anyOf": [
          {"enum": param.values},
          {"$ref": "#/refs/signal"}
        ]
      };
      break;
    case 'expr':
      p = {"$ref": "#/refs/exprString"};
      break;
    case 'string':
      p = {"anyOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]};
      break;
    case 'number':
      p = {"anyOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]};
      break;
    case 'boolean':
      p = {"anyOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}]};
      break;
  }

  if (param.expr) {
    var expr = {"$ref": "#/refs/expr"},
        field = {"$ref": "#/refs/paramField"};
    p = p.anyOf
      ? (p.anyOf.push(expr), p.anyOf.push(field), p)
      : {"oneOf": [p, expr, field]};
  }

  if (param.array) {
    p = {
      "oneOf": [
        {"type": "array", "items": p},
        {"$ref": "#/refs/signal"}
      ]
    };
    if (param.length != null) {
      p.minItems = p.maxItems = param.length;
    }
    if (param.null) {
      p.oneOf.push({"type": "null"});
    }
  }

  if (param.default) {
    p.default = param.default;
  }

  return p;
}

function subParameterSchema(sub) {
  var props = {},
      required = [],
      key = sub.key;

  for (var name in key) {
    props[name] = {"enum": [key[name]]};
    required.push(name);
  }

  sub.params.forEach(function(param) {
    props[param.name] = parameterSchema(param);
    if (param.required) required.push(param.name);
  })
  var schema = {
    "type": "object",
    "properties": props,
    "additionalProperties": false,
    "required": required
  };

  return schema;
}

export default function(definitions) {
  var transforms = [],
      marks = [],
      defs = {
        transform: {"oneOf": transforms},
        transformMark: {"oneOf": marks}
      };

  for (var name in definitions) {
    var key = name + 'Transform',
        ref = {"$ref": "#/defs/" + key},
        md = definitions[name].metadata;

    defs[key] = transformSchema(name, definitions[name]);
    if (!(md.generates || md.changes)) marks.push(ref);
    transforms.push(ref);
  }

  return {"defs": defs};
}
