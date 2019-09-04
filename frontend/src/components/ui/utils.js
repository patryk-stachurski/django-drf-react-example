export const ifPressedEnter = callback => event =>
    (event.keyCode === 13 || event.which === 13) && callback(event);
