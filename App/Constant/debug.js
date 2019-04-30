import ERROR from 'constant/error-code';

let SHOW_DEBUG_ONSCREEN = ( active = Boolean ( false ), msg = '' ) => {
    let show_msg = msg;
    alert(show_msg);

    (typeof active === 'boolean') ? (active) ? activatedYellowBox() : nonActivatedYellowBox() : ERROR.ERR_CODE_DEBUG_ONSCREEN_MODE();
}

let nonActivatedYellowBox = () => {
    console.disableYellowBox = true;
}

let activatedYellowBox = () => {
    console.disableYellowBox = false
}

let SHOW_MSG = (msg='') => {
    console.warn('DEBUG DATA : ' + msg);
}

export default {
    SHOW_DEBUG_ONSCREEN,
    SHOW_MSG
}