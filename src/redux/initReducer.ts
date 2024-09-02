export interface PropsBackflushFilter {
    ymd?: string;
    line?: string;
}
export interface MRedux {
    login: boolean;
    empcode: string;
    img: string;
    name: string;
    surn: string;
    fullName: string;
    backflush?: PropsBackflushFilter;
    page?: string;
}
const initialState: MRedux = {
    login: false,
    empcode: '',
    img: '',
    fullName: '',
    name: '',
    surn: '',
}

const IndexReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                login: true,
                empcode: action.payload.empcode,
                img: action.payload.img,
                name: action.payload.name,
                surn: action.payload.surn,
                fullName: action.payload.fullName
            }
        case 'LOGOUT':
            return {
                ...state,
                login: false,
                empcode: '',
                img: '',
                name: '',
                surn: '',
                fullName: ''
            }
        case 'BACKFLUSH_SET_FILTER':
            return {
                ...state,
                backflush: {
                    ymd: action.payload.ymd,
                    line: action.payload.line
                }
            }
        case 'SET_PAGE':
            return {
                ...state,
                page: action.payload.page
            }
        default:
            return state
    }
}
export default IndexReducer;
