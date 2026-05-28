(function () {
  var NAV_BRIDGE_VERSION = '2026-05-28-domain-polish';
  if (window.brqResourceNavBridgeVersion === NAV_BRIDGE_VERSION) return;
  window.brqResourceNavBridgeVersion = NAV_BRIDGE_VERSION;
  window.brqResourceNavBridgeLoaded = true;

  var RESOURCE_HREF = '/resource-center/';
  var RESOURCE_TEXT = 'GUIDES';
  var EDUCATION_HREF = '/education/';
  var EDUCATION_TEXT = 'EDUCATION';

  function text(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function hasResourceLink(root) {
    return Array.prototype.some.call(root.querySelectorAll('a'), function (link) {
      var href = link.getAttribute('href') || '';
      return href === RESOURCE_HREF || href === '/resource-center';
    });
  }

  function hasEducationLink(root) {
    return Array.prototype.some.call(root.querySelectorAll('a'), function (link) {
      var href = link.getAttribute('href') || '';
      return href === EDUCATION_HREF || href === '/education';
    });
  }

  function normalizeResourceLinks(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a'), function (link) {
      var href = link.getAttribute('href') || '';
      if (href !== RESOURCE_HREF && href !== '/resource-center') return;
      var mobileLabel = link.querySelector('.header-menu-nav-item-content');
      if (mobileLabel) mobileLabel.textContent = RESOURCE_TEXT;
      else link.textContent = RESOURCE_TEXT;
      link.setAttribute('aria-label', 'Guides and resources');
    });
  }

  function normalizeEducationLinks(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a'), function (link) {
      var href = link.getAttribute('href') || '';
      if (href !== EDUCATION_HREF && href !== '/education') return;
      var mobileLabel = link.querySelector('.header-menu-nav-item-content');
      if (mobileLabel) mobileLabel.textContent = EDUCATION_TEXT;
      else link.textContent = EDUCATION_TEXT;
      link.setAttribute('aria-label', 'Real estate license exam prep education');
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

  function ensureCompactDesktopStyle() {
    if (document.getElementById('brq-resource-nav-bridge-style')) return;
    var style = document.createElement('style');
    style.id = 'brq-resource-nav-bridge-style';
    style.textContent = [
      '@media (min-width:900px) and (max-width:1500px){',
      '.header-display-desktop .header-nav-list{white-space:nowrap!important;}',
      '.header-display-desktop .header-nav-item{margin-right:2px!important;}',
      '.header-display-desktop .header-nav-list a,.header-display-desktop .header-nav-folder-title{font-size:12px!important;letter-spacing:0!important;white-space:nowrap!important;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function addDesktopLink() {
    document.querySelectorAll('.header-nav-list').forEach(function (nav) {
      normalizeResourceLinks(nav);
      normalizeEducationLinks(nav);
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

  function addDesktopEducationLink() {
    document.querySelectorAll('.header-nav-list').forEach(function (nav) {
      normalizeEducationLinks(nav);
      if (hasEducationLink(nav)) return;
      var item = document.createElement('div');
      item.className = 'header-nav-item header-nav-item--collection brq-education-nav-item';

      var link = document.createElement('a');
      link.href = EDUCATION_HREF;
      link.setAttribute('data-animation-role', 'header-element');
      link.textContent = EDUCATION_TEXT;
      item.appendChild(link);

      var guides = findItemByLabel(nav, RESOURCE_TEXT);
      var blog = findItemByLabel(nav, 'BLOG');
      var contact = findItemByLabel(nav, 'CONTACT');
      if (guides) insertAfter(nav, item, guides);
      else if (blog) insertAfter(nav, item, blog);
      else if (contact) nav.insertBefore(item, contact);
      else nav.appendChild(item);
    });
  }

  function addMobileLink() {
    document.querySelectorAll('.header-menu-nav-wrapper').forEach(function (wrapper) {
      normalizeResourceLinks(wrapper);
      normalizeEducationLinks(wrapper);
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

  function addMobileEducationLink() {
    document.querySelectorAll('.header-menu-nav-wrapper').forEach(function (wrapper) {
      normalizeEducationLinks(wrapper);
      if (hasEducationLink(wrapper)) return;
      var item = document.createElement('div');
      item.className = 'container header-menu-nav-item header-menu-nav-item--collection brq-education-menu-item';

      var link = document.createElement('a');
      link.href = EDUCATION_HREF;

      var label = document.createElement('div');
      label.className = 'header-menu-nav-item-content';
      label.textContent = EDUCATION_TEXT;
      link.appendChild(label);
      item.appendChild(link);

      var guides = findItemByLabel(wrapper, RESOURCE_TEXT);
      var blog = findItemByLabel(wrapper, 'BLOG');
      var contact = findItemByLabel(wrapper, 'CONTACT');
      if (guides) insertAfter(wrapper, item, guides);
      else if (blog) insertAfter(wrapper, item, blog);
      else if (contact) wrapper.insertBefore(item, contact);
      else wrapper.appendChild(item);
    });
  }

  function applyNavBridge() {
    ensureCompactDesktopStyle();
    addDesktopLink();
    // Squarespace now owns the Education nav item. Keep this commented out so
    // the bridge does not create a duplicate EDUCATION link in the main nav.
    // addDesktopEducationLink();
    addMobileLink();
    // addMobileEducationLink();
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
