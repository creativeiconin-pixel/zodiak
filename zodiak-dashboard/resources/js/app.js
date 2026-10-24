// Small touches that make the Op-Center feel smooth. Plain JS, no framework.

const drawer = document.getElementById('op-drawer');

function setDrawer(open) {
    if (!drawer) {
        return;
    }
    const fade = drawer.querySelector('[data-op-fade]');
    const slide = drawer.querySelector('[data-op-slide]');
    document.querySelectorAll('[data-op-menu-open]').forEach((button) => button.setAttribute('aria-expanded', String(open)));

    if (open) {
        drawer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            fade.classList.replace('opacity-0', 'opacity-100');
            slide.classList.replace('-translate-x-full', 'translate-x-0');
        });
        drawer.querySelector('input, a, button')?.focus({ preventScroll: true });
    } else {
        fade.classList.replace('opacity-100', 'opacity-0');
        slide.classList.replace('translate-x-0', '-translate-x-full');
        document.body.style.overflow = '';
        setTimeout(() => drawer.classList.add('hidden'), 300);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.closest('[data-op-menu-open]')) {
        setDrawer(true);
    } else if (event.target.closest('[data-op-menu-close]')) {
        setDrawer(false);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer && !drawer.classList.contains('hidden')) {
        setDrawer(false);
    }

    // "/" jumps to the order search, like most admin tools
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        const search = [...document.querySelectorAll('[data-op-search]')].find((input) => input.offsetParent !== null);
        if (search) {
            event.preventDefault();
            search.focus();
            search.select();
        }
    }
});

// Saving… state on submit, so a slow connection never leads to a double Verify or double refund
document.addEventListener('submit', (event) => {
    const form = event.target;
    if (event.defaultPrevented || form.method.toLowerCase() === 'get' || form.hasAttribute('data-no-busy')) {
        return;
    }
    const button = event.submitter ?? form.querySelector('button[type=submit], button:not([type])');
    if (!button) {
        return;
    }
    // Disable after the browser has read the button's name/value into the request
    requestAnimationFrame(() => {
        form.querySelectorAll('button[type=submit], button:not([type])').forEach((other) => (other.disabled = true));
        button.dataset.label = button.innerHTML;
        button.classList.add('opacity-80', 'cursor-wait');
        button.innerHTML = '<span class="material-symbols-outlined text-base animate-spin">progress_activity</span> Saving…';
    });
});

// Pages restored from the back/forward cache must not stay stuck on "Saving…"
window.addEventListener('pageshow', (event) => {
    if (!event.persisted) {
        return;
    }
    document.querySelectorAll('button[data-label]').forEach((button) => {
        button.innerHTML = button.dataset.label;
        button.disabled = false;
        button.classList.remove('opacity-80', 'cursor-wait');
        delete button.dataset.label;
    });
});

// Filter dropdowns apply straight away
document.addEventListener('change', (event) => {
    const select = event.target.closest('select[data-autosubmit]');
    select?.form?.requestSubmit();
});

// "Saved" messages fade out after a few seconds; error messages stay until the page changes
document.querySelectorAll('[role=status]').forEach((message) => {
    if (message.closest('[data-keep]') || message.hasAttribute('aria-live')) {
        return;
    }
    setTimeout(() => {
        message.style.transition = 'opacity 400ms ease, transform 400ms ease';
        message.style.opacity = '0';
        message.style.transform = 'translateY(-4px)';
        setTimeout(() => message.remove(), 420);
    }, 5000);
});

// Sub-menu links jump to a part of a page: close the phone menu, and open the section if it folds
document.addEventListener('click', (event) => {
    if (event.target.closest('#op-drawer [data-op-menu-link]')) {
        setDrawer(false);
    }
});

function openTargetSection() {
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target instanceof HTMLDetailsElement) {
        target.open = true;
    }
}

openTargetSection();
window.addEventListener('hashchange', openTargetSection);
