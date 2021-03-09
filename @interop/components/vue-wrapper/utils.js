

const camelizeRE = /-(\w)/g;
export const camelize = str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
};

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};

export function getInitialProps(propsList) {
  const res = {};
  propsList.forEach(key => {
    res[key] = undefined;
  });
  return res;
}

export function callHooks(vm, hook) {
  if (vm) {
    let hooks = vm.$options[hook] || [];
    if (!Array.isArray(hooks)) {
      hooks = [hooks];
    }
    hooks.forEach(hook => {
      hook.call(vm);
    });
  }
}

export function createCustomEvent(name, args) {
  return new CustomEvent(name, {
    bubbles: false,
    cancelable: false,
    detail: args.length === 1 ? args[0] : args,
  });
}

const isBoolean = val => /function Boolean/.test(String(val));
const isNumber = val => /function Number/.test(String(val));

export function convertAttributeValue(value, name, { type } = {}) {
  if (isBoolean(type)) {
    if (value === 'true' || value === 'false') {
      return value === 'true';
    }
    if (value === '' || value === name) {
      return true;
    }
    return value != null;
  } else if (isNumber(type)) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? value : parsed;
  } else {
    return value;
  }
}

export function toVNodes(children, h) {
  const res = [];
  for (let i = 0, l = children.length; i < l; i++) {
    res.push(toVNode(children[i], h));
  }
  return res;
}

function toVNode(node, h) {
  if (node.nodeType === 3) {
    return node.data.trim() ? node.data : null;
  } else if (node.nodeType === 1) {
    const data = {
      attrs: getAttributes(node),
      domProps: {
        innerHTML: node.innerHTML,
      },
    };
    if (data.attrs.slot) {
      data.slot = data.attrs.slot;
      delete data.attrs.slot;
    }
    return h(node.tagName, data);
  } else {
    return null;
  }
}

function getAttributes(node) {
  const res = {};
  for (let i = 0, l = node.attributes.length; i < l; i++) {
    const attr = node.attributes[i];
    res[attr.nodeName] = attr.nodeValue;
  }
  return res;
}