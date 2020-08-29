class global {
    static activeMenuItem () {
        let nav = document.URL.split('/')[3];
        $(`.nav-link[href="/${nav}"]`).parent().addClass('active');
    }
}

$(document).ready(() => {
    global.activeMenuItem();
});