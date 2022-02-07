Renders a value for user display. Counterpart to [#`show`](#function-show), which renders a value for debug purposes. Intended only for [#scalar](#function-isscalar) values. Rules:

  * [#Nil](#function-isnil) → `''`.
  * [#Scalar](#function-isscalar) → default JS stringification.
  * All other inputs → `TypeError` exception.
