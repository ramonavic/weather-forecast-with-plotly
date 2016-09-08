
var initialState = {
  location: '',
  data: {},
  dates: [],
  templs: [],
  selected: {
    date: '',
    temp: null
  }
};

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_LOCATION':
      return Object.assign({}, state, {
        location: action.location
      });
    case 'SET_SELECTED_TEMP':
      return Object.assign({}, state, {
        selected: {
          temp: action.temp,
          date: state.selected.date
        }
      });
    case 'SET_SELECTED_DATE':
      return Object.assign({}, state, {
        selected: {
          temp: state.selected.temp,
          date: action.date
        }
      });
    default:
      return state;
  }
}
