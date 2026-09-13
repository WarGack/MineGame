new WOW().init();

function copyToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    $.oc.flashMsg({
        'text': 'Скопировано',
        'class': 'success',
        'interval': 1.5
    })
}

$(document).ready(function () {
    $(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $('.navbar-dropdown-menu-wrapper').hasClass('show');
        if (_opened === true && !clickover.hasClass('navbar-dropdown-menu-btn') && !clickover.hasClass('navbar-dropdown-menu')) {
            $('.navbar-dropdown-menu-btn').click();
        }
    });
});

$('.modal').on('shown.bs.modal', () => {
    var body = $('body');
    if (!body.hasClass('modal-open')) {
        body.addClass('modal-open');
    }
});

function setUsername(username) {
    const input = document.querySelector('.form-control#username');
    input.value = username;

    input.dispatchEvent(new Event('input', { bubbles: true }));
}