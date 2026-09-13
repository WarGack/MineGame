var currentTheme = getCurrentTheme()
body = $('body')

var switchLightBtn;
var switchDarkBtn;

if (currentTheme == 'dark') {
    switchTheme(currentTheme);
} else if (currentTheme == 'light') {
    switchTheme(currentTheme);
} else {
    switchTheme();
}

window.onload = () => {
    updateButtons();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isDark }) => {
        theme.value = isDark ? 'dark' : 'light';
    })
}

function getSystemBasedTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentTheme() {
    var currentTheme = $.cookie('theme');
    return currentTheme;
}

function setTheme(theme, withCookie = false) {
    if ($.cookie('theme')) {
        $.removeCookie('theme');
    }

    if (withCookie) {
        $.cookie('theme', theme, {
            path: '/'
        });
    }
}

function updateButtons(theme = null) {
    var currentTheme = theme || getCurrentTheme() || 'light';
    var isThemeSystem = theme ? true : false;

    if (!currentTheme) {
        currentTheme = getSystemBasedTheme();
        isThemeSystem = true;
    }

    var switchLightBtn = $('.theme-selector.theme-light');
    var switchDarkBtn = $('.theme-selector.theme-dark');
    var switchSystemTheme = $('.theme-selector.theme-system');

    $('.theme-selector.active').removeClass('active');

    if (isThemeSystem && !switchSystemTheme.hasClass('active')) {
        switchSystemTheme.addClass('active');
    }

    if (currentTheme == 'dark') {
        if (!isThemeSystem || (isThemeSystem && switchDarkBtn.hasClass('active-when-system'))) {
            if (!switchDarkBtn.hasClass('active')) {
                switchDarkBtn.addClass('active');
            }
        }
    } else if (currentTheme == 'light') {
        if (!isThemeSystem || (isThemeSystem && switchLightBtn.hasClass('active-when-system'))) {
            if (!switchLightBtn.hasClass('active')) {
                switchLightBtn.addClass('active');
            }
        }
    }

    if (isThemeSystem) {
        $('.theme-selector.active:not(.active-when-system)').removeClass('active');
    }
}

function switchTheme(theme = null, opposite = false) {
    function toLight(withCookie = true) {
        if (body.hasClass('dark-theme')) {
            body.removeClass('dark-theme');
        }
        if (!body.hasClass('light-theme')) {
            body.addClass('light-theme');
        }

        document.querySelectorAll('.previews-slider-wrapper img').forEach(image => {
            let srcset = image.getAttribute('srcset');
            let src = image.getAttribute('src');
            image.setAttribute('srcset', srcset.replace(/_dark_/, '_light_'));
            image.setAttribute('src', src.replace(/_dark_/, '_light_'));
        });

        setTheme('light', withCookie);
    }

    function toDark(withCookie = true) {
        if (body.hasClass('light-theme')) {
            body.removeClass('light-theme');
        }
        if (!body.hasClass('dark-theme')) {
            body.addClass('dark-theme');
        }

        document.querySelectorAll('.previews-slider-wrapper img').forEach(image => {
            let srcset = image.getAttribute('srcset');
            let src = image.getAttribute('src');
            image.setAttribute('srcset', srcset.replace(/_light_/, '_dark_'));
            image.setAttribute('src', src.replace(/_light_/, '_dark_'));
        });

        setTheme('dark', withCookie);
    }

    function toSystem() {
        let theme = getSystemBasedTheme();

        if (theme == 'light') {
            toLight(false);
        } else if (theme == 'dark') {
            toDark(false);
        }

        updateButtons(theme);
    }

    if (theme == 'system') {
        return toSystem();
    }

    let withCookie = true;

    if (!theme && !opposite) {
        theme = getSystemBasedTheme();
        withCookie = false;
    }

    var currentTheme = getCurrentTheme()
    if (theme == 'light') {
        toLight(withCookie);
    } else if (theme == 'dark') {
        toDark(withCookie);
    } else if (currentTheme == 'light') {
        toDark(withCookie);
    } else {
        toLight(withCookie);
    }

    updateButtons();
}