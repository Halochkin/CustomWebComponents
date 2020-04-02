### Recursive element with `open` attribute

TreeNodes with a recursive open attribute
In this example we use an attribute open to hide or show the content of an element. The tree-nodes can be nested inside each other like nodes in a tree, and when you:
add the open attribute on a node, it will show its content and also ensures that its parentNode is open too, if that node is also a tree-node.
remove the open attribute, it will hide its content and also ensure that all its tree-node childNodes are also not open.
