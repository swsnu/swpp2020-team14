import { createMuiTheme } from "@material-ui/core";
const palettes = {
    wine1: {
        primary: { main: '#9E2141' },
        secondary: { main: '#DB511F' }
    },
    red1: {
        primary: { main: '#9E0F15' },
        secondary: { main: '#EB8AA0' }
    },
    brown1: {
        primary: { main: '#9E401D' },
        secondary: { main: '#EB9171' }
    },
    slateblue1: {
        primary: { main: '#35299F' },
        secondary: { main: '#8E83EB' }
    },
    slateblue2: {
        primary: { main: '#3153A8' },
        secondary: { main: '#6C81B7' }
    },
    salmon1: {
        primary: { main: '#E06F69' },
        secondary: { main: '#E6B3B1' }
    },
};

export const getTheme = function () {
    return createMuiTheme({
        palette: palettes.slateblue2
    });
};