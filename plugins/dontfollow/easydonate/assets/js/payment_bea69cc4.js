function redirect(data) {
    if (data['type'] == 'wait') {
        return true;
    }

    if (data['method'] == 'get') {
        if (data['data'].length == 0) {
            window.location.href = data['url'];
            return true;
        }
    }

    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = data['method'];
    form.action = data['url'];
    if (data['data']) {
        for (var name in data['data']) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = data['data'][name];
            form.appendChild(input);
        }
    }
    form.submit();
}