$.request('onGetComponents', {
    success: function (components) {
        if (components) {
            for (let component in components) {
                $.request(component + '::onRender');
            }
        }
    }
});

function removeQueryParam(param) {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url);
}

removeQueryParam('server_id');


$(document).on('ajaxSetup', function (event, context) {
    context.options.beforeSend = function () {
        let loadingIndicator = $('.stripe-loading-indicator');
        if (loadingIndicator.hasClass('loaded')) {
            loadingIndicator.removeClass('loaded');
        }

        let body = $('body');
        if (!body.hasClass('oc-loading')) {
            body.addClass('oc-loading');
        }
    }

    context.options.complete = function (data) {
        let loadingIndicator = $('.stripe-loading-indicator');
        if (!loadingIndicator.hasClass('loaded')) {
            loadingIndicator.addClass('loaded');
        }

        let body = $('body');
        if (body.hasClass('oc-loading')) {
            body.removeClass('oc-loading');
        }
    }
});

var paymentType;
var paymentSystem;

function onRenderCaptcha() {
    if (!window.smartCaptcha) {
        return;
    }

    window.smartCaptcha.render('captcha-container', {
        sitekey: 'ysc1_g5NvgMsgGsVGVuCJcGS5LImcrreN2jCMRBvXG2ao6d5edd2a',
        invisible: true,
        hideShield: true,
        callback: token => {
            window.smartCaptcha.reset();

            $('#cart-form').request('onBuy', {
                update: {
                    cart_products: '.cart-products',
                    cart_cost: '.cart-cost',
                    shop: '.shop'
                },
                data: {
                    payment_type: paymentType,
                    payment_system: paymentSystem,
                    token: token,
                },
                complete: data => {
                    if (data['X_OCTOBER_REDIRECT'] !== undefined) {
                        window.location.href = data['X_OCTOBER_REDIRECT'];
                    }

                    if (data['success'])
                        redirect(data)

                    if (data["force"] === false)
                        return

                    pay(data["publicKey"], data["account"], data["signature"], data["sum"], data["desc"], data["locale"], data["currency"])
                }
            });
        },
    });
}

function onBuy(_paymentType, _paymentSystem) {
    paymentType = _paymentType;
    paymentSystem = _paymentSystem;

    $('#cart-form').request('onBuy', {
        update: {
            cart_products: '.cart-products',
            cart_cost: '.cart-cost',
            shop: '.shop'
        },
        data: {
            payment_type: paymentType,
            payment_system: paymentSystem,
        },
        complete: data => {
            if (data['X_OCTOBER_REDIRECT'] !== undefined) {
                window.location.href = data['X_OCTOBER_REDIRECT'];
            }

            if (data['success'])
                redirect(data)

            if (data["force"] === false)
                return

            pay(data["publicKey"], data["account"], data["signature"], data["sum"], data["desc"], data["locale"], data["currency"])
        }
    });
}