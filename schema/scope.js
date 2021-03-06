export default {
  "defs": {
    "scope": {
      "type": "object",
      "properties": {
        "encode": {"$ref": "#/defs/encode"},
        "signals": {
          "type": "array",
          "items": {"$ref": "#/defs/signal"}
        },
        "data": {
          "type": "array",
          "items": {"$ref": "#/defs/data"}
        },
        "scales": {
          "type": "array",
          "items": {"$ref": "#/defs/scale"}
        },
        "axes": {
          "type": "array",
          "items": {"$ref": "#/defs/axis"}
        },
        "legends": {
          "type": "array",
          "items": {"$ref": "#/defs/legend"}
        },
        "marks": {
          "type": "array",
          "items": {
            "oneOf": [
              {"$ref": "#/defs/markGroup"},
              {"$ref": "#/defs/markVisual"}
            ]
          }
        }
      }
    }
  }
};
