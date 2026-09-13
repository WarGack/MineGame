class EasyID {
    static setCookie(cname, cvalue, expminutes) {
        const d = new Date();
        d.setTime(d.getTime() + (expminutes * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    #getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    #syncResize(element) {
        window.addEventListener('message', message => {
            if (!message.isTrusted) {
                return;
            }

            if (message.origin != 'https://id.easyx.ru') {
                return;
            }

            if (message.data.type != 'easyid:height-changed') {
                return;
            }

            element.style.height = `${message.data.data.height}px`;
        });
    }

    #syncRedirect() {
        window.addEventListener('message', message => {
            if (!message.isTrusted) {
                return;
            }

            if (message.origin != 'https://id.easyx.ru') {
                return;
            }

            if (message.data.type != 'easyid:redirect') {
                return;
            }

            window.location.href = message.data.data.redirect;
        });
    }

    #canShowFrame() {
        return !this.#getCookie('easyid_hide_frame') && (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) >= 992;
    }

    callFramedAuth(config) {
        if (!this.#canShowFrame()) {
            return;
        }

        let css = `
            #easyid-frame-container {
                position: fixed;
                z-index: 9999;
                max-width: ${config.styles.maxWidth};
                width: ${config.styles.width};
                height: ${config.styles.height};
                margin: ${config.styles.margin};
                box-shadow: ${config.styles.boxShadow};
                top: ${config.styles.top};
                right: ${config.styles.right};
                transition-duration: 0.2s;
                transition-behavior: allow-discrete;
                display: none;
                opacity: 0;
            }

            @media (min-width: 992px) {
                #easyid-frame-container.is-visible {
                    display: block;
                    opacity: 1;
                    @starting-style {
                        opacity: 0;
                    }
                }
            }

            #easyid-frame-container iframe {
                height: 100%;
                width: 100%;
            }

            #easyid-frame-container \.close {
                padding: 9px;
                border-radius: 10px;
                line-height: 0;
                cursor: pointer;
                position: absolute;
                right: 25px;
                top: 14px;
            }
        `;

        let body = document.querySelector('body');
        let head = document.querySelector('head');

        let style = document.createElement('style');
        style.innerHTML = css;
        head.append(style);

        let frameContainer = document.createElement('div');
        frameContainer.classList.add('is-visible');
        frameContainer.id = 'easyid-frame-container';

        let closeButton = document.createElement('button');
        closeButton.classList.add('close');
        closeButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7M13 13L7 7M7 7L13 1M7 7L1 13" stroke="black"/>
            </svg>
        `;
        closeButton.addEventListener('click', function () {
            if (frameContainer.classList.contains('is-visible')) {
                frameContainer.classList.remove('is-visible');
            }
            EasyID.setCookie('easyid_hide_frame', 1, 360);
        });

        frameContainer.append(closeButton);

        this.#syncResize(frameContainer);
        this.#syncRedirect();

        let frame = document.createElement('iframe');

        frameContainer.append(frame);

        frame.src = `https://id.easyx.ru/widgets/auth?redirect=${encodeURIComponent('https://oauth.easydonate.ru/?redirect=' + window.location.href)}&iframe`;

        body.prepend(frameContainer);
    }
}
