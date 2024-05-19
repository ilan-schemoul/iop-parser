module.exports = grammar({
  name: 'iop',

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

  rules: {

    source_file: $ => repeat(choice(
      $.package_definition,
      $.typedef_definition,
      $.import_definition,

      // $.attribute,

      $.module_definition,
      $.data_structure_definition,
      $.enum_definition,
      $.interface_definition,
    )),

    package_definition: $ => seq(
      'package',
      $.identifier,
      ';',
    ),

    typedef_definition: $ => seq(
      "typedef",
      $.variable,
      ";"
    ),

    import_definition: $ => seq(
      "import",
      $.path,
      ";"
    ),

    path: $ => /[a-zA-Z][a-zA-Z0-9_.*]*/,

    module_definition: $ => seq(
      "module",
      $.identifier,
      optional($.module_inheritance),
      $.module_block,
      optional(";"),
    ),


    module_inheritance: $ => seq(
      ":",
      repeat(seq($.identifier, ",")),
      $.identifier,
    ),


    module_block: $ => seq(
      "{",
      repeat($.module_field),
      "}",
    ),

    module_field: $ => seq(
      optional($.tag),
      $.identifier,
      $.identifier,
      ";"
    ),

    enum_definition: $ => seq(
      "enum",
      $.identifier,
      $.enum_block,
      optional(";"),
    ),

    enum_block: $ => seq(
      "{",
      repeat(seq($.enum_field, ",")),
      "}",

    ),

    enum_field: $ => seq(
      optional($.tag),
      $.identifier,
      $.default_value,
    ),

    default_value: $ => seq(
      "=",
      $.value,
    ),

    interface_definition: $ => seq(
      "interface",
      $.identifier,
      $.rpcs,
      optional(";"),
    ),

    rpcs: $ => seq(
      "{",
      repeat($.rpc),
      "}",
      ";",
    ),

    rpc: $ => seq(
      // optional($.attribute),
      $.identifier,
      $.rpc_in,
      optional($.rpc_out),
      optional($.rpc_throw),
      ";",
    ),

    rpc_in: $ => seq(
      "in",
      choice($.argument_list, "null", "void"),
    ),

    rpc_out: $ => seq(
      "out",
      choice($.argument_list, "null", "void"),
    ),

    rpc_throw: $ => seq(
      "throw",
      $.identifier,
    ),

    argument_list: $ => seq(
      "(",
      repeat(seq($.variable, ",")),
      optional($.variable),
      ")"
    ),

    data_structure_definition: $ => seq(
      $.data_structure_type,
      $.identifier,
      $.data_structure_block,
    ),

    data_structure_type: $ => choice(
      'union',
      'class',
      'struct',
    ),

    data_structure_block: $ => seq(
      '{',
      repeat($.field),
      '}',
      optional(";"),
    ),

    field: $ => seq(
      optional($.tag),
      $.variable,
      ";",
    ),

    variable: $ => seq(
      $.primitive_type,
      optional($.type_specifier),
      $.identifier,
      optional($.default_value),
    ),

    primitive_type: $ => choice(
      'int',
      'string',
      'uint',
      'long',
      'ulong',
      'byte',
      'ubyte',
      'short',
      'ushort',
      'bool',
      'double',
      'bytes',
      'xml',
      'void',
      $.identifier,
    ),

    type_specifier: $ => choice(
      "?",
      "&",
      "[]",
    ),

    value: $ => repeat1(choice($.number, $.operator, $.constant)),

    number: $ => choice(
      /-?[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?/,
      /-?(0x[0-9a-fA-F]+|[1-9][0-9]*)[a-zA-Z]*/,
      /0[0-7]*[a-zA-Z]*/,
    ),

    operator: $ => choice(
      "<<",
      ">>",
      "**",
      "*",
      "+",
      "-",
      "/",
    ),

    constant: $ => choice(
      "true",
      "false",
    ),

    tag_number: $ => /[0-9]+/,

    tag: $ => seq(
      $.tag_number,
      ":",
    ),

    identifier: $ => /[a-zA-Z][a-zA-Z0-9_]*/,

    attribute: $ => seq(
      "@",
      $.identifier,
      $.argument_list,
    ),

    comment: _ => token(choice(
      seq('//', /(\\+(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      ),
    )),
  }
});

