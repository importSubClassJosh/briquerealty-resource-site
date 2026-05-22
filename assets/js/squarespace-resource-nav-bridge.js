(function () {
  if (window.brqResourceNavBridgeLoaded) return;
  window.brqResourceNavBridgeLoaded = true;

  var RESOURCE_HREF = '/resource-center/';
  var RESOURCE_TEXT = 'RESOURCES';

  function text(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function hasResourceLink(root) {
    return Array.prototype.some.call(root.querySelectorAll('a'), function (link) {
      var href = link.getAttribute('href') || '';
      return href === RESOURCE_HREF || href === '/resource-center' || text(link.textContent) === RESOURCE_TEXT;
    });
  }

  function insertAfter(parent, node, reference) {
    if (reference && reference.nextSibling) parent.insertBefore(node, reference.nextSibling);
    else parent.appendChild(node);
  }

  function findItemByLabel(root, label) {
    var target = text(label);
    var links = root.querySelectorAll('a, button');
    for (var i = 0; i < links.length; i += 1) {
      if (text(links[i].textContent) === target) {
        return links[i].closest('.header-nav-item, .header-menu-nav-item');
      }
    }
    return null;
  }

  function addDesktopLink() {
    document.querySelectorAll('.header-nav-list').forEach(function (nav) {
      if (hasResourceLink(nav)) return;
      var item = document.createElement('div');
      item.className = 'header-nav-item header-nav-item--collection brq-resource-nav-item';

      var link = document.createElement('a');
      link.href = RESOURCE_HREF;
      link.setAttribute('data-animation-role', 'header-element');
      link.textContent = RESOURCE_TEXT;
      item.appendChild(link);

      var blog = findItemByLabel(nav, 'BLOG');
      var contact = findItemByLabel(nav, 'CONTACT');
      if (blog) insertAfter(nav, item, blog);
      else if (contact) nav.insertBefore(item, contact);
      else nav.appendChild(item);
    });
  }

  function addMobileLink() {
    document.querySelectorAll('.header-menu-nav-wrapper').forEach(function (wrapper) {
      if (hasResourceLink(wrapper)) return;
      var item = document.createElement('div');
      item.className = 'container header-menu-nav-item header-menu-nav-item--collection brq-resource-menu-item';

      var link = document.createElement('a');
      link.href = RESOURCE_HREF;

      var label = document.createElement('div');
      label.className = 'header-menu-nav-item-content';
      label.textContent = RESOURCE_TEXT;
      link.appendChild(label);
      item.appendChild(link);

      var blog = findItemByLabel(wrapper, 'BLOG');
      var contact = findItemByLabel(wrapper, 'CONTACT');
      if (blog) insertAfter(wrapper, item, blog);
      else if (contact) wrapper.insertBefore(item, contact);
      else wrapper.appendChild(item);
    });
  }

  function applyNavBridge() {
    addDesktopLink();
    addMobileLink();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyNavBridge);
  else applyNavBridge();

  var scheduled = false;
  var observer = new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      applyNavBridge();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
